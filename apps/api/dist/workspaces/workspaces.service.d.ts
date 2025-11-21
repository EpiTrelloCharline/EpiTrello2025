import { PrismaService } from '../prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
export declare class WorkspacesService {
    private prisma;
    constructor(prisma: PrismaService);
    listForUser(userId: string): Promise<runtime.Types.Public.PrismaPromise<T>>;
    create(userId: string, dto: CreateWorkspaceDto): Promise<runtime.Types.Utils.JsPromise<R>>;
    getOne(userId: string, workspaceId: string): Promise<any>;
    inviteByEmail(userId: string, workspaceId: string, email: string, role: 'ADMIN' | 'MEMBER' | 'OBSERVER'): Promise<runtime.Types.Result.GetResult<import("../generated/prisma/models").$WorkspaceMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>>;
}
