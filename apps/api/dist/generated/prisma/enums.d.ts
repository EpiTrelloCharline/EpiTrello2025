export declare const WorkspaceRole: {
    readonly OWNER: "OWNER";
    readonly ADMIN: "ADMIN";
    readonly MEMBER: "MEMBER";
    readonly OBSERVER: "OBSERVER";
};
export type WorkspaceRole = (typeof WorkspaceRole)[keyof typeof WorkspaceRole];
export declare const BoardRole: {
    readonly OWNER: "OWNER";
    readonly ADMIN: "ADMIN";
    readonly MEMBER: "MEMBER";
    readonly OBSERVER: "OBSERVER";
};
export type BoardRole = (typeof BoardRole)[keyof typeof BoardRole];
