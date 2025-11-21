import { PrismaService } from '../prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
export declare class BoardsService {
    private prisma;
    constructor(prisma: PrismaService);
    listInWorkspace(userId: string, workspaceId: string): Promise<runtime.Types.Public.PrismaPromise<T>>;
    create(userId: string, dto: CreateBoardDto): Promise<runtime.Types.Result.GetResult<import("../generated/prisma/models").$BoardPayload<ExtArgs>, T, "create", GlobalOmitOptions>>;
    getOne(userId: string, boardId: string): Promise<any>;
}
