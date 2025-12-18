import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class AttachmentsService {
    constructor(private readonly prisma: PrismaService) { }

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

        // Create attachment record in database
        const attachment = await this.prisma.attachment.create({
            data: {
                name: file.originalname,
                url: file.path,
                mimeType: file.mimetype,
                size: file.size,
                cardId,
                uploadedById: userId,
            },
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

        // Delete file from disk
        try {
            await unlink(attachment.url);
        } catch (error) {
            console.error('Erreur lors de la suppression du fichier:', error);
            // Continue with database deletion even if file deletion fails
        }

        // Delete from database
        await this.prisma.attachment.delete({
            where: { id: attachmentId },
        });

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
}
