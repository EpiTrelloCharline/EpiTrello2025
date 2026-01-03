import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { BoardsGateway } from '../boards/boards.gateway';

@Injectable()
export class ListsService {
  constructor(
    private prisma: PrismaService,
    private boardsGateway: BoardsGateway,
  ) { }

  private async assertBoardMember(userId: string, boardId: string) {
    const m = await this.prisma.boardMember.findFirst({ where: { boardId, userId } });

    if (!m) throw new ForbiddenException('Not a board member');
  }

  async list(boardId: string, userId: string) {
    await this.assertBoardMember(userId, boardId);

    return this.prisma.list.findMany({
      where: { boardId, isArchived: false },
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
    this.boardsGateway.emitListCreated(boardId, { list });

    return list;
  }

  async move(userId: string, listId: string, boardId: string, newPosition: number) {
    await this.assertBoardMember(userId, boardId);

    const list = await this.prisma.list.update({ where: { id: listId }, data: { position: newPosition } });

    // Emit WebSocket event
    this.boardsGateway.emitListUpdated(boardId, { list });

    return list;
  }

  async update(userId: string, listId: string, title: string) {
    // Get the list to find its boardId
    const list = await this.prisma.list.findUnique({ where: { id: listId } });
    if (!list) throw new ForbiddenException('List not found');

    await this.assertBoardMember(userId, list.boardId);

    const updatedList = await this.prisma.list.update({ where: { id: listId }, data: { title } });

    // Emit WebSocket event
    this.boardsGateway.emitListUpdated(list.boardId, { list: updatedList });

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
    this.boardsGateway.emitListDeleted(list.boardId, { listId });

    return archivedList;
  }
}

