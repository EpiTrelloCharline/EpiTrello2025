import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class BoardsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) { }

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

    // Create default labels for the new board
    const defaultLabels = [
      { name: 'facile', color: '#61bd4f' },
      { name: 'en difficulté', color: '#ff9f1a' },
      { name: 'Server-Client (langage C)', color: '#eb5a46' },
      { name: 'Interface graphique (langage C)', color: '#c377e0' },
      { name: 'long', color: '#0079bf' },
      { name: 'bug', color: '#00c2e0' },
      { name: 'Intelligence artificielle', color: '#61bd4f' },
    ];

    await this.prisma.label.createMany({
      data: defaultLabels.map(label => ({
        boardId: board.id,
        name: label.name,
        color: label.color,
      })),
    });

    return board;
  }

  async getOne(userId: string, boardId: string) {
    const member = await this.prisma.boardMember.findFirst({ where: { boardId, userId } });

    if (!member) throw new ForbiddenException('Not a board member');

    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: {
        members: { include: { user: true } },
        labels: true,
      },
    });

    if (!board) throw new NotFoundException('Board not found');

    return board;
  }

  /**
   * List of all the members
   * Return: id, name, email, role, avatar
   */
  async getMembers(userId: string, boardId: string) {
    // Verify that the member can access to this board
    const isMember = await this.prisma.boardMember.findFirst({
      where: { boardId, userId },
    });

    if (!isMember) {
      throw new ForbiddenException('Vous n\'êtes pas membre de ce board');
    }

    // Retrieve all the members in this board
    const members = await this.prisma.boardMember.findMany({
      where: { boardId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: [
        { role: 'asc' }, // OWNER first, then ADMIN, MEMBER, OBSERVER
        { user: { name: 'asc' } },
      ],
    });

    // Format the response for the UI
    return members.map((member) => ({
      id: member.id,
      userId: member.user.id,
      name: member.user.name,
      email: member.user.email,
      role: member.role,
    }));
  }

  /**
   * Invite a user to join a board
   * Only OWNER and ADMIN can invite (checked by the guard)
   */
  async inviteMember(userId: string, boardId: string, dto: InviteMemberDto) {
    // Verify that the board exists
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException('Board non trouvé');
    }

    // Find the user by email
    const invitedUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!invitedUser) {
      throw new NotFoundException('Utilisateur non trouvé avec cet email');
    }

    // Verify that the user is not already a member of the board
    const existingMember = await this.prisma.boardMember.findFirst({
      where: {
        boardId,
        userId: invitedUser.id,
      },
    });

    if (existingMember) {
      throw new BadRequestException('Cet utilisateur est déjà membre du board');
    }

    // Verify that the member can access to this board
    const isWorkspaceMember = await this.prisma.workspaceMember.findFirst({
      where: {
        workspaceId: board.workspaceId,
        userId: invitedUser.id,
      },
    });

    if (!isWorkspaceMember) {
      throw new BadRequestException('L\'utilisateur doit être membre du workspace avant d\'être invité au board');
    }

    // Create the new board member
    const newMember = await this.prisma.boardMember.create({
      data: {
        boardId,
        userId: invitedUser.id,
        role: dto.role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    // Notify the invited user
    await this.notificationsService.createNotification({
      type: NotificationType.MEMBER_ADDED,
      message: `Vous avez été ajouté au tableau "${board.title}"`,
      userId: invitedUser.id,
      boardId: board.id,
      entityId: newMember.id,
    });

    // Notify other board members
    await this.notificationsService.notifyBoardMembers(
      board.id,
      [userId, invitedUser.id], // Exclude actor AND invited user (who already got a specific notification)
      NotificationType.MEMBER_ADDED,
      `${invitedUser.name || invitedUser.email} a rejoint le tableau "${board.title}"`,
      newMember.id,
    );

    // Return the formatted information for the UI
    return {
      id: newMember.id,
      userId: newMember.user.id,
      name: newMember.user.name,
      email: newMember.user.email,
      role: newMember.role,
      avatar: null,
    };
  }
}

