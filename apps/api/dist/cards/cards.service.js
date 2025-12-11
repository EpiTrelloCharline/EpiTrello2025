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
const activities_service_1 = require("../activities/activities.service");
const client_1 = require("@prisma/client");
let CardsService = class CardsService {
    constructor(prisma, activitiesService) {
        this.prisma = prisma;
        this.activitiesService = activitiesService;
    }
    async assertBoardMember(userId, listId) {
        const list = await this.prisma.list.findUnique({
            where: { id: listId },
            include: { board: { include: { members: true } } },
        });
        if (!list)
            throw new common_1.NotFoundException("List not found");
        const isMember = list.board.members.some((m) => m.userId === userId);
        if (!isMember && list.board.createdById !== userId) {
            throw new common_1.ForbiddenException("Not a board member");
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
            throw new common_1.NotFoundException("Card not found");
        const isMember = card.list.board.members.some((m) => m.userId === userId);
        if (!isMember && card.list.board.createdById !== userId) {
            throw new common_1.ForbiddenException("Not a board member");
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
            orderBy: { position: "asc" },
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
        const list = await this.assertBoardMember(userId, dto.listId);
        const lastCard = await this.prisma.card.findFirst({
            where: { listId: dto.listId },
            orderBy: { position: "desc" },
        });
        const position = lastCard ? Number(lastCard.position) + 1 : 1;
        const card = await this.prisma.card.create({
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
        await this.activitiesService.logActivity(list.boardId, userId, client_1.ActivityType.CREATE_CARD, card.id, `Carte "${card.title}" créée dans la liste "${list.title}"`);
        return card;
    }
    async move(userId, dto) {
        const card = await this.prisma.card.findUnique({
            where: { id: dto.cardId },
            include: { list: true },
        });
        if (!card)
            throw new common_1.NotFoundException("Card not found");
        const sourceList = await this.assertBoardMember(userId, card.listId);
        let targetList = sourceList;
        if (dto.listId && dto.listId !== card.listId) {
            targetList = await this.assertBoardMember(userId, dto.listId);
        }
        const targetListId = dto.listId || card.listId;
        const isMovingToList = targetListId !== card.listId;
        let newPosition = dto.newPosition;
        if (isMovingToList) {
            const lastCard = await this.prisma.card.findFirst({
                where: { listId: targetListId },
                orderBy: { position: "desc" },
            });
            newPosition = lastCard ? Number(lastCard.position) + 1 : 1;
        }
        else {
            if (newPosition === undefined) {
                return card;
            }
        }
        const updatedCard = await this.prisma.card.update({
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
        if (isMovingToList) {
            await this.activitiesService.logActivity(sourceList.boardId, userId, client_1.ActivityType.MOVE_CARD, updatedCard.id, `Carte "${updatedCard.title}" déplacée de "${sourceList.title}" vers "${targetList.title}"`);
        }
        return updatedCard;
    }
    async update(userId, cardId, dto) {
        const card = await this.assertCardAccess(userId, cardId);
        if (dto.listId && dto.listId !== card.listId) {
            await this.assertBoardMember(userId, dto.listId);
        }
        const updatedCard = await this.prisma.card.update({
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
        if (dto.description !== undefined && dto.description !== card.description) {
            await this.activitiesService.logActivity(card.list.boardId, userId, client_1.ActivityType.UPDATE_DESCRIPTION, card.id, `Description modifiée pour la carte "${card.title}"`);
        }
        return updatedCard;
    }
    async archive(userId, cardId) {
        const card = await this.assertCardAccess(userId, cardId);
        const updatedCard = await this.prisma.card.update({
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
        await this.activitiesService.logActivity(card.list.boardId, userId, client_1.ActivityType.DELETE_CARD, card.id, `Carte "${card.title}" archivée`);
        return updatedCard;
    }
    async duplicate(userId, cardId) {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
            include: {
                list: { include: { board: { include: { members: true } } } },
                labels: { include: { label: true } },
            },
        });
        if (!card)
            throw new common_1.NotFoundException("Card not found");
        const isMember = card.list.board.members.some((m) => m.userId === userId);
        if (!isMember && card.list.board.createdById !== userId) {
            throw new common_1.ForbiddenException("Not a board member");
        }
        const lastCard = await this.prisma.card.findFirst({
            where: { listId: card.listId },
            orderBy: { position: "desc" },
        });
        const position = lastCard ? Number(lastCard.position) + 1 : 1;
        const newCard = await this.prisma.card.create({
            data: {
                title: card.title,
                description: card.description,
                listId: card.listId,
                position: position,
            },
        });
        if (card.labels && card.labels.length > 0) {
            const createManyData = card.labels.map((cl) => ({
                cardId: newCard.id,
                labelId: cl.labelId,
            }));
            await this.prisma.cardLabel.createMany({
                data: createManyData,
                skipDuplicates: true,
            });
        }
        const created = await this.prisma.card.findUnique({
            where: { id: newCard.id },
            include: {
                labels: { include: { label: true } },
                members: true,
            },
        });
        await this.activitiesService.logActivity(card.list.boardId, userId, client_1.ActivityType.CREATE_CARD, created.id, `Carte "${created.title}" dupliquée dans la liste "${card.list.title}"`);
        return created;
    }
};
exports.CardsService = CardsService;
exports.CardsService = CardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activities_service_1.ActivitiesService])
], CardsService);
//# sourceMappingURL=cards.service.js.map