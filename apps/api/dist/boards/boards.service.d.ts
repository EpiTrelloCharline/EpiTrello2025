import { PrismaService } from '../prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
export declare class BoardsService {
    private prisma;
    constructor(prisma: PrismaService);
    listInWorkspace(userId: string, workspaceId: string): Promise<{
        id: string;
        title: string;
        isArchived: boolean;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        createdById: string;
    }[]>;
    create(userId: string, dto: CreateBoardDto): Promise<{
        id: string;
        title: string;
        isArchived: boolean;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        createdById: string;
    }>;
    getOne(userId: string, boardId: string): Promise<{
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
    getMembers(userId: string, boardId: string): Promise<{
        id: string;
        userId: string;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.BoardRole;
    }[]>;
    inviteMember(userId: string, boardId: string, dto: InviteMemberDto): Promise<{
        id: string;
        userId: string;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.BoardRole;
        avatar: any;
    }>;
}
