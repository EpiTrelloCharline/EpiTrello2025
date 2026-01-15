import { Injectable, Inject, forwardRef } from '@nestjs/common';
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

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => WebSocketsGateway))
    private webSocketsGateway: WebSocketsGateway,
  ) { }

  /**
   * Create a notification for a user
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
   * Get notifications for a user
   */
  async getUserNotifications(
    userId: string,
    options?: {
      unreadOnly?: boolean;
      boardId?: string;
      limit?: number;
      offset?: number;
    },
  ) {
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
   * Mark a notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId, // Ensure user owns the notification
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
        userId, // Ensure user owns the notification
      },
    });
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string, boardId?: string) {
    const where: any = { userId, isRead: false };

    if (boardId) {
      where.boardId = boardId;
    }

    return this.prisma.notification.count({ where });
  }
}
