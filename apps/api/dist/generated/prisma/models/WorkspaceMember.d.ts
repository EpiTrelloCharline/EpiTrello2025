import type * as runtime from "@prisma/client/runtime/library";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type WorkspaceMemberModel = runtime.Types.Result.DefaultSelection<Prisma.$WorkspaceMemberPayload>;
export type AggregateWorkspaceMember = {
    _count: WorkspaceMemberCountAggregateOutputType | null;
    _min: WorkspaceMemberMinAggregateOutputType | null;
    _max: WorkspaceMemberMaxAggregateOutputType | null;
};
export type WorkspaceMemberMinAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    userId: string | null;
    role: $Enums.WorkspaceRole | null;
    createdAt: Date | null;
};
export type WorkspaceMemberMaxAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    userId: string | null;
    role: $Enums.WorkspaceRole | null;
    createdAt: Date | null;
};
export type WorkspaceMemberCountAggregateOutputType = {
    id: number;
    workspaceId: number;
    userId: number;
    role: number;
    createdAt: number;
    _all: number;
};
export type WorkspaceMemberMinAggregateInputType = {
    id?: true;
    workspaceId?: true;
    userId?: true;
    role?: true;
    createdAt?: true;
};
export type WorkspaceMemberMaxAggregateInputType = {
    id?: true;
    workspaceId?: true;
    userId?: true;
    role?: true;
    createdAt?: true;
};
export type WorkspaceMemberCountAggregateInputType = {
    id?: true;
    workspaceId?: true;
    userId?: true;
    role?: true;
    createdAt?: true;
    _all?: true;
};
export type WorkspaceMemberAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceMemberWhereInput;
    orderBy?: Prisma.WorkspaceMemberOrderByWithRelationInput | Prisma.WorkspaceMemberOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WorkspaceMemberCountAggregateInputType;
    _min?: WorkspaceMemberMinAggregateInputType;
    _max?: WorkspaceMemberMaxAggregateInputType;
};
export type GetWorkspaceMemberAggregateType<T extends WorkspaceMemberAggregateArgs> = {
    [P in keyof T & keyof AggregateWorkspaceMember]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWorkspaceMember[P]> : Prisma.GetScalarType<T[P], AggregateWorkspaceMember[P]>;
};
export type WorkspaceMemberGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceMemberWhereInput;
    orderBy?: Prisma.WorkspaceMemberOrderByWithAggregationInput | Prisma.WorkspaceMemberOrderByWithAggregationInput[];
    by: Prisma.WorkspaceMemberScalarFieldEnum[] | Prisma.WorkspaceMemberScalarFieldEnum;
    having?: Prisma.WorkspaceMemberScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WorkspaceMemberCountAggregateInputType | true;
    _min?: WorkspaceMemberMinAggregateInputType;
    _max?: WorkspaceMemberMaxAggregateInputType;
};
export type WorkspaceMemberGroupByOutputType = {
    id: string;
    workspaceId: string;
    userId: string;
    role: $Enums.WorkspaceRole;
    createdAt: Date;
    _count: WorkspaceMemberCountAggregateOutputType | null;
    _min: WorkspaceMemberMinAggregateOutputType | null;
    _max: WorkspaceMemberMaxAggregateOutputType | null;
};
type GetWorkspaceMemberGroupByPayload<T extends WorkspaceMemberGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WorkspaceMemberGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WorkspaceMemberGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WorkspaceMemberGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WorkspaceMemberGroupByOutputType[P]>;
}>>;
export type WorkspaceMemberWhereInput = {
    AND?: Prisma.WorkspaceMemberWhereInput | Prisma.WorkspaceMemberWhereInput[];
    OR?: Prisma.WorkspaceMemberWhereInput[];
    NOT?: Prisma.WorkspaceMemberWhereInput | Prisma.WorkspaceMemberWhereInput[];
    id?: Prisma.StringFilter<"WorkspaceMember"> | string;
    workspaceId?: Prisma.StringFilter<"WorkspaceMember"> | string;
    userId?: Prisma.StringFilter<"WorkspaceMember"> | string;
    role?: Prisma.EnumWorkspaceRoleFilter<"WorkspaceMember"> | $Enums.WorkspaceRole;
    createdAt?: Prisma.DateTimeFilter<"WorkspaceMember"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type WorkspaceMemberOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type WorkspaceMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    workspaceId_userId?: Prisma.WorkspaceMemberWorkspaceIdUserIdCompoundUniqueInput;
    AND?: Prisma.WorkspaceMemberWhereInput | Prisma.WorkspaceMemberWhereInput[];
    OR?: Prisma.WorkspaceMemberWhereInput[];
    NOT?: Prisma.WorkspaceMemberWhereInput | Prisma.WorkspaceMemberWhereInput[];
    workspaceId?: Prisma.StringFilter<"WorkspaceMember"> | string;
    userId?: Prisma.StringFilter<"WorkspaceMember"> | string;
    role?: Prisma.EnumWorkspaceRoleFilter<"WorkspaceMember"> | $Enums.WorkspaceRole;
    createdAt?: Prisma.DateTimeFilter<"WorkspaceMember"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "workspaceId_userId">;
export type WorkspaceMemberOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.WorkspaceMemberCountOrderByAggregateInput;
    _max?: Prisma.WorkspaceMemberMaxOrderByAggregateInput;
    _min?: Prisma.WorkspaceMemberMinOrderByAggregateInput;
};
export type WorkspaceMemberScalarWhereWithAggregatesInput = {
    AND?: Prisma.WorkspaceMemberScalarWhereWithAggregatesInput | Prisma.WorkspaceMemberScalarWhereWithAggregatesInput[];
    OR?: Prisma.WorkspaceMemberScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WorkspaceMemberScalarWhereWithAggregatesInput | Prisma.WorkspaceMemberScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"WorkspaceMember"> | string;
    workspaceId?: Prisma.StringWithAggregatesFilter<"WorkspaceMember"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"WorkspaceMember"> | string;
    role?: Prisma.EnumWorkspaceRoleWithAggregatesFilter<"WorkspaceMember"> | $Enums.WorkspaceRole;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"WorkspaceMember"> | Date | string;
};
export type WorkspaceMemberCreateInput = {
    id?: string;
    role?: $Enums.WorkspaceRole;
    createdAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutMembersInput;
    user: Prisma.UserCreateNestedOneWithoutWorkspacesInput;
};
export type WorkspaceMemberUncheckedCreateInput = {
    id?: string;
    workspaceId: string;
    userId: string;
    role?: $Enums.WorkspaceRole;
    createdAt?: Date | string;
};
export type WorkspaceMemberUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumWorkspaceRoleFieldUpdateOperationsInput | $Enums.WorkspaceRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutMembersNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutWorkspacesNestedInput;
};
export type WorkspaceMemberUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumWorkspaceRoleFieldUpdateOperationsInput | $Enums.WorkspaceRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceMemberCreateManyInput = {
    id?: string;
    workspaceId: string;
    userId: string;
    role?: $Enums.WorkspaceRole;
    createdAt?: Date | string;
};
export type WorkspaceMemberUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumWorkspaceRoleFieldUpdateOperationsInput | $Enums.WorkspaceRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceMemberUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumWorkspaceRoleFieldUpdateOperationsInput | $Enums.WorkspaceRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceMemberListRelationFilter = {
    every?: Prisma.WorkspaceMemberWhereInput;
    some?: Prisma.WorkspaceMemberWhereInput;
    none?: Prisma.WorkspaceMemberWhereInput;
};
export type WorkspaceMemberOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type WorkspaceMemberWorkspaceIdUserIdCompoundUniqueInput = {
    workspaceId: string;
    userId: string;
};
export type WorkspaceMemberCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WorkspaceMemberMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WorkspaceMemberMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WorkspaceMemberCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.WorkspaceMemberCreateWithoutUserInput, Prisma.WorkspaceMemberUncheckedCreateWithoutUserInput> | Prisma.WorkspaceMemberCreateWithoutUserInput[] | Prisma.WorkspaceMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.WorkspaceMemberCreateOrConnectWithoutUserInput | Prisma.WorkspaceMemberCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.WorkspaceMemberCreateManyUserInputEnvelope;
    connect?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
};
export type WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.WorkspaceMemberCreateWithoutUserInput, Prisma.WorkspaceMemberUncheckedCreateWithoutUserInput> | Prisma.WorkspaceMemberCreateWithoutUserInput[] | Prisma.WorkspaceMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.WorkspaceMemberCreateOrConnectWithoutUserInput | Prisma.WorkspaceMemberCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.WorkspaceMemberCreateManyUserInputEnvelope;
    connect?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
};
export type WorkspaceMemberUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceMemberCreateWithoutUserInput, Prisma.WorkspaceMemberUncheckedCreateWithoutUserInput> | Prisma.WorkspaceMemberCreateWithoutUserInput[] | Prisma.WorkspaceMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.WorkspaceMemberCreateOrConnectWithoutUserInput | Prisma.WorkspaceMemberCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.WorkspaceMemberUpsertWithWhereUniqueWithoutUserInput | Prisma.WorkspaceMemberUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.WorkspaceMemberCreateManyUserInputEnvelope;
    set?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
    disconnect?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
    delete?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
    connect?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
    update?: Prisma.WorkspaceMemberUpdateWithWhereUniqueWithoutUserInput | Prisma.WorkspaceMemberUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.WorkspaceMemberUpdateManyWithWhereWithoutUserInput | Prisma.WorkspaceMemberUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.WorkspaceMemberScalarWhereInput | Prisma.WorkspaceMemberScalarWhereInput[];
};
export type WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceMemberCreateWithoutUserInput, Prisma.WorkspaceMemberUncheckedCreateWithoutUserInput> | Prisma.WorkspaceMemberCreateWithoutUserInput[] | Prisma.WorkspaceMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.WorkspaceMemberCreateOrConnectWithoutUserInput | Prisma.WorkspaceMemberCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.WorkspaceMemberUpsertWithWhereUniqueWithoutUserInput | Prisma.WorkspaceMemberUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.WorkspaceMemberCreateManyUserInputEnvelope;
    set?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
    disconnect?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
    delete?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
    connect?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
    update?: Prisma.WorkspaceMemberUpdateWithWhereUniqueWithoutUserInput | Prisma.WorkspaceMemberUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.WorkspaceMemberUpdateManyWithWhereWithoutUserInput | Prisma.WorkspaceMemberUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.WorkspaceMemberScalarWhereInput | Prisma.WorkspaceMemberScalarWhereInput[];
};
export type WorkspaceMemberCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.WorkspaceMemberCreateWithoutWorkspaceInput, Prisma.WorkspaceMemberUncheckedCreateWithoutWorkspaceInput> | Prisma.WorkspaceMemberCreateWithoutWorkspaceInput[] | Prisma.WorkspaceMemberUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.WorkspaceMemberCreateOrConnectWithoutWorkspaceInput | Prisma.WorkspaceMemberCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.WorkspaceMemberCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
};
export type WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.WorkspaceMemberCreateWithoutWorkspaceInput, Prisma.WorkspaceMemberUncheckedCreateWithoutWorkspaceInput> | Prisma.WorkspaceMemberCreateWithoutWorkspaceInput[] | Prisma.WorkspaceMemberUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.WorkspaceMemberCreateOrConnectWithoutWorkspaceInput | Prisma.WorkspaceMemberCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.WorkspaceMemberCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
};
export type WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceMemberCreateWithoutWorkspaceInput, Prisma.WorkspaceMemberUncheckedCreateWithoutWorkspaceInput> | Prisma.WorkspaceMemberCreateWithoutWorkspaceInput[] | Prisma.WorkspaceMemberUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.WorkspaceMemberCreateOrConnectWithoutWorkspaceInput | Prisma.WorkspaceMemberCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.WorkspaceMemberUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.WorkspaceMemberUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.WorkspaceMemberCreateManyWorkspaceInputEnvelope;
    set?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
    disconnect?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
    delete?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
    connect?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
    update?: Prisma.WorkspaceMemberUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.WorkspaceMemberUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.WorkspaceMemberUpdateManyWithWhereWithoutWorkspaceInput | Prisma.WorkspaceMemberUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.WorkspaceMemberScalarWhereInput | Prisma.WorkspaceMemberScalarWhereInput[];
};
export type WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceMemberCreateWithoutWorkspaceInput, Prisma.WorkspaceMemberUncheckedCreateWithoutWorkspaceInput> | Prisma.WorkspaceMemberCreateWithoutWorkspaceInput[] | Prisma.WorkspaceMemberUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.WorkspaceMemberCreateOrConnectWithoutWorkspaceInput | Prisma.WorkspaceMemberCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.WorkspaceMemberUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.WorkspaceMemberUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.WorkspaceMemberCreateManyWorkspaceInputEnvelope;
    set?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
    disconnect?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
    delete?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
    connect?: Prisma.WorkspaceMemberWhereUniqueInput | Prisma.WorkspaceMemberWhereUniqueInput[];
    update?: Prisma.WorkspaceMemberUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.WorkspaceMemberUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.WorkspaceMemberUpdateManyWithWhereWithoutWorkspaceInput | Prisma.WorkspaceMemberUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.WorkspaceMemberScalarWhereInput | Prisma.WorkspaceMemberScalarWhereInput[];
};
export type EnumWorkspaceRoleFieldUpdateOperationsInput = {
    set?: $Enums.WorkspaceRole;
};
export type WorkspaceMemberCreateWithoutUserInput = {
    id?: string;
    role?: $Enums.WorkspaceRole;
    createdAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutMembersInput;
};
export type WorkspaceMemberUncheckedCreateWithoutUserInput = {
    id?: string;
    workspaceId: string;
    role?: $Enums.WorkspaceRole;
    createdAt?: Date | string;
};
export type WorkspaceMemberCreateOrConnectWithoutUserInput = {
    where: Prisma.WorkspaceMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceMemberCreateWithoutUserInput, Prisma.WorkspaceMemberUncheckedCreateWithoutUserInput>;
};
export type WorkspaceMemberCreateManyUserInputEnvelope = {
    data: Prisma.WorkspaceMemberCreateManyUserInput | Prisma.WorkspaceMemberCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type WorkspaceMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.WorkspaceMemberWhereUniqueInput;
    update: Prisma.XOR<Prisma.WorkspaceMemberUpdateWithoutUserInput, Prisma.WorkspaceMemberUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.WorkspaceMemberCreateWithoutUserInput, Prisma.WorkspaceMemberUncheckedCreateWithoutUserInput>;
};
export type WorkspaceMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.WorkspaceMemberWhereUniqueInput;
    data: Prisma.XOR<Prisma.WorkspaceMemberUpdateWithoutUserInput, Prisma.WorkspaceMemberUncheckedUpdateWithoutUserInput>;
};
export type WorkspaceMemberUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.WorkspaceMemberScalarWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceMemberUpdateManyMutationInput, Prisma.WorkspaceMemberUncheckedUpdateManyWithoutUserInput>;
};
export type WorkspaceMemberScalarWhereInput = {
    AND?: Prisma.WorkspaceMemberScalarWhereInput | Prisma.WorkspaceMemberScalarWhereInput[];
    OR?: Prisma.WorkspaceMemberScalarWhereInput[];
    NOT?: Prisma.WorkspaceMemberScalarWhereInput | Prisma.WorkspaceMemberScalarWhereInput[];
    id?: Prisma.StringFilter<"WorkspaceMember"> | string;
    workspaceId?: Prisma.StringFilter<"WorkspaceMember"> | string;
    userId?: Prisma.StringFilter<"WorkspaceMember"> | string;
    role?: Prisma.EnumWorkspaceRoleFilter<"WorkspaceMember"> | $Enums.WorkspaceRole;
    createdAt?: Prisma.DateTimeFilter<"WorkspaceMember"> | Date | string;
};
export type WorkspaceMemberCreateWithoutWorkspaceInput = {
    id?: string;
    role?: $Enums.WorkspaceRole;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutWorkspacesInput;
};
export type WorkspaceMemberUncheckedCreateWithoutWorkspaceInput = {
    id?: string;
    userId: string;
    role?: $Enums.WorkspaceRole;
    createdAt?: Date | string;
};
export type WorkspaceMemberCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.WorkspaceMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceMemberCreateWithoutWorkspaceInput, Prisma.WorkspaceMemberUncheckedCreateWithoutWorkspaceInput>;
};
export type WorkspaceMemberCreateManyWorkspaceInputEnvelope = {
    data: Prisma.WorkspaceMemberCreateManyWorkspaceInput | Prisma.WorkspaceMemberCreateManyWorkspaceInput[];
    skipDuplicates?: boolean;
};
export type WorkspaceMemberUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.WorkspaceMemberWhereUniqueInput;
    update: Prisma.XOR<Prisma.WorkspaceMemberUpdateWithoutWorkspaceInput, Prisma.WorkspaceMemberUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.WorkspaceMemberCreateWithoutWorkspaceInput, Prisma.WorkspaceMemberUncheckedCreateWithoutWorkspaceInput>;
};
export type WorkspaceMemberUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.WorkspaceMemberWhereUniqueInput;
    data: Prisma.XOR<Prisma.WorkspaceMemberUpdateWithoutWorkspaceInput, Prisma.WorkspaceMemberUncheckedUpdateWithoutWorkspaceInput>;
};
export type WorkspaceMemberUpdateManyWithWhereWithoutWorkspaceInput = {
    where: Prisma.WorkspaceMemberScalarWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceMemberUpdateManyMutationInput, Prisma.WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceInput>;
};
export type WorkspaceMemberCreateManyUserInput = {
    id?: string;
    workspaceId: string;
    role?: $Enums.WorkspaceRole;
    createdAt?: Date | string;
};
export type WorkspaceMemberUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumWorkspaceRoleFieldUpdateOperationsInput | $Enums.WorkspaceRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutMembersNestedInput;
};
export type WorkspaceMemberUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumWorkspaceRoleFieldUpdateOperationsInput | $Enums.WorkspaceRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceMemberUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumWorkspaceRoleFieldUpdateOperationsInput | $Enums.WorkspaceRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceMemberCreateManyWorkspaceInput = {
    id?: string;
    userId: string;
    role?: $Enums.WorkspaceRole;
    createdAt?: Date | string;
};
export type WorkspaceMemberUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumWorkspaceRoleFieldUpdateOperationsInput | $Enums.WorkspaceRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutWorkspacesNestedInput;
};
export type WorkspaceMemberUncheckedUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumWorkspaceRoleFieldUpdateOperationsInput | $Enums.WorkspaceRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumWorkspaceRoleFieldUpdateOperationsInput | $Enums.WorkspaceRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceMemberSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    userId?: boolean;
    role?: boolean;
    createdAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workspaceMember"]>;
export type WorkspaceMemberSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    userId?: boolean;
    role?: boolean;
    createdAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workspaceMember"]>;
export type WorkspaceMemberSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    userId?: boolean;
    role?: boolean;
    createdAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workspaceMember"]>;
export type WorkspaceMemberSelectScalar = {
    id?: boolean;
    workspaceId?: boolean;
    userId?: boolean;
    role?: boolean;
    createdAt?: boolean;
};
export type WorkspaceMemberOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "workspaceId" | "userId" | "role" | "createdAt", ExtArgs["result"]["workspaceMember"]>;
export type WorkspaceMemberInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type WorkspaceMemberIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type WorkspaceMemberIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $WorkspaceMemberPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "WorkspaceMember";
    objects: {
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        workspaceId: string;
        userId: string;
        role: $Enums.WorkspaceRole;
        createdAt: Date;
    }, ExtArgs["result"]["workspaceMember"]>;
    composites: {};
};
export type WorkspaceMemberGetPayload<S extends boolean | null | undefined | WorkspaceMemberDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WorkspaceMemberPayload, S>;
export type WorkspaceMemberCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WorkspaceMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WorkspaceMemberCountAggregateInputType | true;
};
export interface WorkspaceMemberDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['WorkspaceMember'];
        meta: {
            name: 'WorkspaceMember';
        };
    };
    findUnique<T extends WorkspaceMemberFindUniqueArgs>(args: Prisma.SelectSubset<T, WorkspaceMemberFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WorkspaceMemberClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WorkspaceMemberFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WorkspaceMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkspaceMemberClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WorkspaceMemberFindFirstArgs>(args?: Prisma.SelectSubset<T, WorkspaceMemberFindFirstArgs<ExtArgs>>): Prisma.Prisma__WorkspaceMemberClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WorkspaceMemberFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WorkspaceMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkspaceMemberClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WorkspaceMemberFindManyArgs>(args?: Prisma.SelectSubset<T, WorkspaceMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WorkspaceMemberCreateArgs>(args: Prisma.SelectSubset<T, WorkspaceMemberCreateArgs<ExtArgs>>): Prisma.Prisma__WorkspaceMemberClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WorkspaceMemberCreateManyArgs>(args?: Prisma.SelectSubset<T, WorkspaceMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WorkspaceMemberCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WorkspaceMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WorkspaceMemberDeleteArgs>(args: Prisma.SelectSubset<T, WorkspaceMemberDeleteArgs<ExtArgs>>): Prisma.Prisma__WorkspaceMemberClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WorkspaceMemberUpdateArgs>(args: Prisma.SelectSubset<T, WorkspaceMemberUpdateArgs<ExtArgs>>): Prisma.Prisma__WorkspaceMemberClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WorkspaceMemberDeleteManyArgs>(args?: Prisma.SelectSubset<T, WorkspaceMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WorkspaceMemberUpdateManyArgs>(args: Prisma.SelectSubset<T, WorkspaceMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WorkspaceMemberUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WorkspaceMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WorkspaceMemberUpsertArgs>(args: Prisma.SelectSubset<T, WorkspaceMemberUpsertArgs<ExtArgs>>): Prisma.Prisma__WorkspaceMemberClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WorkspaceMemberCountArgs>(args?: Prisma.Subset<T, WorkspaceMemberCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WorkspaceMemberCountAggregateOutputType> : number>;
    aggregate<T extends WorkspaceMemberAggregateArgs>(args: Prisma.Subset<T, WorkspaceMemberAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceMemberAggregateType<T>>;
    groupBy<T extends WorkspaceMemberGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WorkspaceMemberGroupByArgs['orderBy'];
    } : {
        orderBy?: WorkspaceMemberGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WorkspaceMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WorkspaceMemberFieldRefs;
}
export interface Prisma__WorkspaceMemberClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WorkspaceMemberFieldRefs {
    readonly id: Prisma.FieldRef<"WorkspaceMember", 'String'>;
    readonly workspaceId: Prisma.FieldRef<"WorkspaceMember", 'String'>;
    readonly userId: Prisma.FieldRef<"WorkspaceMember", 'String'>;
    readonly role: Prisma.FieldRef<"WorkspaceMember", 'WorkspaceRole'>;
    readonly createdAt: Prisma.FieldRef<"WorkspaceMember", 'DateTime'>;
}
export type WorkspaceMemberFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceMemberSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceMemberOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceMemberInclude<ExtArgs> | null;
    where: Prisma.WorkspaceMemberWhereUniqueInput;
};
export type WorkspaceMemberFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceMemberSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceMemberOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceMemberInclude<ExtArgs> | null;
    where: Prisma.WorkspaceMemberWhereUniqueInput;
};
export type WorkspaceMemberFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceMemberSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceMemberOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceMemberInclude<ExtArgs> | null;
    where?: Prisma.WorkspaceMemberWhereInput;
    orderBy?: Prisma.WorkspaceMemberOrderByWithRelationInput | Prisma.WorkspaceMemberOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkspaceMemberScalarFieldEnum | Prisma.WorkspaceMemberScalarFieldEnum[];
};
export type WorkspaceMemberFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceMemberSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceMemberOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceMemberInclude<ExtArgs> | null;
    where?: Prisma.WorkspaceMemberWhereInput;
    orderBy?: Prisma.WorkspaceMemberOrderByWithRelationInput | Prisma.WorkspaceMemberOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkspaceMemberScalarFieldEnum | Prisma.WorkspaceMemberScalarFieldEnum[];
};
export type WorkspaceMemberFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceMemberSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceMemberOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceMemberInclude<ExtArgs> | null;
    where?: Prisma.WorkspaceMemberWhereInput;
    orderBy?: Prisma.WorkspaceMemberOrderByWithRelationInput | Prisma.WorkspaceMemberOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkspaceMemberScalarFieldEnum | Prisma.WorkspaceMemberScalarFieldEnum[];
};
export type WorkspaceMemberCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceMemberSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceMemberOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceMemberInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkspaceMemberCreateInput, Prisma.WorkspaceMemberUncheckedCreateInput>;
};
export type WorkspaceMemberCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WorkspaceMemberCreateManyInput | Prisma.WorkspaceMemberCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WorkspaceMemberCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceMemberSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkspaceMemberOmit<ExtArgs> | null;
    data: Prisma.WorkspaceMemberCreateManyInput | Prisma.WorkspaceMemberCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.WorkspaceMemberIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type WorkspaceMemberUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceMemberSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceMemberOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceMemberInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkspaceMemberUpdateInput, Prisma.WorkspaceMemberUncheckedUpdateInput>;
    where: Prisma.WorkspaceMemberWhereUniqueInput;
};
export type WorkspaceMemberUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WorkspaceMemberUpdateManyMutationInput, Prisma.WorkspaceMemberUncheckedUpdateManyInput>;
    where?: Prisma.WorkspaceMemberWhereInput;
    limit?: number;
};
export type WorkspaceMemberUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceMemberSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkspaceMemberOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkspaceMemberUpdateManyMutationInput, Prisma.WorkspaceMemberUncheckedUpdateManyInput>;
    where?: Prisma.WorkspaceMemberWhereInput;
    limit?: number;
    include?: Prisma.WorkspaceMemberIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type WorkspaceMemberUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceMemberSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceMemberOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceMemberInclude<ExtArgs> | null;
    where: Prisma.WorkspaceMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceMemberCreateInput, Prisma.WorkspaceMemberUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WorkspaceMemberUpdateInput, Prisma.WorkspaceMemberUncheckedUpdateInput>;
};
export type WorkspaceMemberDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceMemberSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceMemberOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceMemberInclude<ExtArgs> | null;
    where: Prisma.WorkspaceMemberWhereUniqueInput;
};
export type WorkspaceMemberDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceMemberWhereInput;
    limit?: number;
};
export type WorkspaceMemberDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceMemberSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceMemberOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceMemberInclude<ExtArgs> | null;
};
export {};
