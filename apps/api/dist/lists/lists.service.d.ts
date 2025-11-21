import { PrismaService } from '../prisma.service';
export declare class ListsService {
    private prisma;
    constructor(prisma: PrismaService);
    private assertBoardMember;
    list(boardId: string, userId: string): Promise<runtime.Types.Public.PrismaPromise<T>>;
    create(userId: string, boardId: string, title: string, afterId?: string): Promise<runtime.Types.Result.GetResult<import("../generated/prisma/models").$ListPayload<ExtArgs>, T, "create", GlobalOmitOptions>>;
    move(userId: string, listId: string, boardId: string, newPosition: number): Promise<runtime.Types.Result.GetResult<import("../generated/prisma/models").$ListPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
}
