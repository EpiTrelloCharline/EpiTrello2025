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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        workspaceId: string;
        title: string;
        isArchived: boolean;
    }>;
}
