export declare enum WorkspaceRoleDto {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
    OBSERVER = "OBSERVER"
}
export declare class InviteMemberDto {
    email: string;
    role: WorkspaceRoleDto;
}
