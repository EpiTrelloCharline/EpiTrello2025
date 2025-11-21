// workspaces.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async listForUser(userId: string) {
    return this.prisma.workspace.findMany({
      where: { members: { some: { userId } } },
      include: { members: { include: { user: true } } },
    });
  }

  async create(userId: string, dto: CreateWorkspaceDto) {
    return this.prisma.$transaction(async (tx: any) => {
      const ws = await tx.workspace.create({
        data: { name: dto.name, description: dto.description, createdById: userId },
      });

      await tx.workspaceMember.create({
        data: { workspaceId: ws.id, userId, role: 'OWNER' },
      });

      return ws;
    });
  }

  async getOne(userId: string, workspaceId: string) {
    const member = await this.prisma.workspaceMember.findFirst({ where: { workspaceId, userId } });

    if (!member) throw new ForbiddenException('Not a member');

    return this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: { include: { user: true } } },
    });
  }

  async inviteByEmail(userId: string, workspaceId: string, email: string, role: 'ADMIN'|'MEMBER'|'OBSERVER') {
    // vérifie droits : seul OWNER/ADMIN peut inviter
    const me = await this.prisma.workspaceMember.findFirst({ where: { workspaceId, userId } });

    if (!me || !['OWNER','ADMIN'].includes(me.role)) throw new ForbiddenException('No permission');

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException('User not found');

    return this.prisma.workspaceMember.upsert({
      where: { workspaceId_userId: { workspaceId, userId: user.id } },
      create: { workspaceId, userId: user.id, role },
      update: { role },
    });
  }
}

