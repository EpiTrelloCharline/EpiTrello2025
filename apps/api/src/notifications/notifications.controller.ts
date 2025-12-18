import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  ParseBoolPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * GET /notifications
   * Get all notifications for the authenticated user
   */
  @Get()
  async getNotifications(
    @Request() req,
    @Query('unreadOnly', new ParseBoolPipe({ optional: true })) unreadOnly?: boolean,
    @Query('boardId') boardId?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return this.notificationsService.getUserNotifications(req.user.userId, {
      unreadOnly,
      boardId,
      limit,
      offset,
    });
  }

  /**
   * GET /notifications/unread-count
   * Get the count of unread notifications
   */
  @Get('unread-count')
  async getUnreadCount(
    @Request() req,
    @Query('boardId') boardId?: string,
  ) {
    const count = await this.notificationsService.getUnreadCount(
      req.user.userId,
      boardId,
    );
    return { count };
  }

  /**
   * PATCH /notifications/:id/read
   * Mark a notification as read
   */
  @Patch(':id/read')
  async markAsRead(@Request() req, @Param('id') notificationId: string) {
    await this.notificationsService.markAsRead(
      notificationId,
      req.user.userId,
    );
    return { message: 'Notification marked as read' };
  }

  /**
   * PATCH /notifications/mark-all-read
   * Mark all notifications as read
   */
  @Patch('mark-all-read')
  async markAllAsRead(
    @Request() req,
    @Query('boardId') boardId?: string,
  ) {
    await this.notificationsService.markAllAsRead(req.user.userId, boardId);
    return { message: 'All notifications marked as read' };
  }

  /**
   * DELETE /notifications/:id
   * Delete a notification
   */
  @Delete(':id')
  async deleteNotification(@Request() req, @Param('id') notificationId: string) {
    await this.notificationsService.deleteNotification(
      notificationId,
      req.user.userId,
    );
    return { message: 'Notification deleted' };
  }
}
