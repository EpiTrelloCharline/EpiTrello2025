import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
export declare class BoardsController {
    private svc;
    constructor(svc: BoardsService);
    list(workspaceId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        workspaceId: string;
        title: string;
        isArchived: boolean;
    }[]>;
    create(dto: CreateBoardDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        workspaceId: string;
        title: string;
        isArchived: boolean;
    }>;
    one(id: string, req: any): Promise<{
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
            userId: string;
            role: import("@prisma/client").$Enums.BoardRole;
            boardId: string;
        })[];
        labels: {
            id: string;
            name: string;
            boardId: string;
            color: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        workspaceId: string;
        title: string;
        isArchived: boolean;
    }>;
    getMembers(id: string, req: any): Promise<{
        id: string;
        userId: string;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.BoardRole;
        avatar: any;
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
