import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class CommentsService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
    ) { }

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

        // Notify board members
        await this.notificationsService.notifyBoardMembers(
            card.list.boardId,
            [userId],
            NotificationType.COMMENT_ADDED,
            `Nouveau commentaire sur la carte "${card.title}"`,
            card.id,
        );

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
