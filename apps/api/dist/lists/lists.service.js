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
exports.ListsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ListsService = class ListsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertBoardMember(userId, boardId) {
        const m = await this.prisma.boardMember.findFirst({ where: { boardId, userId } });
        if (!m)
            throw new common_1.ForbiddenException('Not a board member');
    }
    async list(boardId, userId) {
        await this.assertBoardMember(userId, boardId);
        return this.prisma.list.findMany({
            where: { boardId, isArchived: false },
            orderBy: { position: 'asc' },
        });
    }
    async create(userId, boardId, title, afterId) {
        await this.assertBoardMember(userId, boardId);
        const lists = await this.prisma.list.findMany({ where: { boardId }, orderBy: { position: 'asc' } });
        let position = 1;
        if (!lists.length)
            position = 1;
        else if (!afterId)
            position = Number(lists[lists.length - 1].position) + 1;
        else {
            const idx = lists.findIndex(l => l.id === afterId);
            if (idx === -1 || idx === lists.length - 1)
                position = Number(lists[lists.length - 1].position) + 1;
            else
                position = (Number(lists[idx].position) + Number(lists[idx + 1].position)) / 2;
        }
        return this.prisma.list.create({ data: { boardId, title, position } });
    }
    async move(userId, listId, boardId, newPosition) {
        await this.assertBoardMember(userId, boardId);
        return this.prisma.list.update({ where: { id: listId }, data: { position: newPosition } });
    }
};
exports.ListsService = ListsService;
exports.ListsService = ListsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListsService);
//# sourceMappingURL=lists.service.js.map