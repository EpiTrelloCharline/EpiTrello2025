import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
export declare class WorkspacesController {
    private svc;
    constructor(svc: WorkspacesService);
    list(req: any): Promise<any>;
    create(req: any, dto: CreateWorkspaceDto): Promise<any>;
    one(req: any, id: string): Promise<any>;
    invite(req: any, id: string, dto: InviteMemberDto): Promise<any>;
}
