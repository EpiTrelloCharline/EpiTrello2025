import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
export declare class BoardsController {
    private svc;
    constructor(svc: BoardsService);
    list(workspaceId: string, req: any): Promise<{
        id: string;
        title: string;
        isArchived: boolean;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        createdById: string;
    }[]>;
    create(dto: CreateBoardDto, req: any): Promise<{
        id: string;
        title: string;
        isArchived: boolean;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        createdById: string;
    }>;
    one(id: string, req: any): Promise<{
        labels: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            boardId: string;
            color: string;
        }[];
        members: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                email: string;
            };
        } & {
            id: string;
            boardId: string;
            userId: string;
            role: import("@prisma/client").$Enums.BoardRole;
        })[];
    } & {
        id: string;
        title: string;
        isArchived: boolean;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        createdById: string;
    }>;
    getMembers(id: string, req: any): Promise<{
        id: string;
        userId: string;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.BoardRole;
    }[]>;
    inviteMember(id: string, dto: InviteMemberDto, req: any): Promise<{
        id: string;
        userId: string;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.BoardRole;
        avatar: any;
    }>;
}
