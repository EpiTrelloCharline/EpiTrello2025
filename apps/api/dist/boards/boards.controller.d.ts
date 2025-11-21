import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
export declare class BoardsController {
    private svc;
    constructor(svc: BoardsService);
    list(workspaceId: string, req: any): Promise<runtime.Types.Public.PrismaPromise<T>>;
    create(dto: CreateBoardDto, req: any): Promise<runtime.Types.Result.GetResult<import("../generated/prisma/models").$BoardPayload<ExtArgs>, T, "create", GlobalOmitOptions>>;
    one(id: string, req: any): Promise<any>;
}
