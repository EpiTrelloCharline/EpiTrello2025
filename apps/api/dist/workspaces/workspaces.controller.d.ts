import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
export declare class WorkspacesController {
    private svc;
    constructor(svc: WorkspacesService);
    list(req: any): Promise<({
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
    create(req: any, dto: CreateWorkspaceDto): Promise<any>;
    one(req: any, id: string): Promise<{
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
    invite(req: any, id: string, dto: InviteMemberDto): Promise<{
        id: string;
        createdAt: Date;
        workspaceId: string;
        userId: string;
        role: import("@prisma/client").$Enums.WorkspaceRole;
    }>;
}
