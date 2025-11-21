import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { MoveListDto } from './dto/move-list.dto';
export declare class ListsController {
    private svc;
    constructor(svc: ListsService);
    list(boardId: string, req: any): Promise<runtime.Types.Public.PrismaPromise<T>>;
    create(dto: CreateListDto, req: any): Promise<runtime.Types.Result.GetResult<import("../generated/prisma/models").$ListPayload<ExtArgs>, T, "create", GlobalOmitOptions>>;
    move(dto: MoveListDto, req: any): Promise<runtime.Types.Result.GetResult<import("../generated/prisma/models").$ListPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
}
