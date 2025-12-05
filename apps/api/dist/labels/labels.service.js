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
exports.LabelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let LabelsService = class LabelsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkBoardMembership(userId, boardId) {
        const member = await this.prisma.boardMember.findFirst({
            where: { boardId, userId },
        });
        if (!member) {
            throw new common_1.ForbiddenException('You are not a member of this board');
        }
    }
    async getLabelsByBoard(userId, boardId) {
        await this.checkBoardMembership(userId, boardId);
        return this.prisma.label.findMany({
            where: { boardId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async createLabel(userId, boardId, dto) {
        await this.checkBoardMembership(userId, boardId);
        return this.prisma.label.create({
            data: {
                boardId,
                name: dto.name,
                color: dto.color,
            },
        });
    }
    async updateLabel(userId, labelId, dto) {
        const label = await this.prisma.label.findUnique({
            where: { id: labelId },
        });
        if (!label) {
            throw new common_1.NotFoundException('Label not found');
        }
        await this.checkBoardMembership(userId, label.boardId);
        return this.prisma.label.update({
            where: { id: labelId },
            data: dto,
        });
    }
    async deleteLabel(userId, labelId) {
        const label = await this.prisma.label.findUnique({
            where: { id: labelId },
        });
        if (!label) {
            throw new common_1.NotFoundException('Label not found');
        }
        await this.checkBoardMembership(userId, label.boardId);
        await this.prisma.label.delete({
            where: { id: labelId },
        });
        return { message: 'Label deleted successfully' };
    }
    async assignLabelToCard(userId, cardId, labelId) {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
            include: {
                list: {
                    include: { board: true },
                },
            },
        });
        if (!card) {
            throw new common_1.NotFoundException('Card not found');
        }
        const boardId = card.list.boardId;
        await this.checkBoardMembership(userId, boardId);
        const label = await this.prisma.label.findUnique({
            where: { id: labelId },
        });
        if (!label) {
            throw new common_1.NotFoundException('Label not found');
        }
        if (label.boardId !== boardId) {
            throw new common_1.ForbiddenException('Label does not belong to the same board as the card');
        }
        const existing = await this.prisma.cardLabel.findFirst({
            where: { cardId, labelId },
        });
        if (existing) {
            return { message: 'Label already assigned to this card' };
        }
        await this.prisma.cardLabel.create({
            data: { cardId, labelId },
        });
        return { message: 'Label assigned successfully' };
    }
    async removeLabelFromCard(userId, cardId, labelId) {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
            include: {
                list: {
                    include: { board: true },
                },
            },
        });
        if (!card) {
            throw new common_1.NotFoundException('Card not found');
        }
        const boardId = card.list.boardId;
        await this.checkBoardMembership(userId, boardId);
        const cardLabel = await this.prisma.cardLabel.findFirst({
            where: { cardId, labelId },
        });
        if (!cardLabel) {
            throw new common_1.NotFoundException('Label is not assigned to this card');
        }
        await this.prisma.cardLabel.delete({
            where: { id: cardLabel.id },
        });
        return { message: 'Label removed successfully' };
    }
};
exports.LabelsService = LabelsService;
exports.LabelsService = LabelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabelsService);
//# sourceMappingURL=labels.service.js.map