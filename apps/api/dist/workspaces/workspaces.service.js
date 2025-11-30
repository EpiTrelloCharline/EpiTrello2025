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
exports.WorkspacesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let WorkspacesService = class WorkspacesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listForUser(userId) {
        return this.prisma.workspace.findMany({
            where: { members: { some: { userId } } },
            include: { members: { include: { user: true } } },
        });
    }
    async create(userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const ws = await tx.workspace.create({
                data: { name: dto.name, description: dto.description, createdById: userId },
            });
            await tx.workspaceMember.create({
                data: { workspaceId: ws.id, userId, role: 'OWNER' },
            });
            return tx.workspace.findUnique({
                where: { id: ws.id },
                include: { members: { include: { user: true } } },
            });
        });
    }
    async getOne(userId, workspaceId) {
        const member = await this.prisma.workspaceMember.findFirst({ where: { workspaceId, userId } });
        if (!member)
            throw new common_1.ForbiddenException('Not a member');
        return this.prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: { members: { include: { user: true } } },
        });
    }
    async inviteByEmail(userId, workspaceId, email, role) {
        const me = await this.prisma.workspaceMember.findFirst({ where: { workspaceId, userId } });
        if (!me || !['OWNER', 'ADMIN'].includes(me.role))
            throw new common_1.ForbiddenException('No permission');
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.workspaceMember.upsert({
            where: { workspaceId_userId: { workspaceId, userId: user.id } },
            create: { workspaceId, userId: user.id, role },
            update: { role },
        });
    }
};
exports.WorkspacesService = WorkspacesService;
exports.WorkspacesService = WorkspacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkspacesService);
//# sourceMappingURL=workspaces.service.js.map