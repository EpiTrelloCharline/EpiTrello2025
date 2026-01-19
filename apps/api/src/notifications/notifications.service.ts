import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationType } from '@prisma/client';
import { WebSocketsGateway } from '../websockets/websockets.gateway';

export interface CreateNotificationDto {
  type: NotificationType;
  message: string;
  userId: string;
  boardId: string;
  entityId?: string;
}

export interface NotificationFilters {
  unreadOnly?: boolean;
  boardId?: string;
  limit?: number;
  offset?: number;
  type?: NotificationType;
}

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => WebSocketsGateway))
    private webSocketsGateway: WebSocketsGateway,
  ) {}

  /**
   * Create a notification for a user and push via WebSocket if connected
   */
  async createNotification(data: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        type: data.type,
        message: data.message,
        userId: data.userId,
        boardId: data.boardId,
        entityId: data.entityId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
        board: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Emit WebSocket event - notification_new
    this.webSocketsGateway.emitNotificationNew(data.userId, {
      id: notification.id,
      type: notification.type,
      message: notification.message,
      boardId: notification.boardId,
      entityId: notification.entityId,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    });

    return notification;
  }

  /**
   * Create notifications for all board members except the actor
   */
  async notifyBoardMembers(
    boardId: string,
    excludeUserIds: string[],
    type: NotificationType,
    message: string,
    entityId?: string,
  ) {
    // Get all board members except the excluded ones
    const boardMembers = await this.prisma.boardMember.findMany({
      where: {
        boardId,
        userId: { notIn: excludeUserIds },
      },
      select: {
        userId: true,
      },
    });

    // Create notifications for each member
    const notifications = await Promise.all(
      boardMembers.map((member) =>
        this.createNotification({
          type,
          message,
          userId: member.userId,
          boardId,
          entityId,
        }),
      ),
    );

    return notifications;
  }

  /**
   * Notify specific users (for assignments, mentions, etc.)
   */
  async notifyUsers(
    userIds: string[],
    boardId: string,
    type: NotificationType,
    message: string,
    entityId?: string,
  ) {
    const notifications = await Promise.all(
      userIds.map((userId) =>
        this.createNotification({
          type,
          message,
          userId,
          boardId,
          entityId,
        }),
      ),
    );

    return notifications;
  }

  /**
   * Create notification for card assignment
   */
  async notifyAssignment(
    assignedUserId: string,
    assignedByUserId: string,
    cardId: string,
    cardTitle: string,
    boardId: string,
  ) {
    // Don't notify if user assigned themselves
    if (assignedUserId === assignedByUserId) {
      return null;
    }

    const assignedBy = await this.prisma.user.findUnique({
      where: { id: assignedByUserId },
      select: { name: true, email: true },
    });

    const assignerName = assignedBy?.name || assignedBy?.email || 'Someone';
    const message = `${assignerName} assigned you to card "${cardTitle}"`;

    return this.createNotification({
      type: NotificationType.ASSIGNED,
      message,
      userId: assignedUserId,
      boardId,
      entityId: cardId,
    });
  }

  /**
   * Create notifications for mentions in comments
   */
  async notifyMentions(
    mentionedUserIds: string[],
    mentionedByUserId: string,
    cardId: string,
    cardTitle: string,
    boardId: string,
    commentPreview?: string,
  ) {
    // Filter out self-mentions
    const usersToNotify = mentionedUserIds.filter(id => id !== mentionedByUserId);

    if (usersToNotify.length === 0) {
      return [];
    }

    const mentionedBy = await this.prisma.user.findUnique({
      where: { id: mentionedByUserId },
      select: { name: true, email: true },
    });

    const mentionerName = mentionedBy?.name || mentionedBy?.email || 'Someone';
    const preview = commentPreview ? `: "${commentPreview.substring(0, 50)}${commentPreview.length > 50 ? '...' : ''}"` : '';
    const message = `${mentionerName} mentioned you in card "${cardTitle}"${preview}`;

    return this.notifyUsers(
      usersToNotify,
      boardId,
      NotificationType.MENTIONED,
      message,
      cardId,
    );
  }

  /**
   * Extract user mentions from text (format: @userId or @[userName])
   */
  extractMentions(text: string): string[] {
    // Match @userId pattern (cuid format)
    const userIdPattern = /@([a-z0-9]{25})/gi;
    const matches = text.match(userIdPattern) || [];
    
    return matches.map(match => match.substring(1)); // Remove @ prefix
  }

  /**
   * Notify about due date approaching
   */
  async notifyDueDateSoon(
    cardId: string,
    cardTitle: string,
    boardId: string,
    dueDate: Date,
  ) {
    // Get card members
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      include: {
        members: {
          select: { id: true },
        },
      },
    });

    if (!card || card.members.length === 0) {
      return [];
    }

    const formattedDate = dueDate.toLocaleDateString();
    const message = `Card "${cardTitle}" is due on ${formattedDate}`;

    return this.notifyUsers(
      card.members.map(m => m.id),
      boardId,
      NotificationType.DUE_DATE_SOON,
      message,
      cardId,
    );
  }

  /**
   * Get notifications for a user with filters
   */
  async getUserNotifications(userId: string, options?: NotificationFilters) {
    const where: any = { userId };

    if (options?.unreadOnly) {
      where.isRead = false;
    }

    if (options?.boardId) {
      where.boardId = options.boardId;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              avatar: true,
            },
          },
          board: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: options?.limit || 50,
        skip: options?.offset || 0,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      total,
      hasMore: (options?.offset || 0) + notifications.length < total,
    };
  }

  /**
   * Get a single notification by ID
   */
  async getNotificationById(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
        board: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string, boardId?: string) {
    const where: any = { userId, isRead: false };

    if (boardId) {
      where.boardId = boardId;
    }

    return this.prisma.notification.updateMany({
      where,
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string, userId: string) {
    return this.prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });
  }

  /**
   * Delete all read notifications for a user
   */
  async deleteReadNotifications(userId: string) {
    return this.prisma.notification.deleteMany({
      where: {
        userId,
        isRead: true,
      },
    });
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string, boardId?: string): Promise<number> {
    const where: any = { userId, isRead: false };

    if (boardId) {
      where.boardId = boardId;
    }

    return this.prisma.notification.count({ where });
  }
}
