import { PrismaService } from '../prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
export declare class BoardsService {
    private prisma;
    constructor(prisma: PrismaService);
    listInWorkspace(userId: string, workspaceId: string): Promise<any>;
    create(userId: string, dto: CreateBoardDto): Promise<any>;
    getOne(userId: string, boardId: string): Promise<any>;
    getMembers(userId: string, boardId: string): Promise<any>;
    inviteMember(userId: string, boardId: string, dto: InviteMemberDto): Promise<{
        id: any;
        userId: any;
        name: any;
        email: any;
        role: any;
        avatar: any;
    }>;
}
