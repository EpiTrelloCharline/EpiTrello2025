import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { ActivityType, NotificationType } from '@prisma/client';
import { WebSocketsGateway } from '../websockets/websockets.gateway';
import { ActivityEvent, ActivityEvents } from '../activities/activities.events';

@Injectable()
export class CommentsService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
        private webSocketsGateway: WebSocketsGateway,
        private eventEmitter: EventEmitter2,
    ) { }

    async findAll(userId: string, cardId: string) {
        // Verify card exists and user has access
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
            include: { list: { include: { board: { include: { members: true } } } } },
        });

        if (!card) throw new NotFoundException('Card not found');

        const isMember = card.list.board.members.some((m) => m.userId === userId);
        if (!isMember && card.list.board.createdById !== userId) {
            throw new ForbiddenException('Not a board member');
        }

        return this.prisma.comment.findMany({
            where: { cardId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(userId: string, cardId: string, dto: CreateCommentDto) {
        // Verify card exists and user has access (basic check, can be expanded)
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
            include: { list: { include: { board: { include: { members: true } } } } },
        });

        if (!card) throw new NotFoundException('Card not found');

        const isMember = card.list.board.members.some((m) => m.userId === userId);
        if (!isMember && card.list.board.createdById !== userId) {
            throw new ForbiddenException('Not a board member');
        }

        const comment = await this.prisma.comment.create({
            data: {
                content: dto.content,
                cardId: cardId,
                userId: userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });

        // Extract mentions from comment content
        const mentionedUserIds = this.notificationsService.extractMentions(dto.content);

        // Notify mentioned users
        if (mentionedUserIds.length > 0) {
            await this.notificationsService.notifyMentions(
                mentionedUserIds,
                userId,
                cardId,
                card.title,
                card.list.boardId,
                dto.content,
            );
        }

        // Notify board members (excluding author and mentioned users to avoid duplicates)
        const excludeUserIds = [userId, ...mentionedUserIds];
        // Log Activity
        this.eventEmitter.emit(
            ActivityEvents.COMMENT_ADDED,
            new ActivityEvent(
                card.list.boardId,
                userId,
                ActivityType.COMMENT_ADD,
                card.id,
                `Nouveau commentaire sur la carte "${card.title}"`
            )
        );

        // Emit WebSocket event - comment_add
        this.webSocketsGateway.emitCommentAdd(card.list.boardId, {
            commentId: comment.id,
            cardId: cardId,
            boardId: card.list.boardId,
            content: comment.content,
            user: {
                id: comment.user.id,
                name: comment.user.name,
                avatar: comment.user.avatar,
            },
            createdAt: comment.createdAt,
        });

        return comment;
    }

    async update(userId: string, id: string, dto: UpdateCommentDto) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
            include: {
                user: true,
                card: { include: { list: { include: { board: { include: { members: true } } } } } },
            },
        });

        if (!comment) throw new NotFoundException('Comment not found');

        // Check permissions: Owner or Admin
        const isOwner = comment.userId === userId;
        let isAdmin = false;

        // Check if user is admin of the board
        const boardMember = comment.card.list.board.members.find(m => m.userId === userId);
        if (boardMember && (boardMember.role === 'ADMIN' || boardMember.role === 'OWNER')) {
            isAdmin = true;
        }
        // Check if user is owner of the board
        if (comment.card.list.board.createdById === userId) {
            isAdmin = true;
        }

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException('You can only edit your own comments');
        }

        return this.prisma.comment.update({
            where: { id },
            data: {
                content: dto.content,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });
    }

    async remove(userId: string, id: string) {
        const comment = await this.prisma.comment.findUnique({
            where: { id },
            include: {
                user: true,
                card: { include: { list: { include: { board: { include: { members: true } } } } } },
            },
        });

        if (!comment) throw new NotFoundException('Comment not found');

        // Check permissions: Owner or Admin
        const isOwner = comment.userId === userId;
        let isAdmin = false;

        // Check if user is admin of the board
        const boardMember = comment.card.list.board.members.find(m => m.userId === userId);
        if (boardMember && (boardMember.role === 'ADMIN' || boardMember.role === 'OWNER')) {
            isAdmin = true;
        }
        // Check if user is owner of the board
        if (comment.card.list.board.createdById === userId) {
            isAdmin = true;
        }

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException('You can only delete your own comments');
        }

        return this.prisma.comment.delete({
            where: { id },
        });
    }
}
