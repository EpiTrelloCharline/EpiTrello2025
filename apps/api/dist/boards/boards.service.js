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
        const board = await this.prisma.board.findUnique({
            where: { id: boardId },
            include: {
                members: { include: { user: true } },
                labels: true,
            },
        });
        if (!board)
            throw new common_1.NotFoundException('Board not found');
        return board;
    }
    async getMembers(userId, boardId) {
        const isMember = await this.prisma.boardMember.findFirst({
            where: { boardId, userId },
        });
        if (!isMember) {
            throw new common_1.ForbiddenException('Vous n\'êtes pas membre de ce board');
        }
        const members = await this.prisma.boardMember.findMany({
            where: { boardId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
            orderBy: [
                { role: 'asc' },
                { user: { name: 'asc' } },
            ],
        });
        return members.map((member) => ({
            id: member.id,
            userId: member.user.id,
            name: member.user.name,
            email: member.user.email,
            role: member.role,
            avatar: null,
        }));
    }
    async inviteMember(userId, boardId, dto) {
        const board = await this.prisma.board.findUnique({
            where: { id: boardId },
        });
        if (!board) {
            throw new common_1.NotFoundException('Board non trouvé');
        }
        const invitedUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!invitedUser) {
            throw new common_1.NotFoundException('Utilisateur non trouvé avec cet email');
        }
        const existingMember = await this.prisma.boardMember.findFirst({
            where: {
                boardId,
                userId: invitedUser.id,
            },
        });
        if (existingMember) {
            throw new common_1.BadRequestException('Cet utilisateur est déjà membre du board');
        }
        const isWorkspaceMember = await this.prisma.workspaceMember.findFirst({
            where: {
                workspaceId: board.workspaceId,
                userId: invitedUser.id,
            },
        });
        if (!isWorkspaceMember) {
            throw new common_1.BadRequestException('L\'utilisateur doit être membre du workspace avant d\'être invité au board');
        }
        const newMember = await this.prisma.boardMember.create({
            data: {
                boardId,
                userId: invitedUser.id,
                role: dto.role,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });
        return {
            id: newMember.id,
            userId: newMember.user.id,
            name: newMember.user.name,
            email: newMember.user.email,
            role: newMember.role,
            avatar: null,
        };
    }
};
exports.BoardsService = BoardsService;
exports.BoardsService = BoardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BoardsService);
//# sourceMappingURL=boards.service.js.map