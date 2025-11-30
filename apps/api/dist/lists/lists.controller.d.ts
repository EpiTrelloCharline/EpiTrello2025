import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { MoveListDto } from './dto/move-list.dto';
export declare class ListsController {
    private svc;
    constructor(svc: ListsService);
    list(boardId: string, req: any): Promise<{
        id: string;
        title: string;
        isArchived: boolean;
        boardId: string;
        position: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    create(dto: CreateListDto, req: any): Promise<{
        id: string;
        title: string;
        isArchived: boolean;
        boardId: string;
        position: import("@prisma/client/runtime/library").Decimal;
    }>;
    move(dto: MoveListDto, req: any): Promise<{
        id: string;
        title: string;
        isArchived: boolean;
        boardId: string;
        position: import("@prisma/client/runtime/library").Decimal;
    }>;
}
