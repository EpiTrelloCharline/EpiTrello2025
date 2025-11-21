import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace";
export type WorkspaceModel = runtime.Types.Result.DefaultSelection<Prisma.$WorkspacePayload>;
export type AggregateWorkspace = {
    _count: WorkspaceCountAggregateOutputType | null;
    _min: WorkspaceMinAggregateOutputType | null;
    _max: WorkspaceMaxAggregateOutputType | null;
};
export type WorkspaceMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    createdById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type WorkspaceMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    createdById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type WorkspaceCountAggregateOutputType = {
    id: number;
    name: number;
    description: number;
    createdById: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type WorkspaceMinAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    createdById?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type WorkspaceMaxAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    createdById?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type WorkspaceCountAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    createdById?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type WorkspaceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceWhereInput;
    orderBy?: Prisma.WorkspaceOrderByWithRelationInput | Prisma.WorkspaceOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WorkspaceCountAggregateInputType;
    _min?: WorkspaceMinAggregateInputType;
    _max?: WorkspaceMaxAggregateInputType;
};
export type GetWorkspaceAggregateType<T extends WorkspaceAggregateArgs> = {
    [P in keyof T & keyof AggregateWorkspace]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWorkspace[P]> : Prisma.GetScalarType<T[P], AggregateWorkspace[P]>;
};
export type WorkspaceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceWhereInput;
    orderBy?: Prisma.WorkspaceOrderByWithAggregationInput | Prisma.WorkspaceOrderByWithAggregationInput[];
    by: Prisma.WorkspaceScalarFieldEnum[] | Prisma.WorkspaceScalarFieldEnum;
    having?: Prisma.WorkspaceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WorkspaceCountAggregateInputType | true;
    _min?: WorkspaceMinAggregateInputType;
    _max?: WorkspaceMaxAggregateInputType;
};
export type WorkspaceGroupByOutputType = {
    id: string;
    name: string;
    description: string | null;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
    _count: WorkspaceCountAggregateOutputType | null;
    _min: WorkspaceMinAggregateOutputType | null;
    _max: WorkspaceMaxAggregateOutputType | null;
};
type GetWorkspaceGroupByPayload<T extends WorkspaceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WorkspaceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WorkspaceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WorkspaceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WorkspaceGroupByOutputType[P]>;
}>>;
export type WorkspaceWhereInput = {
    AND?: Prisma.WorkspaceWhereInput | Prisma.WorkspaceWhereInput[];
    OR?: Prisma.WorkspaceWhereInput[];
    NOT?: Prisma.WorkspaceWhereInput | Prisma.WorkspaceWhereInput[];
    id?: Prisma.StringFilter<"Workspace"> | string;
    name?: Prisma.StringFilter<"Workspace"> | string;
    description?: Prisma.StringNullableFilter<"Workspace"> | string | null;
    createdById?: Prisma.StringFilter<"Workspace"> | string;
    createdAt?: Prisma.DateTimeFilter<"Workspace"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Workspace"> | Date | string;
    createdBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    members?: Prisma.WorkspaceMemberListRelationFilter;
    boards?: Prisma.BoardListRelationFilter;
};
export type WorkspaceOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    createdBy?: Prisma.UserOrderByWithRelationInput;
    members?: Prisma.WorkspaceMemberOrderByRelationAggregateInput;
    boards?: Prisma.BoardOrderByRelationAggregateInput;
};
export type WorkspaceWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.WorkspaceWhereInput | Prisma.WorkspaceWhereInput[];
    OR?: Prisma.WorkspaceWhereInput[];
    NOT?: Prisma.WorkspaceWhereInput | Prisma.WorkspaceWhereInput[];
    name?: Prisma.StringFilter<"Workspace"> | string;
    description?: Prisma.StringNullableFilter<"Workspace"> | string | null;
    createdById?: Prisma.StringFilter<"Workspace"> | string;
    createdAt?: Prisma.DateTimeFilter<"Workspace"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Workspace"> | Date | string;
    createdBy?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    members?: Prisma.WorkspaceMemberListRelationFilter;
    boards?: Prisma.BoardListRelationFilter;
}, "id">;
export type WorkspaceOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.WorkspaceCountOrderByAggregateInput;
    _max?: Prisma.WorkspaceMaxOrderByAggregateInput;
    _min?: Prisma.WorkspaceMinOrderByAggregateInput;
};
export type WorkspaceScalarWhereWithAggregatesInput = {
    AND?: Prisma.WorkspaceScalarWhereWithAggregatesInput | Prisma.WorkspaceScalarWhereWithAggregatesInput[];
    OR?: Prisma.WorkspaceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WorkspaceScalarWhereWithAggregatesInput | Prisma.WorkspaceScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Workspace"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Workspace"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Workspace"> | string | null;
    createdById?: Prisma.StringWithAggregatesFilter<"Workspace"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Workspace"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Workspace"> | Date | string;
};
export type WorkspaceCreateInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    createdBy: Prisma.UserCreateNestedOneWithoutCreatedWorkspacesInput;
    members?: Prisma.WorkspaceMemberCreateNestedManyWithoutWorkspaceInput;
    boards?: Prisma.BoardCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUncheckedCreateInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput;
    boards?: Prisma.BoardUncheckedCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.UserUpdateOneRequiredWithoutCreatedWorkspacesNestedInput;
    members?: Prisma.WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput;
    boards?: Prisma.BoardUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput;
    boards?: Prisma.BoardUncheckedUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceCreateManyInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WorkspaceUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceListRelationFilter = {
    every?: Prisma.WorkspaceWhereInput;
    some?: Prisma.WorkspaceWhereInput;
    none?: Prisma.WorkspaceWhereInput;
};
export type WorkspaceOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type WorkspaceCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WorkspaceMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WorkspaceMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WorkspaceScalarRelationFilter = {
    is?: Prisma.WorkspaceWhereInput;
    isNot?: Prisma.WorkspaceWhereInput;
};
export type WorkspaceCreateNestedManyWithoutCreatedByInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutCreatedByInput, Prisma.WorkspaceUncheckedCreateWithoutCreatedByInput> | Prisma.WorkspaceCreateWithoutCreatedByInput[] | Prisma.WorkspaceUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutCreatedByInput | Prisma.WorkspaceCreateOrConnectWithoutCreatedByInput[];
    createMany?: Prisma.WorkspaceCreateManyCreatedByInputEnvelope;
    connect?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
};
export type WorkspaceUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutCreatedByInput, Prisma.WorkspaceUncheckedCreateWithoutCreatedByInput> | Prisma.WorkspaceCreateWithoutCreatedByInput[] | Prisma.WorkspaceUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutCreatedByInput | Prisma.WorkspaceCreateOrConnectWithoutCreatedByInput[];
    createMany?: Prisma.WorkspaceCreateManyCreatedByInputEnvelope;
    connect?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
};
export type WorkspaceUpdateManyWithoutCreatedByNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutCreatedByInput, Prisma.WorkspaceUncheckedCreateWithoutCreatedByInput> | Prisma.WorkspaceCreateWithoutCreatedByInput[] | Prisma.WorkspaceUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutCreatedByInput | Prisma.WorkspaceCreateOrConnectWithoutCreatedByInput[];
    upsert?: Prisma.WorkspaceUpsertWithWhereUniqueWithoutCreatedByInput | Prisma.WorkspaceUpsertWithWhereUniqueWithoutCreatedByInput[];
    createMany?: Prisma.WorkspaceCreateManyCreatedByInputEnvelope;
    set?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
    disconnect?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
    delete?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
    connect?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
    update?: Prisma.WorkspaceUpdateWithWhereUniqueWithoutCreatedByInput | Prisma.WorkspaceUpdateWithWhereUniqueWithoutCreatedByInput[];
    updateMany?: Prisma.WorkspaceUpdateManyWithWhereWithoutCreatedByInput | Prisma.WorkspaceUpdateManyWithWhereWithoutCreatedByInput[];
    deleteMany?: Prisma.WorkspaceScalarWhereInput | Prisma.WorkspaceScalarWhereInput[];
};
export type WorkspaceUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutCreatedByInput, Prisma.WorkspaceUncheckedCreateWithoutCreatedByInput> | Prisma.WorkspaceCreateWithoutCreatedByInput[] | Prisma.WorkspaceUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutCreatedByInput | Prisma.WorkspaceCreateOrConnectWithoutCreatedByInput[];
    upsert?: Prisma.WorkspaceUpsertWithWhereUniqueWithoutCreatedByInput | Prisma.WorkspaceUpsertWithWhereUniqueWithoutCreatedByInput[];
    createMany?: Prisma.WorkspaceCreateManyCreatedByInputEnvelope;
    set?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
    disconnect?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
    delete?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
    connect?: Prisma.WorkspaceWhereUniqueInput | Prisma.WorkspaceWhereUniqueInput[];
    update?: Prisma.WorkspaceUpdateWithWhereUniqueWithoutCreatedByInput | Prisma.WorkspaceUpdateWithWhereUniqueWithoutCreatedByInput[];
    updateMany?: Prisma.WorkspaceUpdateManyWithWhereWithoutCreatedByInput | Prisma.WorkspaceUpdateManyWithWhereWithoutCreatedByInput[];
    deleteMany?: Prisma.WorkspaceScalarWhereInput | Prisma.WorkspaceScalarWhereInput[];
};
export type WorkspaceCreateNestedOneWithoutMembersInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutMembersInput, Prisma.WorkspaceUncheckedCreateWithoutMembersInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutMembersInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceUpdateOneRequiredWithoutMembersNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutMembersInput, Prisma.WorkspaceUncheckedCreateWithoutMembersInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutMembersInput;
    upsert?: Prisma.WorkspaceUpsertWithoutMembersInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WorkspaceUpdateToOneWithWhereWithoutMembersInput, Prisma.WorkspaceUpdateWithoutMembersInput>, Prisma.WorkspaceUncheckedUpdateWithoutMembersInput>;
};
export type WorkspaceCreateNestedOneWithoutBoardsInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutBoardsInput, Prisma.WorkspaceUncheckedCreateWithoutBoardsInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutBoardsInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceUpdateOneRequiredWithoutBoardsNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceCreateWithoutBoardsInput, Prisma.WorkspaceUncheckedCreateWithoutBoardsInput>;
    connectOrCreate?: Prisma.WorkspaceCreateOrConnectWithoutBoardsInput;
    upsert?: Prisma.WorkspaceUpsertWithoutBoardsInput;
    connect?: Prisma.WorkspaceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WorkspaceUpdateToOneWithWhereWithoutBoardsInput, Prisma.WorkspaceUpdateWithoutBoardsInput>, Prisma.WorkspaceUncheckedUpdateWithoutBoardsInput>;
};
export type WorkspaceCreateWithoutCreatedByInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.WorkspaceMemberCreateNestedManyWithoutWorkspaceInput;
    boards?: Prisma.BoardCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUncheckedCreateWithoutCreatedByInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput;
    boards?: Prisma.BoardUncheckedCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceCreateOrConnectWithoutCreatedByInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutCreatedByInput, Prisma.WorkspaceUncheckedCreateWithoutCreatedByInput>;
};
export type WorkspaceCreateManyCreatedByInputEnvelope = {
    data: Prisma.WorkspaceCreateManyCreatedByInput | Prisma.WorkspaceCreateManyCreatedByInput[];
    skipDuplicates?: boolean;
};
export type WorkspaceUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    update: Prisma.XOR<Prisma.WorkspaceUpdateWithoutCreatedByInput, Prisma.WorkspaceUncheckedUpdateWithoutCreatedByInput>;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutCreatedByInput, Prisma.WorkspaceUncheckedCreateWithoutCreatedByInput>;
};
export type WorkspaceUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    data: Prisma.XOR<Prisma.WorkspaceUpdateWithoutCreatedByInput, Prisma.WorkspaceUncheckedUpdateWithoutCreatedByInput>;
};
export type WorkspaceUpdateManyWithWhereWithoutCreatedByInput = {
    where: Prisma.WorkspaceScalarWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceUpdateManyMutationInput, Prisma.WorkspaceUncheckedUpdateManyWithoutCreatedByInput>;
};
export type WorkspaceScalarWhereInput = {
    AND?: Prisma.WorkspaceScalarWhereInput | Prisma.WorkspaceScalarWhereInput[];
    OR?: Prisma.WorkspaceScalarWhereInput[];
    NOT?: Prisma.WorkspaceScalarWhereInput | Prisma.WorkspaceScalarWhereInput[];
    id?: Prisma.StringFilter<"Workspace"> | string;
    name?: Prisma.StringFilter<"Workspace"> | string;
    description?: Prisma.StringNullableFilter<"Workspace"> | string | null;
    createdById?: Prisma.StringFilter<"Workspace"> | string;
    createdAt?: Prisma.DateTimeFilter<"Workspace"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Workspace"> | Date | string;
};
export type WorkspaceCreateWithoutMembersInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    createdBy: Prisma.UserCreateNestedOneWithoutCreatedWorkspacesInput;
    boards?: Prisma.BoardCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUncheckedCreateWithoutMembersInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    boards?: Prisma.BoardUncheckedCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceCreateOrConnectWithoutMembersInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutMembersInput, Prisma.WorkspaceUncheckedCreateWithoutMembersInput>;
};
export type WorkspaceUpsertWithoutMembersInput = {
    update: Prisma.XOR<Prisma.WorkspaceUpdateWithoutMembersInput, Prisma.WorkspaceUncheckedUpdateWithoutMembersInput>;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutMembersInput, Prisma.WorkspaceUncheckedCreateWithoutMembersInput>;
    where?: Prisma.WorkspaceWhereInput;
};
export type WorkspaceUpdateToOneWithWhereWithoutMembersInput = {
    where?: Prisma.WorkspaceWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceUpdateWithoutMembersInput, Prisma.WorkspaceUncheckedUpdateWithoutMembersInput>;
};
export type WorkspaceUpdateWithoutMembersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.UserUpdateOneRequiredWithoutCreatedWorkspacesNestedInput;
    boards?: Prisma.BoardUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateWithoutMembersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    boards?: Prisma.BoardUncheckedUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceCreateWithoutBoardsInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    createdBy: Prisma.UserCreateNestedOneWithoutCreatedWorkspacesInput;
    members?: Prisma.WorkspaceMemberCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceUncheckedCreateWithoutBoardsInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput;
};
export type WorkspaceCreateOrConnectWithoutBoardsInput = {
    where: Prisma.WorkspaceWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutBoardsInput, Prisma.WorkspaceUncheckedCreateWithoutBoardsInput>;
};
export type WorkspaceUpsertWithoutBoardsInput = {
    update: Prisma.XOR<Prisma.WorkspaceUpdateWithoutBoardsInput, Prisma.WorkspaceUncheckedUpdateWithoutBoardsInput>;
    create: Prisma.XOR<Prisma.WorkspaceCreateWithoutBoardsInput, Prisma.WorkspaceUncheckedCreateWithoutBoardsInput>;
    where?: Prisma.WorkspaceWhereInput;
};
export type WorkspaceUpdateToOneWithWhereWithoutBoardsInput = {
    where?: Prisma.WorkspaceWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceUpdateWithoutBoardsInput, Prisma.WorkspaceUncheckedUpdateWithoutBoardsInput>;
};
export type WorkspaceUpdateWithoutBoardsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.UserUpdateOneRequiredWithoutCreatedWorkspacesNestedInput;
    members?: Prisma.WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateWithoutBoardsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceCreateManyCreatedByInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WorkspaceUpdateWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput;
    boards?: Prisma.BoardUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput;
    boards?: Prisma.BoardUncheckedUpdateManyWithoutWorkspaceNestedInput;
};
export type WorkspaceUncheckedUpdateManyWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceCountOutputType = {
    members: number;
    boards: number;
};
export type WorkspaceCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    members?: boolean | WorkspaceCountOutputTypeCountMembersArgs;
    boards?: boolean | WorkspaceCountOutputTypeCountBoardsArgs;
};
export type WorkspaceCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceCountOutputTypeSelect<ExtArgs> | null;
};
export type WorkspaceCountOutputTypeCountMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceMemberWhereInput;
};
export type WorkspaceCountOutputTypeCountBoardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardWhereInput;
};
export type WorkspaceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    members?: boolean | Prisma.Workspace$membersArgs<ExtArgs>;
    boards?: boolean | Prisma.Workspace$boardsArgs<ExtArgs>;
    _count?: boolean | Prisma.WorkspaceCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workspace"]>;
export type WorkspaceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workspace"]>;
export type WorkspaceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workspace"]>;
export type WorkspaceSelectScalar = {
    id?: boolean;
    name?: boolean;
    description?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type WorkspaceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "description" | "createdById" | "createdAt" | "updatedAt", ExtArgs["result"]["workspace"]>;
export type WorkspaceInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    members?: boolean | Prisma.Workspace$membersArgs<ExtArgs>;
    boards?: boolean | Prisma.Workspace$boardsArgs<ExtArgs>;
    _count?: boolean | Prisma.WorkspaceCountOutputTypeDefaultArgs<ExtArgs>;
};
export type WorkspaceIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type WorkspaceIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    createdBy?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $WorkspacePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Workspace";
    objects: {
        createdBy: Prisma.$UserPayload<ExtArgs>;
        members: Prisma.$WorkspaceMemberPayload<ExtArgs>[];
        boards: Prisma.$BoardPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        description: string | null;
        createdById: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["workspace"]>;
    composites: {};
};
export type WorkspaceGetPayload<S extends boolean | null | undefined | WorkspaceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WorkspacePayload, S>;
export type WorkspaceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WorkspaceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WorkspaceCountAggregateInputType | true;
};
export interface WorkspaceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Workspace'];
        meta: {
            name: 'Workspace';
        };
    };
    findUnique<T extends WorkspaceFindUniqueArgs>(args: Prisma.SelectSubset<T, WorkspaceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WorkspaceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WorkspaceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WorkspaceFindFirstArgs>(args?: Prisma.SelectSubset<T, WorkspaceFindFirstArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WorkspaceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WorkspaceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WorkspaceFindManyArgs>(args?: Prisma.SelectSubset<T, WorkspaceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WorkspaceCreateArgs>(args: Prisma.SelectSubset<T, WorkspaceCreateArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WorkspaceCreateManyArgs>(args?: Prisma.SelectSubset<T, WorkspaceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WorkspaceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WorkspaceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WorkspaceDeleteArgs>(args: Prisma.SelectSubset<T, WorkspaceDeleteArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WorkspaceUpdateArgs>(args: Prisma.SelectSubset<T, WorkspaceUpdateArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WorkspaceDeleteManyArgs>(args?: Prisma.SelectSubset<T, WorkspaceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WorkspaceUpdateManyArgs>(args: Prisma.SelectSubset<T, WorkspaceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WorkspaceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WorkspaceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WorkspaceUpsertArgs>(args: Prisma.SelectSubset<T, WorkspaceUpsertArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WorkspaceCountArgs>(args?: Prisma.Subset<T, WorkspaceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WorkspaceCountAggregateOutputType> : number>;
    aggregate<T extends WorkspaceAggregateArgs>(args: Prisma.Subset<T, WorkspaceAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceAggregateType<T>>;
    groupBy<T extends WorkspaceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WorkspaceGroupByArgs['orderBy'];
    } : {
        orderBy?: WorkspaceGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WorkspaceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WorkspaceFieldRefs;
}
export interface Prisma__WorkspaceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    createdBy<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    members<T extends Prisma.Workspace$membersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workspace$membersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    boards<T extends Prisma.Workspace$boardsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Workspace$boardsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WorkspaceFieldRefs {
    readonly id: Prisma.FieldRef<"Workspace", 'String'>;
    readonly name: Prisma.FieldRef<"Workspace", 'String'>;
    readonly description: Prisma.FieldRef<"Workspace", 'String'>;
    readonly createdById: Prisma.FieldRef<"Workspace", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Workspace", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Workspace", 'DateTime'>;
}
export type WorkspaceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    where: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    where: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    where?: Prisma.WorkspaceWhereInput;
    orderBy?: Prisma.WorkspaceOrderByWithRelationInput | Prisma.WorkspaceOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkspaceScalarFieldEnum | Prisma.WorkspaceScalarFieldEnum[];
};
export type WorkspaceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    where?: Prisma.WorkspaceWhereInput;
    orderBy?: Prisma.WorkspaceOrderByWithRelationInput | Prisma.WorkspaceOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkspaceScalarFieldEnum | Prisma.WorkspaceScalarFieldEnum[];
};
export type WorkspaceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    where?: Prisma.WorkspaceWhereInput;
    orderBy?: Prisma.WorkspaceOrderByWithRelationInput | Prisma.WorkspaceOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkspaceScalarFieldEnum | Prisma.WorkspaceScalarFieldEnum[];
};
export type WorkspaceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkspaceCreateInput, Prisma.WorkspaceUncheckedCreateInput>;
};
export type WorkspaceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WorkspaceCreateManyInput | Prisma.WorkspaceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WorkspaceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    data: Prisma.WorkspaceCreateManyInput | Prisma.WorkspaceCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.WorkspaceIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type WorkspaceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkspaceUpdateInput, Prisma.WorkspaceUncheckedUpdateInput>;
    where: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WorkspaceUpdateManyMutationInput, Prisma.WorkspaceUncheckedUpdateManyInput>;
    where?: Prisma.WorkspaceWhereInput;
    limit?: number;
};
export type WorkspaceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkspaceUpdateManyMutationInput, Prisma.WorkspaceUncheckedUpdateManyInput>;
    where?: Prisma.WorkspaceWhereInput;
    limit?: number;
    include?: Prisma.WorkspaceIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type WorkspaceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    where: Prisma.WorkspaceWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceCreateInput, Prisma.WorkspaceUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WorkspaceUpdateInput, Prisma.WorkspaceUncheckedUpdateInput>;
};
export type WorkspaceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
    where: Prisma.WorkspaceWhereUniqueInput;
};
export type WorkspaceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceWhereInput;
    limit?: number;
};
export type Workspace$membersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Workspace$boardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where?: Prisma.BoardWhereInput;
    orderBy?: Prisma.BoardOrderByWithRelationInput | Prisma.BoardOrderByWithRelationInput[];
    cursor?: Prisma.BoardWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BoardScalarFieldEnum | Prisma.BoardScalarFieldEnum[];
};
export type WorkspaceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInclude<ExtArgs> | null;
};
export {};
