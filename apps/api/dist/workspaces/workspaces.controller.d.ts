import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
export declare class WorkspacesController {
    private svc;
    constructor(svc: WorkspacesService);
    list(req: any): Promise<runtime.Types.Public.PrismaPromise<T>>;
    create(req: any, dto: CreateWorkspaceDto): Promise<runtime.Types.Utils.JsPromise<R>>;
    one(req: any, id: string): Promise<any>;
    invite(req: any, id: string, dto: InviteMemberDto): Promise<runtime.Types.Result.GetResult<import("../generated/prisma/models").$WorkspaceMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>>;
}
