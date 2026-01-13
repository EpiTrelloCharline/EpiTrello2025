import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { WebSocketsGateway } from '../websockets/websockets.gateway';
import { BatchMoveListsDto } from './dto/batch-move-lists.dto';

@Injectable()
export class ListsService {
  constructor(
    private prisma: PrismaService,
    private webSocketsGateway: WebSocketsGateway,
  ) { }

  private async assertBoardMember(userId: string, boardId: string) {
    const m = await this.prisma.boardMember.findFirst({ where: { boardId, userId } });

    if (!m) throw new ForbiddenException('Not a board member');
  }

  async list(boardId: string, userId: string, archived: boolean = false) {
    await this.assertBoardMember(userId, boardId);

    return this.prisma.list.findMany({
      where: { boardId, isArchived: archived },
      orderBy: { position: 'asc' },
    });
  }

  async create(userId: string, boardId: string, title: string, afterId?: string) {
    await this.assertBoardMember(userId, boardId);

    const lists = await this.prisma.list.findMany({ where: { boardId }, orderBy: { position: 'asc' } });

    let position = 1;

    if (!lists.length) position = 1;
    else if (!afterId) position = Number(lists[lists.length - 1].position) + 1;
    else {
      const idx = lists.findIndex(l => l.id === afterId);
      if (idx === -1 || idx === lists.length - 1) position = Number(lists[lists.length - 1].position) + 1;
      else position = (Number(lists[idx].position) + Number(lists[idx + 1].position)) / 2;
    }

    const list = await this.prisma.list.create({ data: { boardId, title, position } });

    // Emit WebSocket event
    this.webSocketsGateway.emitListCreated(boardId, {
      listId: list.id,
      list,
      boardId,
    });

    return list;
  }

  async move(userId: string, listId: string, boardId: string, newPosition: number) {
    await this.assertBoardMember(userId, boardId);

    const list = await this.prisma.list.update({ where: { id: listId }, data: { position: newPosition } });

    // Emit WebSocket event
    this.webSocketsGateway.emitListUpdated(boardId, {
      listId: list.id,
      list,
      boardId,
    });

    return list;
  }

  async update(userId: string, listId: string, title?: string, isArchived?: boolean) {
    // Get the list to find its boardId
    const list = await this.prisma.list.findUnique({ where: { id: listId } });
    if (!list) throw new ForbiddenException('List not found');

    await this.assertBoardMember(userId, list.boardId);

    const updatedList = await this.prisma.list.update({
      where: { id: listId },
      data: {
        title: title ?? undefined,
        isArchived: isArchived ?? undefined
      }
    });

    // Emit WebSocket event
    this.webSocketsGateway.emitListUpdated(list.boardId, {
      listId: updatedList.id,
      list: updatedList,
      boardId: list.boardId,
    });

    return updatedList;
  }

  async delete(userId: string, listId: string) {
    // Get the list to find its boardId
    const list = await this.prisma.list.findUnique({ where: { id: listId } });
    if (!list) throw new ForbiddenException('List not found');

    await this.assertBoardMember(userId, list.boardId);

    // Archive the list instead of hard delete
    const archivedList = await this.prisma.list.update({ where: { id: listId }, data: { isArchived: true } });

    // Emit WebSocket event
    this.webSocketsGateway.emitListDeleted(list.boardId, {
      listId,
      boardId: list.boardId,
    });

    return archivedList;
  }

  async deletePermanent(userId: string, listId: string) {
    const list = await this.prisma.list.findUnique({ where: { id: listId } });
    if (!list) throw new ForbiddenException('List not found');

    await this.assertBoardMember(userId, list.boardId);

    await this.prisma.list.delete({ where: { id: listId } });

    // Emit WebSocket event (to be sure frontend removes it if it was somehow visible)
    this.webSocketsGateway.emitListDeleted(list.boardId, {
      listId,
      boardId: list.boardId,
    });

    return { success: true };
  }

  /**
   * Batch update list positions - optimized for drag & drop operations
   * Updates multiple list positions in a single transaction
   */
  async batchMove(userId: string, dto: BatchMoveListsDto) {
    if (!dto.lists || dto.lists.length === 0) {
      return { success: true, updatedCount: 0 };
    }

    // Verify user has access to the board
    await this.assertBoardMember(userId, dto.boardId);

    // Verify all lists belong to the specified board
    const listIds = dto.lists.map(l => l.listId);
    const lists = await this.prisma.list.findMany({
      where: { 
        id: { in: listIds },
        boardId: dto.boardId
      }
    });

    if (lists.length !== listIds.length) {
      throw new NotFoundException("One or more lists not found or don't belong to the specified board");
    }

    // Perform batch update in a transaction
    const updates = dto.lists.map(listUpdate =>
      this.prisma.list.update({
        where: { id: listUpdate.listId },
        data: { position: listUpdate.position }
      })
    );

    await this.prisma.$transaction(updates);

    // Emit WebSocket event
    this.webSocketsGateway.emitBoardUpdated(dto.boardId, {
      boardId: dto.boardId,
      board: {
        type: 'batch-lists-moved',
        lists: dto.lists
      },
    });

    return { success: true, updatedCount: dto.lists.length };
  }
}

