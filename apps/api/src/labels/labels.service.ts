import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma.service";
import { ActivitiesService } from "../activities/activities.service";
import { ActivityType, NotificationType } from "@prisma/client";
import { NotificationsService } from "../notifications/notifications.service";

import { CreateLabelDto } from "./dto/create-label.dto";
import { UpdateLabelDto } from "./dto/update-label.dto";

@Injectable()
export class LabelsService {
  constructor(
    private prisma: PrismaService,
    private activitiesService: ActivitiesService,
    private notificationsService: NotificationsService,
  ) { }

  // ... (rest of the file until assignLabelToCard)

  /**
   * Assign a label to a card
   */
  async assignLabelToCard(userId: string, cardId: string, labelId: string) {
    // Get card with list and board info
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      include: {
        list: {
          include: { board: true },
        },
      },
    });

    if (!card) {
      throw new NotFoundException("Card not found");
    }

    const boardId = card.list.boardId;
    await this.checkBoardMembership(userId, boardId);

    // Verify label exists and belongs to the same board
    const label = await this.prisma.label.findUnique({
      where: { id: labelId },
    });

    if (!label) {
      throw new NotFoundException("Label not found");
    }

    if (label.boardId !== boardId) {
      throw new ForbiddenException(
        "Label does not belong to the same board as the card",
      );
    }

    // Check if already assigned
    const existing = await this.prisma.cardLabel.findFirst({
      where: { cardId, labelId },
    });

    if (existing) {
      return { message: "Label already assigned to this card" };
    }

    // Assign the label
    await this.prisma.cardLabel.create({
      data: { cardId, labelId },
    });

    await this.activitiesService.logActivity(
      boardId,
      userId,
      ActivityType.ADD_LABEL,
      card.id,
      `Étiquette "${label.name}" ajoutée à la carte "${card.title}"`
    );

    // Notify board members
    await this.notificationsService.notifyBoardMembers(
      boardId,
      [userId],
      NotificationType.LABEL_ADDED,
      `Étiquette "${label.name}" ajoutée à la carte "${card.title}"`,
      card.id,
    );

    return { message: "Label assigned successfully" };
  }

  // ==================== HELPER: Check Board Membership ====================
  private async checkBoardMembership(
    userId: string,
    boardId: string,
  ): Promise<void> {
    const member = await this.prisma.boardMember.findFirst({
      where: { boardId, userId },
    });

    if (!member) {
      throw new ForbiddenException("You are not a member of this board");
    }
  }

  // ==================== CRUD LABELS ====================

  /**
   * Get all labels for a board
   */
  async getLabelsByBoard(userId: string, boardId: string) {
    await this.checkBoardMembership(userId, boardId);

    return this.prisma.label.findMany({
      where: { boardId },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Create a new label on a board
   */
  async createLabel(userId: string, boardId: string, dto: CreateLabelDto) {
    await this.checkBoardMembership(userId, boardId);

    return this.prisma.label.create({
      data: {
        boardId,
        name: dto.name,
        color: dto.color,
      },
    });
  }

  /**
   * Update a label (name and/or color)
   */
  async updateLabel(userId: string, labelId: string, dto: UpdateLabelDto) {
    const label = await this.prisma.label.findUnique({
      where: { id: labelId },
    });

    if (!label) {
      throw new NotFoundException("Label not found");
    }

    await this.checkBoardMembership(userId, label.boardId);

    return this.prisma.label.update({
      where: { id: labelId },
      data: dto,
    });
  }

  /**
   * Delete a label
   */
  async deleteLabel(userId: string, labelId: string) {
    const label = await this.prisma.label.findUnique({
      where: { id: labelId },
    });

    if (!label) {
      throw new NotFoundException("Label not found");
    }

    await this.checkBoardMembership(userId, label.boardId);

    await this.prisma.label.delete({
      where: { id: labelId },
    });

    return { message: "Label deleted successfully" };
  }

  // ==================== ASSIGN / UNASSIGN LABELS ====================



  /**
   * Remove a label from a card
   */
  async removeLabelFromCard(userId: string, cardId: string, labelId: string) {
    // Get card with list and board info
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      include: {
        list: {
          include: { board: true },
        },
      },
    });

    if (!card) {
      throw new NotFoundException("Card not found");
    }

    const boardId = card.list.boardId;
    await this.checkBoardMembership(userId, boardId);

    // Find the CardLabel relationship
    const cardLabel = await this.prisma.cardLabel.findFirst({
      where: { cardId, labelId },
    });

    if (!cardLabel) {
      throw new NotFoundException("Label is not assigned to this card");
    }

    // Remove the assignment
    await this.prisma.cardLabel.delete({
      where: { id: cardLabel.id },
    });

    // Get label details for notification
    const label = await this.prisma.label.findUnique({
      where: { id: labelId },
    });

    if (label) {
      // Notify board members
      await this.notificationsService.notifyBoardMembers(
        boardId,
        [userId],
        NotificationType.LABEL_REMOVED,
        `Étiquette "${label.name}" retirée de la carte "${card.title}"`,
        card.id,
      );
    }

    return { message: "Label removed successfully" };
  }
}
