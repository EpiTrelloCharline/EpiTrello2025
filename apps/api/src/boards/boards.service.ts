import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async listInWorkspace(userId: string, workspaceId: string) {
    const isMember = await this.prisma.workspaceMember.findFirst({ where: { workspaceId, userId } });

    if (!isMember) throw new ForbiddenException('Not a workspace member');

    return this.prisma.board.findMany({ where: { workspaceId, isArchived: false } });
  }

  async create(userId: string, dto: CreateBoardDto) {
    const isMember = await this.prisma.workspaceMember.findFirst({ where: { workspaceId: dto.workspaceId, userId } });

    if (!isMember) throw new ForbiddenException('Not a workspace member');

    const board = await this.prisma.board.create({
      data: { title: dto.title, workspaceId: dto.workspaceId, createdById: userId },
    });

    await this.prisma.boardMember.create({ data: { boardId: board.id, userId, role: 'OWNER' } });

    return board;
  }

  async getOne(userId: string, boardId: string) {
    const member = await this.prisma.boardMember.findFirst({ where: { boardId, userId } });

    if (!member) throw new ForbiddenException('Not a board member');

    const board = await this.prisma.board.findUnique({ where: { id: boardId } });

    if (!board) throw new NotFoundException('Board not found');

    return board;
  }
}

