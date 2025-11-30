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
    async create(createLabelDto) {
        return this.prisma.label.create({
            data: createLabelDto,
        });
    }
    async findByBoard(boardId) {
        return this.prisma.label.findMany({
            where: { boardId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async findOne(id) {
        const label = await this.prisma.label.findUnique({
            where: { id },
        });
        if (!label) {
            throw new common_1.NotFoundException(`Label with ID ${id} not found`);
        }
        return label;
    }
    async update(id, updateLabelDto) {
        await this.findOne(id);
        return this.prisma.label.update({
            where: { id },
            data: updateLabelDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.label.delete({
            where: { id },
        });
    }
    async assignToCard(cardId, labelId) {
        const card = await this.prisma.card.findUnique({ where: { id: cardId } });
        if (!card) {
            throw new common_1.NotFoundException(`Card with ID ${cardId} not found`);
        }
        await this.findOne(labelId);
        const existing = await this.prisma.cardLabel.findUnique({
            where: {
                cardId_labelId: { cardId, labelId },
            },
        });
        if (existing) {
            return existing;
        }
        return this.prisma.cardLabel.create({
            data: { cardId, labelId },
            include: { label: true },
        });
    }
    async unassignFromCard(cardId, labelId) {
        const cardLabel = await this.prisma.cardLabel.findUnique({
            where: {
                cardId_labelId: { cardId, labelId },
            },
        });
        if (!cardLabel) {
            throw new common_1.NotFoundException(`Label not assigned to this card`);
        }
        return this.prisma.cardLabel.delete({
            where: { id: cardLabel.id },
        });
    }
    async getCardLabels(cardId) {
        const cardLabels = await this.prisma.cardLabel.findMany({
            where: { cardId },
            include: { label: true },
        });
        return cardLabels.map((cl) => cl.label);
    }
};
exports.LabelsService = LabelsService;
exports.LabelsService = LabelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabelsService);
//# sourceMappingURL=labels.service.js.map