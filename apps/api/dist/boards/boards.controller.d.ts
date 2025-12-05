import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
export declare class BoardsController {
    private svc;
    constructor(svc: BoardsService);
    list(workspaceId: string, req: any): Promise<any>;
    create(dto: CreateBoardDto, req: any): Promise<any>;
    one(id: string, req: any): Promise<any>;
    getMembers(id: string, req: any): Promise<any>;
    inviteMember(id: string, dto: InviteMemberDto, req: any): Promise<{
        id: any;
        userId: any;
        name: any;
        email: any;
        role: any;
        avatar: any;
    }>;
}
