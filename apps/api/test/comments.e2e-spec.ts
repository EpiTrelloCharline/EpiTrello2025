import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { BoardReadGuard } from '../src/boards/guards/board-read.guard';
import { BoardWriteGuard } from '../src/boards/guards/board-write.guard';

describe('CommentsController (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;

    const mockPrismaService = {
        card: {
            findUnique: jest.fn(),
        },
        comment: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    const mockUser = {
        id: 'user1',
        email: 'test@example.com',
    };

    const mockJwtGuard = {
        canActivate: (context) => {
            const req = context.switchToHttp().getRequest();
            req.user = mockUser;
            return true;
        },
    };

    const mockBoardGuard = {
        canActivate: () => true,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue(mockPrismaService)
            .overrideGuard(JwtAuthGuard)
            .useValue(mockJwtGuard)
            .overrideGuard(BoardReadGuard)
            .useValue(mockBoardGuard)
            .overrideGuard(BoardWriteGuard)
            .useValue(mockBoardGuard)
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        prismaService = moduleFixture.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/cards/:cardId/comments (POST)', () => {
        it('should create a comment', () => {
            const cardId = 'card1';
            const dto = { content: 'Test comment' };

            const mockCard = {
                id: cardId,
                list: {
                    board: {
                        createdById: 'owner1',
                        members: [{ userId: 'user1', role: 'MEMBER' }],
                    },
                },
            };

            mockPrismaService.card.findUnique.mockResolvedValue(mockCard);
            mockPrismaService.comment.create.mockResolvedValue({ id: 'comment1', ...dto, userId: 'user1', cardId });

            return request(app.getHttpServer())
                .post(`/cards/${cardId}/comments`)
                .send(dto)
                .expect(201)
                .expect((res) => {
                    expect(res.body.content).toEqual(dto.content);
                });
        });
    });

    describe('/comments/:id (PATCH)', () => {
        it('should update a comment', () => {
            const commentId = 'comment1';
            const dto = { content: 'Updated content' };

            const mockComment = {
                id: commentId,
                userId: 'user1',
                card: {
                    list: {
                        board: {
                            createdById: 'owner1',
                            members: [{ userId: 'user1', role: 'MEMBER' }],
                        },
                    },
                },
            };

            mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);
            mockPrismaService.comment.update.mockResolvedValue({ id: commentId, ...dto });

            return request(app.getHttpServer())
                .patch(`/comments/${commentId}`)
                .send(dto)
                .expect(200)
                .expect((res) => {
                    expect(res.body.content).toEqual(dto.content);
                });
        });
    });

    describe('/comments/:id (DELETE)', () => {
        it('should delete a comment', () => {
            const commentId = 'comment1';

            const mockComment = {
                id: commentId,
                userId: 'user1',
                card: {
                    list: {
                        board: {
                            createdById: 'owner1',
                            members: [{ userId: 'user1', role: 'MEMBER' }],
                        },
                    },
                },
            };

            mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);
            mockPrismaService.comment.delete.mockResolvedValue({ id: commentId });

            return request(app.getHttpServer())
                .delete(`/comments/${commentId}`)
                .expect(200);
        });
    });
});
