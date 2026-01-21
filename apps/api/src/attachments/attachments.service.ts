import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    InternalServerErrorException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ActivityType } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ActivityEvent, ActivityEvents } from '../activities/activities.events';
import { IStorageService } from './storage/storage.interface';
import { Inject } from '@nestjs/common';

@Injectable()
export class AttachmentsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly eventEmitter: EventEmitter2,
        @Inject(IStorageService) private readonly storageService: IStorageService,
    ) { }

    /**
     * Upload an attachment to a card
     */
    async uploadAttachment(
        userId: string,
        cardId: string,
        file: Express.Multer.File,
    ) {
        // Verify card exists and user has write access
        await this.validateCardAccess(userId, cardId);

        // Upload file to storage (S3 or move local file)
        const storageUrl = await this.storageService.uploadFile(file);

        // Create attachment record in database
        const attachment = await this.prisma.attachment.create({
            data: {
                name: file.originalname,
                url: storageUrl,
                mimeType: file.mimetype,
                size: file.size,
                cardId,
                uploadedById: userId,
            },
            include: {
                card: { include: { list: true } },
                uploadedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });

        // Log Activity
        this.eventEmitter.emit(
            ActivityEvents.ATTACHMENT_ADDED,
            new ActivityEvent(
                attachment.card.list.boardId,
                userId,
                ActivityType.ATTACHMENT_ADD,
                attachment.id,
                `Fichier "${attachment.name}" ajouté à la carte "${attachment.card.title}"`
            )
        );

        return attachment;
    }

    /**
     * Delete an attachment
     */
    async deleteAttachment(userId: string, attachmentId: string) {
        // Find the attachment
        const attachment = await this.prisma.attachment.findUnique({
            where: { id: attachmentId },
            include: {
                card: {
                    include: {
                        list: {
                            include: {
                                board: {
                                    include: {
                                        members: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!attachment) {
            throw new NotFoundException('Pièce jointe introuvable');
        }

        // Check if user has permission to delete
        // User can delete if they are the uploader OR have write access to the board
        const isUploader = attachment.uploadedById === userId;
        const hasWriteAccess = attachment.card.list.board.members.some(
            (member) =>
                member.userId === userId &&
                (member.role === 'OWNER' ||
                    member.role === 'ADMIN' ||
                    member.role === 'MEMBER'),
        );

        if (!isUploader && !hasWriteAccess) {
            throw new ForbiddenException(
                "Vous n'avez pas la permission de supprimer cette pièce jointe",
            );
        }

        // Delete file from storage
        await this.storageService.deleteFile(attachment.url);

        // Delete from database
        await this.prisma.attachment.delete({
            where: { id: attachmentId },
        });

        // Log Activity
        this.eventEmitter.emit(
            ActivityEvents.ATTACHMENT_DELETED,
            new ActivityEvent(
                attachment.card.list.boardId,
                userId,
                ActivityType.ATTACHMENT_DELETE,
                attachment.cardId,
                `Fichier "${attachment.name}" supprimé de la carte "${attachment.card.title}"`
            )
        );

        return { message: 'Pièce jointe supprimée avec succès' };
    }

    /**
     * Get all attachments for a card
     */
    async getCardAttachments(cardId: string) {
        return this.prisma.attachment.findMany({
            where: { cardId },
            include: {
                uploadedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    /**
     * Validate that user has write access to the card's board
     */
    private async validateCardAccess(userId: string, cardId: string) {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
            include: {
                list: {
                    include: {
                        board: {
                            include: {
                                members: true,
                            },
                        },
                    },
                },
            },
        });

        if (!card) {
            throw new NotFoundException('Carte introuvable');
        }

        // Check if user has write access (OWNER, ADMIN, or MEMBER)
        const hasAccess = card.list.board.members.some(
            (member) =>
                member.userId === userId &&
                (member.role === 'OWNER' ||
                    member.role === 'ADMIN' ||
                    member.role === 'MEMBER'),
        );

        if (!hasAccess) {
            throw new ForbiddenException(
                "Vous n'avez pas la permission d'ajouter des pièces jointes à cette carte",
            );
        }

        return card;
    }

    /**
     * Rename an attachment
     */
    async renameAttachment(userId: string, attachmentId: string, newName: string) {
        // Find the attachment
        const attachment = await this.prisma.attachment.findUnique({
            where: { id: attachmentId },
            include: {
                card: {
                    include: {
                        list: {
                            include: {
                                board: {
                                    include: {
                                        members: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!attachment) {
            throw new NotFoundException('Pièce jointe introuvable');
        }

        // Check if user has write access to the board
        const hasWriteAccess = attachment.card.list.board.members.some(
            (member) =>
                member.userId === userId &&
                (member.role === 'OWNER' ||
                    member.role === 'ADMIN' ||
                    member.role === 'MEMBER'),
        );

        if (!hasWriteAccess) {
            throw new ForbiddenException(
                "Vous n'avez pas la permission de renommer cette pièce jointe",
            );
        }

        // Update name in database
        return this.prisma.attachment.update({
            where: { id: attachmentId },
            data: { name: newName },
            include: {
                uploadedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });
    }
}
