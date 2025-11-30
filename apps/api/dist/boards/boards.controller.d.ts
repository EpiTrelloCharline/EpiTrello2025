import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
export declare class BoardsController {
    private svc;
    constructor(svc: BoardsService);
    list(workspaceId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        workspaceId: string;
        title: string;
        isArchived: boolean;
    }[]>;
    create(dto: CreateBoardDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        workspaceId: string;
        title: string;
        isArchived: boolean;
    }>;
    one(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string;
        workspaceId: string;
        title: string;
        isArchived: boolean;
    }>;
}
