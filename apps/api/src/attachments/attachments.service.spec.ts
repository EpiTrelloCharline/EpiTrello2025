import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentsService } from './attachments.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('AttachmentsService', () => {
    let service: AttachmentsService;
    let prisma: PrismaService;

    const mockPrismaService = {
        attachment: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            delete: jest.fn(),
        },
        card: {
            findUnique: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AttachmentsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<AttachmentsService>(AttachmentsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('uploadAttachment', () => {
        it('should upload an attachment successfully', async () => {
            const userId = 'user-1';
            const cardId = 'card-1';
            const mockFile = {
                originalname: 'test.pdf',
                path: 'uploads/test-123.pdf',
                mimetype: 'application/pdf',
                size: 1024,
            } as Express.Multer.File;

            const mockCard = {
                id: cardId,
                list: {
                    board: {
                        members: [
                            { userId, role: 'MEMBER' },
                        ],
                    },
                },
            };

            const mockAttachment = {
                id: 'attachment-1',
                name: 'test.pdf',
                url: 'uploads/test-123.pdf',
                mimeType: 'application/pdf',
                size: 1024,
                cardId,
                uploadedById: userId,
                uploadedBy: {
                    id: userId,
                    name: 'Test User',
                    email: 'test@example.com',
                    avatar: null,
                },
            };

            mockPrismaService.card.findUnique.mockResolvedValue(mockCard);
            mockPrismaService.attachment.create.mockResolvedValue(mockAttachment);

            const result = await service.uploadAttachment(userId, cardId, mockFile);

            expect(result).toEqual(mockAttachment);
            expect(mockPrismaService.card.findUnique).toHaveBeenCalledWith({
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
            expect(mockPrismaService.attachment.create).toHaveBeenCalled();
        });

        it('should throw NotFoundException if card does not exist', async () => {
            const userId = 'user-1';
            const cardId = 'non-existent-card';
            const mockFile = {
                originalname: 'test.pdf',
                path: 'uploads/test-123.pdf',
                mimetype: 'application/pdf',
                size: 1024,
            } as Express.Multer.File;

            mockPrismaService.card.findUnique.mockResolvedValue(null);

            await expect(
                service.uploadAttachment(userId, cardId, mockFile),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw ForbiddenException if user does not have access', async () => {
            const userId = 'user-1';
            const cardId = 'card-1';
            const mockFile = {
                originalname: 'test.pdf',
                path: 'uploads/test-123.pdf',
                mimetype: 'application/pdf',
                size: 1024,
            } as Express.Multer.File;

            const mockCard = {
                id: cardId,
                list: {
                    board: {
                        members: [
                            { userId: 'other-user', role: 'MEMBER' },
                        ],
                    },
                },
            };

            mockPrismaService.card.findUnique.mockResolvedValue(mockCard);

            await expect(
                service.uploadAttachment(userId, cardId, mockFile),
            ).rejects.toThrow(ForbiddenException);
        });
    });

    describe('getCardAttachments', () => {
        it('should return all attachments for a card', async () => {
            const cardId = 'card-1';
            const mockAttachments = [
                {
                    id: 'attachment-1',
                    name: 'test1.pdf',
                    url: 'uploads/test1.pdf',
                    mimeType: 'application/pdf',
                    size: 1024,
                    cardId,
                    uploadedBy: {
                        id: 'user-1',
                        name: 'User 1',
                        email: 'user1@example.com',
                        avatar: null,
                    },
                },
                {
                    id: 'attachment-2',
                    name: 'test2.png',
                    url: 'uploads/test2.png',
                    mimeType: 'image/png',
                    size: 2048,
                    cardId,
                    uploadedBy: {
                        id: 'user-2',
                        name: 'User 2',
                        email: 'user2@example.com',
                        avatar: null,
                    },
                },
            ];

            mockPrismaService.attachment.findMany.mockResolvedValue(mockAttachments);

            const result = await service.getCardAttachments(cardId);

            expect(result).toEqual(mockAttachments);
            expect(mockPrismaService.attachment.findMany).toHaveBeenCalledWith({
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
        });
    });

    describe('deleteAttachment', () => {
        it('should throw NotFoundException if attachment does not exist', async () => {
            const userId = 'user-1';
            const attachmentId = 'non-existent-attachment';

            mockPrismaService.attachment.findUnique.mockResolvedValue(null);

            await expect(
                service.deleteAttachment(userId, attachmentId),
            ).rejects.toThrow(NotFoundException);
        });
    });
});
