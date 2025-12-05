import { PrismaService } from '../prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
export declare class WorkspacesService {
    private prisma;
    constructor(prisma: PrismaService);
    listForUser(userId: string): Promise<any>;
    create(userId: string, dto: CreateWorkspaceDto): Promise<any>;
    getOne(userId: string, workspaceId: string): Promise<any>;
    inviteByEmail(userId: string, workspaceId: string, email: string, role: 'ADMIN' | 'MEMBER' | 'OBSERVER'): Promise<any>;
}
