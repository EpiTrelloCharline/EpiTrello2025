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
exports.BoardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let BoardsService = class BoardsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listInWorkspace(userId, workspaceId) {
        const isMember = await this.prisma.workspaceMember.findFirst({ where: { workspaceId, userId } });
        if (!isMember)
            throw new common_1.ForbiddenException('Not a workspace member');
        return this.prisma.board.findMany({ where: { workspaceId, isArchived: false } });
    }
    async create(userId, dto) {
        const isMember = await this.prisma.workspaceMember.findFirst({ where: { workspaceId: dto.workspaceId, userId } });
        if (!isMember)
            throw new common_1.ForbiddenException('Not a workspace member');
        const board = await this.prisma.board.create({
            data: { title: dto.title, workspaceId: dto.workspaceId, createdById: userId },
        });
        await this.prisma.boardMember.create({ data: { boardId: board.id, userId, role: 'OWNER' } });
        return board;
    }
    async getOne(userId, boardId) {
        const member = await this.prisma.boardMember.findFirst({ where: { boardId, userId } });
        if (!member)
            throw new common_1.ForbiddenException('Not a board member');
        const board = await this.prisma.board.findUnique({ where: { id: boardId } });
        if (!board)
            throw new common_1.NotFoundException('Board not found');
        return board;
    }
};
exports.BoardsService = BoardsService;
exports.BoardsService = BoardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BoardsService);
//# sourceMappingURL=boards.service.js.map