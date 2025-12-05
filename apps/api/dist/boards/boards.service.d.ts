import { PrismaService } from '../prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
export declare class BoardsService {
    private prisma;
    constructor(prisma: PrismaService);
    listInWorkspace(userId: string, workspaceId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        workspaceId: string;
        title: string;
        isArchived: boolean;
    }[]>;
    create(userId: string, dto: CreateBoardDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        workspaceId: string;
        title: string;
        isArchived: boolean;
    }>;
    getOne(userId: string, boardId: string): Promise<{
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
            createdAt: Date;
            updatedAt: Date;
            boardId: string;
            color: string;
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
}
