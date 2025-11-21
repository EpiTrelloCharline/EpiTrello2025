import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace";
export type BoardModel = runtime.Types.Result.DefaultSelection<Prisma.$BoardPayload>;
export type AggregateBoard = {
    _count: BoardCountAggregateOutputType | null;
    _min: BoardMinAggregateOutputType | null;
    _max: BoardMaxAggregateOutputType | null;
};
export type BoardMinAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    title: string | null;
    isArchived: boolean | null;
    createdById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BoardMaxAggregateOutputType = {
    id: string | null;
    workspaceId: string | null;
    title: string | null;
    isArchived: boolean | null;
    createdById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BoardCountAggregateOutputType = {
    id: number;
    workspaceId: number;
    title: number;
    isArchived: number;
    createdById: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type BoardMinAggregateInputType = {
    id?: true;
    workspaceId?: true;
    title?: true;
    isArchived?: true;
    createdById?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BoardMaxAggregateInputType = {
    id?: true;
    workspaceId?: true;
    title?: true;
    isArchived?: true;
    createdById?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BoardCountAggregateInputType = {
    id?: true;
    workspaceId?: true;
    title?: true;
    isArchived?: true;
    createdById?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type BoardAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardWhereInput;
    orderBy?: Prisma.BoardOrderByWithRelationInput | Prisma.BoardOrderByWithRelationInput[];
    cursor?: Prisma.BoardWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BoardCountAggregateInputType;
    _min?: BoardMinAggregateInputType;
    _max?: BoardMaxAggregateInputType;
};
export type GetBoardAggregateType<T extends BoardAggregateArgs> = {
    [P in keyof T & keyof AggregateBoard]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBoard[P]> : Prisma.GetScalarType<T[P], AggregateBoard[P]>;
};
export type BoardGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardWhereInput;
    orderBy?: Prisma.BoardOrderByWithAggregationInput | Prisma.BoardOrderByWithAggregationInput[];
    by: Prisma.BoardScalarFieldEnum[] | Prisma.BoardScalarFieldEnum;
    having?: Prisma.BoardScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BoardCountAggregateInputType | true;
    _min?: BoardMinAggregateInputType;
    _max?: BoardMaxAggregateInputType;
};
export type BoardGroupByOutputType = {
    id: string;
    workspaceId: string;
    title: string;
    isArchived: boolean;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
    _count: BoardCountAggregateOutputType | null;
    _min: BoardMinAggregateOutputType | null;
    _max: BoardMaxAggregateOutputType | null;
};
type GetBoardGroupByPayload<T extends BoardGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BoardGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BoardGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BoardGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BoardGroupByOutputType[P]>;
}>>;
export type BoardWhereInput = {
    AND?: Prisma.BoardWhereInput | Prisma.BoardWhereInput[];
    OR?: Prisma.BoardWhereInput[];
    NOT?: Prisma.BoardWhereInput | Prisma.BoardWhereInput[];
    id?: Prisma.StringFilter<"Board"> | string;
    workspaceId?: Prisma.StringFilter<"Board"> | string;
    title?: Prisma.StringFilter<"Board"> | string;
    isArchived?: Prisma.BoolFilter<"Board"> | boolean;
    createdById?: Prisma.StringFilter<"Board"> | string;
    createdAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    members?: Prisma.BoardMemberListRelationFilter;
    lists?: Prisma.ListListRelationFilter;
};
export type BoardOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
    members?: Prisma.BoardMemberOrderByRelationAggregateInput;
    lists?: Prisma.ListOrderByRelationAggregateInput;
};
export type BoardWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.BoardWhereInput | Prisma.BoardWhereInput[];
    OR?: Prisma.BoardWhereInput[];
    NOT?: Prisma.BoardWhereInput | Prisma.BoardWhereInput[];
    workspaceId?: Prisma.StringFilter<"Board"> | string;
    title?: Prisma.StringFilter<"Board"> | string;
    isArchived?: Prisma.BoolFilter<"Board"> | boolean;
    createdById?: Prisma.StringFilter<"Board"> | string;
    createdAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    members?: Prisma.BoardMemberListRelationFilter;
    lists?: Prisma.ListListRelationFilter;
}, "id">;
export type BoardOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BoardCountOrderByAggregateInput;
    _max?: Prisma.BoardMaxOrderByAggregateInput;
    _min?: Prisma.BoardMinOrderByAggregateInput;
};
export type BoardScalarWhereWithAggregatesInput = {
    AND?: Prisma.BoardScalarWhereWithAggregatesInput | Prisma.BoardScalarWhereWithAggregatesInput[];
    OR?: Prisma.BoardScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BoardScalarWhereWithAggregatesInput | Prisma.BoardScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Board"> | string;
    workspaceId?: Prisma.StringWithAggregatesFilter<"Board"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Board"> | string;
    isArchived?: Prisma.BoolWithAggregatesFilter<"Board"> | boolean;
    createdById?: Prisma.StringWithAggregatesFilter<"Board"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Board"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Board"> | Date | string;
};
export type BoardCreateInput = {
    id?: string;
    title: string;
    isArchived?: boolean;
    createdById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutBoardsInput;
    members?: Prisma.BoardMemberCreateNestedManyWithoutBoardInput;
    lists?: Prisma.ListCreateNestedManyWithoutBoardInput;
};
export type BoardUncheckedCreateInput = {
    id?: string;
    workspaceId: string;
    title: string;
    isArchived?: boolean;
    createdById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.BoardMemberUncheckedCreateNestedManyWithoutBoardInput;
    lists?: Prisma.ListUncheckedCreateNestedManyWithoutBoardInput;
};
export type BoardUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutBoardsNestedInput;
    members?: Prisma.BoardMemberUpdateManyWithoutBoardNestedInput;
    lists?: Prisma.ListUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.BoardMemberUncheckedUpdateManyWithoutBoardNestedInput;
    lists?: Prisma.ListUncheckedUpdateManyWithoutBoardNestedInput;
};
export type BoardCreateManyInput = {
    id?: string;
    workspaceId: string;
    title: string;
    isArchived?: boolean;
    createdById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BoardUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardListRelationFilter = {
    every?: Prisma.BoardWhereInput;
    some?: Prisma.BoardWhereInput;
    none?: Prisma.BoardWhereInput;
};
export type BoardOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BoardCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BoardMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BoardMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BoardScalarRelationFilter = {
    is?: Prisma.BoardWhereInput;
    isNot?: Prisma.BoardWhereInput;
};
export type BoardCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutWorkspaceInput, Prisma.BoardUncheckedCreateWithoutWorkspaceInput> | Prisma.BoardCreateWithoutWorkspaceInput[] | Prisma.BoardUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutWorkspaceInput | Prisma.BoardCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.BoardCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
};
export type BoardUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutWorkspaceInput, Prisma.BoardUncheckedCreateWithoutWorkspaceInput> | Prisma.BoardCreateWithoutWorkspaceInput[] | Prisma.BoardUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutWorkspaceInput | Prisma.BoardCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.BoardCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
};
export type BoardUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutWorkspaceInput, Prisma.BoardUncheckedCreateWithoutWorkspaceInput> | Prisma.BoardCreateWithoutWorkspaceInput[] | Prisma.BoardUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutWorkspaceInput | Prisma.BoardCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.BoardUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.BoardUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.BoardCreateManyWorkspaceInputEnvelope;
    set?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    disconnect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    delete?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    connect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    update?: Prisma.BoardUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.BoardUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.BoardUpdateManyWithWhereWithoutWorkspaceInput | Prisma.BoardUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.BoardScalarWhereInput | Prisma.BoardScalarWhereInput[];
};
export type BoardUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutWorkspaceInput, Prisma.BoardUncheckedCreateWithoutWorkspaceInput> | Prisma.BoardCreateWithoutWorkspaceInput[] | Prisma.BoardUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutWorkspaceInput | Prisma.BoardCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.BoardUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.BoardUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.BoardCreateManyWorkspaceInputEnvelope;
    set?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    disconnect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    delete?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    connect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    update?: Prisma.BoardUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.BoardUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.BoardUpdateManyWithWhereWithoutWorkspaceInput | Prisma.BoardUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.BoardScalarWhereInput | Prisma.BoardScalarWhereInput[];
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type BoardCreateNestedOneWithoutMembersInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutMembersInput, Prisma.BoardUncheckedCreateWithoutMembersInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutMembersInput;
    connect?: Prisma.BoardWhereUniqueInput;
};
export type BoardUpdateOneRequiredWithoutMembersNestedInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutMembersInput, Prisma.BoardUncheckedCreateWithoutMembersInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutMembersInput;
    upsert?: Prisma.BoardUpsertWithoutMembersInput;
    connect?: Prisma.BoardWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BoardUpdateToOneWithWhereWithoutMembersInput, Prisma.BoardUpdateWithoutMembersInput>, Prisma.BoardUncheckedUpdateWithoutMembersInput>;
};
export type BoardCreateNestedOneWithoutListsInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutListsInput, Prisma.BoardUncheckedCreateWithoutListsInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutListsInput;
    connect?: Prisma.BoardWhereUniqueInput;
};
export type BoardUpdateOneRequiredWithoutListsNestedInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutListsInput, Prisma.BoardUncheckedCreateWithoutListsInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutListsInput;
    upsert?: Prisma.BoardUpsertWithoutListsInput;
    connect?: Prisma.BoardWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BoardUpdateToOneWithWhereWithoutListsInput, Prisma.BoardUpdateWithoutListsInput>, Prisma.BoardUncheckedUpdateWithoutListsInput>;
};
export type BoardCreateWithoutWorkspaceInput = {
    id?: string;
    title: string;
    isArchived?: boolean;
    createdById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.BoardMemberCreateNestedManyWithoutBoardInput;
    lists?: Prisma.ListCreateNestedManyWithoutBoardInput;
};
export type BoardUncheckedCreateWithoutWorkspaceInput = {
    id?: string;
    title: string;
    isArchived?: boolean;
    createdById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.BoardMemberUncheckedCreateNestedManyWithoutBoardInput;
    lists?: Prisma.ListUncheckedCreateNestedManyWithoutBoardInput;
};
export type BoardCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.BoardWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardCreateWithoutWorkspaceInput, Prisma.BoardUncheckedCreateWithoutWorkspaceInput>;
};
export type BoardCreateManyWorkspaceInputEnvelope = {
    data: Prisma.BoardCreateManyWorkspaceInput | Prisma.BoardCreateManyWorkspaceInput[];
    skipDuplicates?: boolean;
};
export type BoardUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.BoardWhereUniqueInput;
    update: Prisma.XOR<Prisma.BoardUpdateWithoutWorkspaceInput, Prisma.BoardUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.BoardCreateWithoutWorkspaceInput, Prisma.BoardUncheckedCreateWithoutWorkspaceInput>;
};
export type BoardUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.BoardWhereUniqueInput;
    data: Prisma.XOR<Prisma.BoardUpdateWithoutWorkspaceInput, Prisma.BoardUncheckedUpdateWithoutWorkspaceInput>;
};
export type BoardUpdateManyWithWhereWithoutWorkspaceInput = {
    where: Prisma.BoardScalarWhereInput;
    data: Prisma.XOR<Prisma.BoardUpdateManyMutationInput, Prisma.BoardUncheckedUpdateManyWithoutWorkspaceInput>;
};
export type BoardScalarWhereInput = {
    AND?: Prisma.BoardScalarWhereInput | Prisma.BoardScalarWhereInput[];
    OR?: Prisma.BoardScalarWhereInput[];
    NOT?: Prisma.BoardScalarWhereInput | Prisma.BoardScalarWhereInput[];
    id?: Prisma.StringFilter<"Board"> | string;
    workspaceId?: Prisma.StringFilter<"Board"> | string;
    title?: Prisma.StringFilter<"Board"> | string;
    isArchived?: Prisma.BoolFilter<"Board"> | boolean;
    createdById?: Prisma.StringFilter<"Board"> | string;
    createdAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
};
export type BoardCreateWithoutMembersInput = {
    id?: string;
    title: string;
    isArchived?: boolean;
    createdById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutBoardsInput;
    lists?: Prisma.ListCreateNestedManyWithoutBoardInput;
};
export type BoardUncheckedCreateWithoutMembersInput = {
    id?: string;
    workspaceId: string;
    title: string;
    isArchived?: boolean;
    createdById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    lists?: Prisma.ListUncheckedCreateNestedManyWithoutBoardInput;
};
export type BoardCreateOrConnectWithoutMembersInput = {
    where: Prisma.BoardWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardCreateWithoutMembersInput, Prisma.BoardUncheckedCreateWithoutMembersInput>;
};
export type BoardUpsertWithoutMembersInput = {
    update: Prisma.XOR<Prisma.BoardUpdateWithoutMembersInput, Prisma.BoardUncheckedUpdateWithoutMembersInput>;
    create: Prisma.XOR<Prisma.BoardCreateWithoutMembersInput, Prisma.BoardUncheckedCreateWithoutMembersInput>;
    where?: Prisma.BoardWhereInput;
};
export type BoardUpdateToOneWithWhereWithoutMembersInput = {
    where?: Prisma.BoardWhereInput;
    data: Prisma.XOR<Prisma.BoardUpdateWithoutMembersInput, Prisma.BoardUncheckedUpdateWithoutMembersInput>;
};
export type BoardUpdateWithoutMembersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutBoardsNestedInput;
    lists?: Prisma.ListUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateWithoutMembersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lists?: Prisma.ListUncheckedUpdateManyWithoutBoardNestedInput;
};
export type BoardCreateWithoutListsInput = {
    id?: string;
    title: string;
    isArchived?: boolean;
    createdById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutBoardsInput;
    members?: Prisma.BoardMemberCreateNestedManyWithoutBoardInput;
};
export type BoardUncheckedCreateWithoutListsInput = {
    id?: string;
    workspaceId: string;
    title: string;
    isArchived?: boolean;
    createdById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    members?: Prisma.BoardMemberUncheckedCreateNestedManyWithoutBoardInput;
};
export type BoardCreateOrConnectWithoutListsInput = {
    where: Prisma.BoardWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardCreateWithoutListsInput, Prisma.BoardUncheckedCreateWithoutListsInput>;
};
export type BoardUpsertWithoutListsInput = {
    update: Prisma.XOR<Prisma.BoardUpdateWithoutListsInput, Prisma.BoardUncheckedUpdateWithoutListsInput>;
    create: Prisma.XOR<Prisma.BoardCreateWithoutListsInput, Prisma.BoardUncheckedCreateWithoutListsInput>;
    where?: Prisma.BoardWhereInput;
};
export type BoardUpdateToOneWithWhereWithoutListsInput = {
    where?: Prisma.BoardWhereInput;
    data: Prisma.XOR<Prisma.BoardUpdateWithoutListsInput, Prisma.BoardUncheckedUpdateWithoutListsInput>;
};
export type BoardUpdateWithoutListsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutBoardsNestedInput;
    members?: Prisma.BoardMemberUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateWithoutListsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    workspaceId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.BoardMemberUncheckedUpdateManyWithoutBoardNestedInput;
};
export type BoardCreateManyWorkspaceInput = {
    id?: string;
    title: string;
    isArchived?: boolean;
    createdById: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BoardUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.BoardMemberUpdateManyWithoutBoardNestedInput;
    lists?: Prisma.ListUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    members?: Prisma.BoardMemberUncheckedUpdateManyWithoutBoardNestedInput;
    lists?: Prisma.ListUncheckedUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdById?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardCountOutputType = {
    members: number;
    lists: number;
};
export type BoardCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    members?: boolean | BoardCountOutputTypeCountMembersArgs;
    lists?: boolean | BoardCountOutputTypeCountListsArgs;
};
export type BoardCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardCountOutputTypeSelect<ExtArgs> | null;
};
export type BoardCountOutputTypeCountMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardMemberWhereInput;
};
export type BoardCountOutputTypeCountListsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListWhereInput;
};
export type BoardSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    title?: boolean;
    isArchived?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    members?: boolean | Prisma.Board$membersArgs<ExtArgs>;
    lists?: boolean | Prisma.Board$listsArgs<ExtArgs>;
    _count?: boolean | Prisma.BoardCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["board"]>;
export type BoardSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    title?: boolean;
    isArchived?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["board"]>;
export type BoardSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    title?: boolean;
    isArchived?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["board"]>;
export type BoardSelectScalar = {
    id?: boolean;
    workspaceId?: boolean;
    title?: boolean;
    isArchived?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type BoardOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "workspaceId" | "title" | "isArchived" | "createdById" | "createdAt" | "updatedAt", ExtArgs["result"]["board"]>;
export type BoardInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    members?: boolean | Prisma.Board$membersArgs<ExtArgs>;
    lists?: boolean | Prisma.Board$listsArgs<ExtArgs>;
    _count?: boolean | Prisma.BoardCountOutputTypeDefaultArgs<ExtArgs>;
};
export type BoardIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
};
export type BoardIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
};
export type $BoardPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Board";
    objects: {
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
        members: Prisma.$BoardMemberPayload<ExtArgs>[];
        lists: Prisma.$ListPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        workspaceId: string;
        title: string;
        isArchived: boolean;
        createdById: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["board"]>;
    composites: {};
};
export type BoardGetPayload<S extends boolean | null | undefined | BoardDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BoardPayload, S>;
export type BoardCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BoardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BoardCountAggregateInputType | true;
};
export interface BoardDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Board'];
        meta: {
            name: 'Board';
        };
    };
    findUnique<T extends BoardFindUniqueArgs>(args: Prisma.SelectSubset<T, BoardFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BoardFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BoardFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BoardFindFirstArgs>(args?: Prisma.SelectSubset<T, BoardFindFirstArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BoardFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BoardFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BoardFindManyArgs>(args?: Prisma.SelectSubset<T, BoardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BoardCreateArgs>(args: Prisma.SelectSubset<T, BoardCreateArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BoardCreateManyArgs>(args?: Prisma.SelectSubset<T, BoardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BoardCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BoardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BoardDeleteArgs>(args: Prisma.SelectSubset<T, BoardDeleteArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BoardUpdateArgs>(args: Prisma.SelectSubset<T, BoardUpdateArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BoardDeleteManyArgs>(args?: Prisma.SelectSubset<T, BoardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BoardUpdateManyArgs>(args: Prisma.SelectSubset<T, BoardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BoardUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BoardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BoardUpsertArgs>(args: Prisma.SelectSubset<T, BoardUpsertArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BoardCountArgs>(args?: Prisma.Subset<T, BoardCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BoardCountAggregateOutputType> : number>;
    aggregate<T extends BoardAggregateArgs>(args: Prisma.Subset<T, BoardAggregateArgs>): Prisma.PrismaPromise<GetBoardAggregateType<T>>;
    groupBy<T extends BoardGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BoardGroupByArgs['orderBy'];
    } : {
        orderBy?: BoardGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BoardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBoardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BoardFieldRefs;
}
export interface Prisma__BoardClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    members<T extends Prisma.Board$membersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Board$membersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    lists<T extends Prisma.Board$listsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Board$listsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BoardFieldRefs {
    readonly id: Prisma.FieldRef<"Board", 'String'>;
    readonly workspaceId: Prisma.FieldRef<"Board", 'String'>;
    readonly title: Prisma.FieldRef<"Board", 'String'>;
    readonly isArchived: Prisma.FieldRef<"Board", 'Boolean'>;
    readonly createdById: Prisma.FieldRef<"Board", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Board", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Board", 'DateTime'>;
}
export type BoardFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where: Prisma.BoardWhereUniqueInput;
};
export type BoardFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where: Prisma.BoardWhereUniqueInput;
};
export type BoardFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardCreateInput, Prisma.BoardUncheckedCreateInput>;
};
export type BoardCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BoardCreateManyInput | Prisma.BoardCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BoardCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    data: Prisma.BoardCreateManyInput | Prisma.BoardCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BoardIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BoardUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardUpdateInput, Prisma.BoardUncheckedUpdateInput>;
    where: Prisma.BoardWhereUniqueInput;
};
export type BoardUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BoardUpdateManyMutationInput, Prisma.BoardUncheckedUpdateManyInput>;
    where?: Prisma.BoardWhereInput;
    limit?: number;
};
export type BoardUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardUpdateManyMutationInput, Prisma.BoardUncheckedUpdateManyInput>;
    where?: Prisma.BoardWhereInput;
    limit?: number;
    include?: Prisma.BoardIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BoardUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where: Prisma.BoardWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardCreateInput, Prisma.BoardUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BoardUpdateInput, Prisma.BoardUncheckedUpdateInput>;
};
export type BoardDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where: Prisma.BoardWhereUniqueInput;
};
export type BoardDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardWhereInput;
    limit?: number;
};
export type Board$membersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardMemberSelect<ExtArgs> | null;
    omit?: Prisma.BoardMemberOmit<ExtArgs> | null;
    include?: Prisma.BoardMemberInclude<ExtArgs> | null;
    where?: Prisma.BoardMemberWhereInput;
    orderBy?: Prisma.BoardMemberOrderByWithRelationInput | Prisma.BoardMemberOrderByWithRelationInput[];
    cursor?: Prisma.BoardMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BoardMemberScalarFieldEnum | Prisma.BoardMemberScalarFieldEnum[];
};
export type Board$listsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelect<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    include?: Prisma.ListInclude<ExtArgs> | null;
    where?: Prisma.ListWhereInput;
    orderBy?: Prisma.ListOrderByWithRelationInput | Prisma.ListOrderByWithRelationInput[];
    cursor?: Prisma.ListWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ListScalarFieldEnum | Prisma.ListScalarFieldEnum[];
};
export type BoardDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
};
export {};
