import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateCardDto } from "./dto/create-card.dto";
import { MoveCardDto } from "./dto/move-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { ActivitiesService } from "../activities/activities.service";
import { ActivityType, NotificationType } from "@prisma/client";
import { NotificationsService } from "../notifications/notifications.service";
import { BoardsGateway } from "../boards/boards.gateway";

@Injectable()
export class CardsService {
  constructor(
    private prisma: PrismaService,
    private activitiesService: ActivitiesService,
    private notificationsService: NotificationsService,
    private boardsGateway: BoardsGateway,
  ) { }

  private async assertBoardMember(userId: string, listId: string) {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
      include: { board: { include: { members: true } } },
    });

    if (!list) throw new NotFoundException("List not found");

    const isMember = list.board.members.some((m) => m.userId === userId);
    if (!isMember && list.board.createdById !== userId) {
      throw new ForbiddenException("Not a board member");
    }
    return list;
  }

  private async assertCardAccess(userId: string, cardId: string) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      include: {
        list: {
          include: {
            board: {
              include: { members: true },
            },
          },
        },
      },
    });

    if (!card) throw new NotFoundException("Card not found");

    const isMember = card.list.board.members.some((m) => m.userId === userId);
    if (!isMember && card.list.board.createdById !== userId) {
      throw new ForbiddenException("Not a board member");
    }

    return card;
  }

  async list(userId: string, listId: string) {
    await this.assertBoardMember(userId, listId);

    return this.prisma.card.findMany({
      where: {
        listId,
        isArchived: false,
      },
      orderBy: { position: "asc" },
      include: {
        labels: {
          include: {
            label: true,
          },
        },
        members: true,
      },
    });
  }

  async create(userId: string, dto: CreateCardDto) {
    const list = await this.assertBoardMember(userId, dto.listId);

    const lastCard = await this.prisma.card.findFirst({
      where: { listId: dto.listId },
      orderBy: { position: "desc" },
    });

    const position = lastCard ? Number(lastCard.position) + 1 : 1;

    const card = await this.prisma.card.create({
      data: {
        title: dto.title,
        description: dto.description,
        listId: dto.listId,
        position: position,
      },
      include: {
        labels: {
          include: {
            label: true,
          },
        },
        members: true,
      },
    });

    await this.activitiesService.logActivity(
      list.boardId,
      userId,
      ActivityType.CREATE_CARD,
      card.id,
      `Carte "${card.title}" créée dans la liste "${list.title}"`
    );

    // Notify board members
    await this.notificationsService.notifyBoardMembers(
      list.boardId,
      [userId],
      NotificationType.CARD_CREATED,
      `Nouvelle carte "${card.title}" créée dans "${list.title}"`,
      card.id,
    );

    // Emit WebSocket event
    this.boardsGateway.emitCardCreated(list.boardId, {
      card,
      listId: list.id,
    });

    return card;
  }

  async move(userId: string, dto: MoveCardDto) {
    const card = await this.prisma.card.findUnique({
      where: { id: dto.cardId },
      include: { list: true },
    });
    if (!card) throw new NotFoundException("Card not found");

    // Check permissions for source and target lists
    const sourceList = await this.assertBoardMember(userId, card.listId);
    let targetList = sourceList;

    if (dto.listId && dto.listId !== card.listId) {
      targetList = await this.assertBoardMember(userId, dto.listId);
    }

    const targetListId = dto.listId || card.listId;
    const isMovingToList = targetListId !== card.listId;

    let newPosition = dto.newPosition;

    if (isMovingToList) {
      // Strategy: Append to end of list
      const lastCard = await this.prisma.card.findFirst({
        where: { listId: targetListId },
        orderBy: { position: "desc" },
      });
      newPosition = lastCard ? Number(lastCard.position) + 1 : 1;
    } else {
      // Strategy: Use provided position (calculated by frontend as (before + after) / 2)
      // If no position provided, keep same (or append if logic requires, but assuming frontend sends it)
      if (newPosition === undefined) {
        return card; // No change
      }
    }

    const updatedCard = await this.prisma.card.update({
      where: { id: dto.cardId },
      data: {
        listId: targetListId,
        position: newPosition,
      },
      include: {
        labels: {
          include: {
            label: true,
          },
        },
        members: true,
      },
    });

    if (isMovingToList) {
      await this.activitiesService.logActivity(
        sourceList.boardId,
        userId,
        ActivityType.MOVE_CARD,
        updatedCard.id,
        `Carte "${updatedCard.title}" déplacée de "${sourceList.title}" vers "${targetList.title}"`
      );

      // Notify board members
      await this.notificationsService.notifyBoardMembers(
        sourceList.boardId,
        [userId],
        NotificationType.CARD_MOVED,
        `Carte "${updatedCard.title}" déplacée vers "${targetList.title}"`,
        updatedCard.id,
      );
    }

    // Emit WebSocket event
    this.boardsGateway.emitCardMoved(sourceList.boardId, {
      card: updatedCard,
      fromListId: sourceList.id,
      toListId: targetListId,
    });

    return updatedCard;
  }

  async update(userId: string, cardId: string, dto: UpdateCardDto) {
    const card = await this.assertCardAccess(userId, cardId);

    // If changing list, verify access to new list
    if (dto.listId && dto.listId !== card.listId) {
      await this.assertBoardMember(userId, dto.listId);
    }

    const updatedCard = await this.prisma.card.update({
      where: { id: cardId },
      data: {
        title: dto.title,
        description: dto.description,
        listId: dto.listId,
        position: dto.position ? Number(dto.position) : undefined,
        isArchived: dto.isArchived,
      },
      include: {
        labels: {
          include: {
            label: true,
          },
        },
        members: true,
      },
    });

    if (dto.description !== undefined && dto.description !== card.description) {
      await this.activitiesService.logActivity(
        card.list.boardId,
        userId,
        ActivityType.UPDATE_DESCRIPTION,
        card.id,
        `Description modifiée pour la carte "${card.title}"`
      );

      // Notify board members
      await this.notificationsService.notifyBoardMembers(
        card.list.boardId,
        [userId],
        NotificationType.CARD_UPDATED,
        `Carte "${card.title}" mise à jour`,
        card.id,
      );
    }

    // Emit WebSocket event
    this.boardsGateway.emitCardUpdated(card.list.boardId, {
      card: updatedCard,
    });

    return updatedCard;
  }

  async archive(userId: string, cardId: string) {
    const card = await this.assertCardAccess(userId, cardId);

    const updatedCard = await this.prisma.card.update({
      where: { id: cardId },
      data: {
        isArchived: true,
      },
      include: {
        labels: {
          include: {
            label: true,
          },
        },
        members: true,
      },
    });

    await this.activitiesService.logActivity(
      card.list.boardId,
      userId,
      ActivityType.DELETE_CARD,
      card.id,
      `Carte "${card.title}" archivée`
    );

    // Notify board members
    await this.notificationsService.notifyBoardMembers(
      card.list.boardId,
      [userId],
      NotificationType.CARD_DELETED,
      `Carte "${card.title}" archivée`,
      card.id,
    );

    // Emit WebSocket event
    this.boardsGateway.emitCardDeleted(card.list.boardId, {
      cardId: card.id,
      listId: card.listId,
    });

    return updatedCard;
  }

  /**
   * Duplicate a card: copy title, description, labels and append to the end of the same list
   */
  async duplicate(userId: string, cardId: string) {
    // Ensure user has access to the card (and board)
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      include: {
        list: { include: { board: { include: { members: true } } } },
        labels: { include: { label: true } },
      },
    });

    if (!card) throw new NotFoundException("Card not found");

    const isMember = card.list.board.members.some((m) => m.userId === userId);
    if (!isMember && card.list.board.createdById !== userId) {
      throw new ForbiddenException("Not a board member");
    }

    // Determine new position: append to end of the list
    const lastCard = await this.prisma.card.findFirst({
      where: { listId: card.listId },
      orderBy: { position: "desc" },
    });

    const position = lastCard ? Number(lastCard.position) + 1 : 1;

    // Create the new card
    const newCard = await this.prisma.card.create({
      data: {
        title: card.title,
        description: card.description,
        listId: card.listId,
        position: position,
      },
    });

    // Recreate label links
    if (card.labels && card.labels.length > 0) {
      const createManyData = card.labels.map((cl) => ({
        cardId: newCard.id,
        labelId: cl.labelId,
      }));

      // Use createMany to efficiently insert label relations
      await this.prisma.cardLabel.createMany({
        data: createManyData,
        skipDuplicates: true,
      });
    }

    // Return the newly created card with labels and members
    const created = await this.prisma.card.findUnique({
      where: { id: newCard.id },
      include: {
        labels: { include: { label: true } },
        members: true,
      },
    });

    // Log activity
    await this.activitiesService.logActivity(
      card.list.boardId,
      userId,
      ActivityType.CREATE_CARD,
      created.id,
      `Carte "${created.title}" dupliquée dans la liste "${card.list.title}"`
    );

    // Emit WebSocket event
    this.boardsGateway.emitCardCreated(card.list.boardId, {
      card: created,
      listId: card.listId,
    });

    return created;
  }
}
