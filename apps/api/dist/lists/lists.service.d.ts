import { PrismaService } from '../prisma.service';
export declare class ListsService {
    private prisma;
    constructor(prisma: PrismaService);
    private assertBoardMember;
    list(boardId: string, userId: string): Promise<{
        id: string;
<<<<<<< HEAD
        title: string;
        isArchived: boolean;
        boardId: string;
        position: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    create(userId: string, boardId: string, title: string, afterId?: string): Promise<{
        id: string;
        title: string;
        isArchived: boolean;
        boardId: string;
        position: import("@prisma/client/runtime/library").Decimal;
    }>;
    move(userId: string, listId: string, boardId: string, newPosition: number): Promise<{
        id: string;
        title: string;
        isArchived: boolean;
        boardId: string;
        position: import("@prisma/client/runtime/library").Decimal;
=======
        boardId: string;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        isArchived: boolean;
    }[]>;
    create(userId: string, boardId: string, title: string, afterId?: string): Promise<{
        id: string;
        boardId: string;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        isArchived: boolean;
    }>;
    move(userId: string, listId: string, boardId: string, newPosition: number): Promise<{
        id: string;
        boardId: string;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        isArchived: boolean;
>>>>>>> origin/develop
    }>;
}
