"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let CardsService = class CardsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertBoardMember(userId, listId) {
        const list = await this.prisma.list.findUnique({
            where: { id: listId },
            include: { board: { include: { members: true } } },
        });
        if (!list)
            throw new common_1.NotFoundException('List not found');
        const isMember = list.board.members.some((m) => m.userId === userId);
        if (!isMember && list.board.createdById !== userId) {
            throw new common_1.ForbiddenException('Not a board member');
        }
        return list;
    }
    async assertCardAccess(userId, cardId) {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
            include: {
                list: {
                    include: {
                        board: {
                            include: { members: true },
                        },
                    },
                },
            },
        });
        if (!card)
            throw new common_1.NotFoundException('Card not found');
        const isMember = card.list.board.members.some((m) => m.userId === userId);
        if (!isMember && card.list.board.createdById !== userId) {
            throw new common_1.ForbiddenException('Not a board member');
        }
        return card;
    }
    async list(userId, listId) {
        await this.assertBoardMember(userId, listId);
        return this.prisma.card.findMany({
            where: {
                listId,
                isArchived: false,
            },
            orderBy: { position: 'asc' },
            include: {
                labels: {
                    include: {
                        label: true,
                    },
                },
                members: true,
            },
        });
    }
    async create(userId, dto) {
        await this.assertBoardMember(userId, dto.listId);
        const lastCard = await this.prisma.card.findFirst({
            where: { listId: dto.listId },
            orderBy: { position: 'desc' },
        });
        const position = lastCard ? Number(lastCard.position) + 1 : 1;
        return this.prisma.card.create({
            data: {
                title: dto.title,
                description: dto.description,
                listId: dto.listId,
                position: position,
            },
            include: {
                labels: {
                    include: {
                        label: true,
                    },
                },
                members: true,
            },
        });
    }
    async move(userId, dto) {
        const card = await this.prisma.card.findUnique({ where: { id: dto.cardId } });
        if (!card)
            throw new common_1.NotFoundException('Card not found');
        await this.assertBoardMember(userId, card.listId);
        if (dto.listId && dto.listId !== card.listId) {
            await this.assertBoardMember(userId, dto.listId);
        }
        const targetListId = dto.listId || card.listId;
        const isMovingToList = targetListId !== card.listId;
        let newPosition = dto.newPosition;
        if (isMovingToList) {
            const lastCard = await this.prisma.card.findFirst({
                where: { listId: targetListId },
                orderBy: { position: 'desc' },
            });
            newPosition = lastCard ? Number(lastCard.position) + 1 : 1;
        }
        else {
            if (newPosition === undefined) {
                return card;
            }
        }
        return this.prisma.card.update({
            where: { id: dto.cardId },
            data: {
                listId: targetListId,
                position: newPosition,
            },
            include: {
                labels: {
                    include: {
                        label: true,
                    },
                },
                members: true,
            },
        });
    }
    async update(userId, cardId, dto) {
        const card = await this.assertCardAccess(userId, cardId);
        if (dto.listId && dto.listId !== card.listId) {
            await this.assertBoardMember(userId, dto.listId);
        }
        return this.prisma.card.update({
            where: { id: cardId },
            data: {
                title: dto.title,
                description: dto.description,
                listId: dto.listId,
                position: dto.position ? Number(dto.position) : undefined,
                isArchived: dto.isArchived,
            },
            include: {
                labels: {
                    include: {
                        label: true,
                    },
                },
                members: true,
            },
        });
    }
    async archive(userId, cardId) {
        await this.assertCardAccess(userId, cardId);
        return this.prisma.card.update({
            where: { id: cardId },
            data: {
                isArchived: true,
            },
            include: {
                labels: {
                    include: {
                        label: true,
                    },
                },
                members: true,
            },
        });
    }
};
exports.CardsService = CardsService;
exports.CardsService = CardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CardsService);
//# sourceMappingURL=cards.service.js.map