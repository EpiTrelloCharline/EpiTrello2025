import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { MoveListDto } from './dto/move-list.dto';
export declare class ListsController {
    private svc;
    constructor(svc: ListsService);
    list(boardId: string, req: any): Promise<any>;
    create(dto: CreateListDto, req: any): Promise<any>;
    move(dto: MoveListDto, req: any): Promise<any>;
}
