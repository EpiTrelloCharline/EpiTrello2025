import { PrismaService } from '../prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
export declare class WorkspacesService {
    private prisma;
    constructor(prisma: PrismaService);
    listForUser(userId: string): Promise<({
        members: ({
            user: {
                id: string;
                email: string;
                name: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            workspaceId: string;
            userId: string;
            role: import("@prisma/client").$Enums.WorkspaceRole;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string;
    })[]>;
    create(userId: string, dto: CreateWorkspaceDto): Promise<any>;
    getOne(userId: string, workspaceId: string): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                name: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            workspaceId: string;
            userId: string;
            role: import("@prisma/client").$Enums.WorkspaceRole;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string;
    }>;
    inviteByEmail(userId: string, workspaceId: string, email: string, role: 'ADMIN' | 'MEMBER' | 'OBSERVER'): Promise<{
        id: string;
        createdAt: Date;
        workspaceId: string;
        userId: string;
        role: import("@prisma/client").$Enums.WorkspaceRole;
    }>;
}
