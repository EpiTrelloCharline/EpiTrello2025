import { PrismaService } from '../prisma.service';
export declare class ListsService {
    private prisma;
    constructor(prisma: PrismaService);
    private assertBoardMember;
    list(boardId: string, userId: string): Promise<any>;
    create(userId: string, boardId: string, title: string, afterId?: string): Promise<any>;
    move(userId: string, listId: string, boardId: string, newPosition: number): Promise<any>;
}
