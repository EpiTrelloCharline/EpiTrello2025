import type * as runtime from "@prisma/client/runtime/library";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type BoardMemberModel = runtime.Types.Result.DefaultSelection<Prisma.$BoardMemberPayload>;
export type AggregateBoardMember = {
    _count: BoardMemberCountAggregateOutputType | null;
    _min: BoardMemberMinAggregateOutputType | null;
    _max: BoardMemberMaxAggregateOutputType | null;
};
export type BoardMemberMinAggregateOutputType = {
    id: string | null;
    boardId: string | null;
    userId: string | null;
    role: $Enums.BoardRole | null;
};
export type BoardMemberMaxAggregateOutputType = {
    id: string | null;
    boardId: string | null;
    userId: string | null;
    role: $Enums.BoardRole | null;
};
export type BoardMemberCountAggregateOutputType = {
    id: number;
    boardId: number;
    userId: number;
    role: number;
    _all: number;
};
export type BoardMemberMinAggregateInputType = {
    id?: true;
    boardId?: true;
    userId?: true;
    role?: true;
};
export type BoardMemberMaxAggregateInputType = {
    id?: true;
    boardId?: true;
    userId?: true;
    role?: true;
};
export type BoardMemberCountAggregateInputType = {
    id?: true;
    boardId?: true;
    userId?: true;
    role?: true;
    _all?: true;
};
export type BoardMemberAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardMemberWhereInput;
    orderBy?: Prisma.BoardMemberOrderByWithRelationInput | Prisma.BoardMemberOrderByWithRelationInput[];
    cursor?: Prisma.BoardMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BoardMemberCountAggregateInputType;
    _min?: BoardMemberMinAggregateInputType;
    _max?: BoardMemberMaxAggregateInputType;
};
export type GetBoardMemberAggregateType<T extends BoardMemberAggregateArgs> = {
    [P in keyof T & keyof AggregateBoardMember]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBoardMember[P]> : Prisma.GetScalarType<T[P], AggregateBoardMember[P]>;
};
export type BoardMemberGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardMemberWhereInput;
    orderBy?: Prisma.BoardMemberOrderByWithAggregationInput | Prisma.BoardMemberOrderByWithAggregationInput[];
    by: Prisma.BoardMemberScalarFieldEnum[] | Prisma.BoardMemberScalarFieldEnum;
    having?: Prisma.BoardMemberScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BoardMemberCountAggregateInputType | true;
    _min?: BoardMemberMinAggregateInputType;
    _max?: BoardMemberMaxAggregateInputType;
};
export type BoardMemberGroupByOutputType = {
    id: string;
    boardId: string;
    userId: string;
    role: $Enums.BoardRole;
    _count: BoardMemberCountAggregateOutputType | null;
    _min: BoardMemberMinAggregateOutputType | null;
    _max: BoardMemberMaxAggregateOutputType | null;
};
type GetBoardMemberGroupByPayload<T extends BoardMemberGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BoardMemberGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BoardMemberGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BoardMemberGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BoardMemberGroupByOutputType[P]>;
}>>;
export type BoardMemberWhereInput = {
    AND?: Prisma.BoardMemberWhereInput | Prisma.BoardMemberWhereInput[];
    OR?: Prisma.BoardMemberWhereInput[];
    NOT?: Prisma.BoardMemberWhereInput | Prisma.BoardMemberWhereInput[];
    id?: Prisma.StringFilter<"BoardMember"> | string;
    boardId?: Prisma.StringFilter<"BoardMember"> | string;
    userId?: Prisma.StringFilter<"BoardMember"> | string;
    role?: Prisma.EnumBoardRoleFilter<"BoardMember"> | $Enums.BoardRole;
    board?: Prisma.XOR<Prisma.BoardScalarRelationFilter, Prisma.BoardWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type BoardMemberOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    board?: Prisma.BoardOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type BoardMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    boardId_userId?: Prisma.BoardMemberBoardIdUserIdCompoundUniqueInput;
    AND?: Prisma.BoardMemberWhereInput | Prisma.BoardMemberWhereInput[];
    OR?: Prisma.BoardMemberWhereInput[];
    NOT?: Prisma.BoardMemberWhereInput | Prisma.BoardMemberWhereInput[];
    boardId?: Prisma.StringFilter<"BoardMember"> | string;
    userId?: Prisma.StringFilter<"BoardMember"> | string;
    role?: Prisma.EnumBoardRoleFilter<"BoardMember"> | $Enums.BoardRole;
    board?: Prisma.XOR<Prisma.BoardScalarRelationFilter, Prisma.BoardWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "boardId_userId">;
export type BoardMemberOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    _count?: Prisma.BoardMemberCountOrderByAggregateInput;
    _max?: Prisma.BoardMemberMaxOrderByAggregateInput;
    _min?: Prisma.BoardMemberMinOrderByAggregateInput;
};
export type BoardMemberScalarWhereWithAggregatesInput = {
    AND?: Prisma.BoardMemberScalarWhereWithAggregatesInput | Prisma.BoardMemberScalarWhereWithAggregatesInput[];
    OR?: Prisma.BoardMemberScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BoardMemberScalarWhereWithAggregatesInput | Prisma.BoardMemberScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"BoardMember"> | string;
    boardId?: Prisma.StringWithAggregatesFilter<"BoardMember"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"BoardMember"> | string;
    role?: Prisma.EnumBoardRoleWithAggregatesFilter<"BoardMember"> | $Enums.BoardRole;
};
export type BoardMemberCreateInput = {
    id?: string;
    role?: $Enums.BoardRole;
    board: Prisma.BoardCreateNestedOneWithoutMembersInput;
    user: Prisma.UserCreateNestedOneWithoutBoardMembersInput;
};
export type BoardMemberUncheckedCreateInput = {
    id?: string;
    boardId: string;
    userId: string;
    role?: $Enums.BoardRole;
};
export type BoardMemberUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardRoleFieldUpdateOperationsInput | $Enums.BoardRole;
    board?: Prisma.BoardUpdateOneRequiredWithoutMembersNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutBoardMembersNestedInput;
};
export type BoardMemberUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardRoleFieldUpdateOperationsInput | $Enums.BoardRole;
};
export type BoardMemberCreateManyInput = {
    id?: string;
    boardId: string;
    userId: string;
    role?: $Enums.BoardRole;
};
export type BoardMemberUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardRoleFieldUpdateOperationsInput | $Enums.BoardRole;
};
export type BoardMemberUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardRoleFieldUpdateOperationsInput | $Enums.BoardRole;
};
export type BoardMemberListRelationFilter = {
    every?: Prisma.BoardMemberWhereInput;
    some?: Prisma.BoardMemberWhereInput;
    none?: Prisma.BoardMemberWhereInput;
};
export type BoardMemberOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BoardMemberBoardIdUserIdCompoundUniqueInput = {
    boardId: string;
    userId: string;
};
export type BoardMemberCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
};
export type BoardMemberMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
};
export type BoardMemberMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
};
export type BoardMemberCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.BoardMemberCreateWithoutUserInput, Prisma.BoardMemberUncheckedCreateWithoutUserInput> | Prisma.BoardMemberCreateWithoutUserInput[] | Prisma.BoardMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.BoardMemberCreateOrConnectWithoutUserInput | Prisma.BoardMemberCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.BoardMemberCreateManyUserInputEnvelope;
    connect?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
};
export type BoardMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.BoardMemberCreateWithoutUserInput, Prisma.BoardMemberUncheckedCreateWithoutUserInput> | Prisma.BoardMemberCreateWithoutUserInput[] | Prisma.BoardMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.BoardMemberCreateOrConnectWithoutUserInput | Prisma.BoardMemberCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.BoardMemberCreateManyUserInputEnvelope;
    connect?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
};
export type BoardMemberUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.BoardMemberCreateWithoutUserInput, Prisma.BoardMemberUncheckedCreateWithoutUserInput> | Prisma.BoardMemberCreateWithoutUserInput[] | Prisma.BoardMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.BoardMemberCreateOrConnectWithoutUserInput | Prisma.BoardMemberCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.BoardMemberUpsertWithWhereUniqueWithoutUserInput | Prisma.BoardMemberUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.BoardMemberCreateManyUserInputEnvelope;
    set?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
    disconnect?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
    delete?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
    connect?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
    update?: Prisma.BoardMemberUpdateWithWhereUniqueWithoutUserInput | Prisma.BoardMemberUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.BoardMemberUpdateManyWithWhereWithoutUserInput | Prisma.BoardMemberUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.BoardMemberScalarWhereInput | Prisma.BoardMemberScalarWhereInput[];
};
export type BoardMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.BoardMemberCreateWithoutUserInput, Prisma.BoardMemberUncheckedCreateWithoutUserInput> | Prisma.BoardMemberCreateWithoutUserInput[] | Prisma.BoardMemberUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.BoardMemberCreateOrConnectWithoutUserInput | Prisma.BoardMemberCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.BoardMemberUpsertWithWhereUniqueWithoutUserInput | Prisma.BoardMemberUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.BoardMemberCreateManyUserInputEnvelope;
    set?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
    disconnect?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
    delete?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
    connect?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
    update?: Prisma.BoardMemberUpdateWithWhereUniqueWithoutUserInput | Prisma.BoardMemberUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.BoardMemberUpdateManyWithWhereWithoutUserInput | Prisma.BoardMemberUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.BoardMemberScalarWhereInput | Prisma.BoardMemberScalarWhereInput[];
};
export type BoardMemberCreateNestedManyWithoutBoardInput = {
    create?: Prisma.XOR<Prisma.BoardMemberCreateWithoutBoardInput, Prisma.BoardMemberUncheckedCreateWithoutBoardInput> | Prisma.BoardMemberCreateWithoutBoardInput[] | Prisma.BoardMemberUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.BoardMemberCreateOrConnectWithoutBoardInput | Prisma.BoardMemberCreateOrConnectWithoutBoardInput[];
    createMany?: Prisma.BoardMemberCreateManyBoardInputEnvelope;
    connect?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
};
export type BoardMemberUncheckedCreateNestedManyWithoutBoardInput = {
    create?: Prisma.XOR<Prisma.BoardMemberCreateWithoutBoardInput, Prisma.BoardMemberUncheckedCreateWithoutBoardInput> | Prisma.BoardMemberCreateWithoutBoardInput[] | Prisma.BoardMemberUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.BoardMemberCreateOrConnectWithoutBoardInput | Prisma.BoardMemberCreateOrConnectWithoutBoardInput[];
    createMany?: Prisma.BoardMemberCreateManyBoardInputEnvelope;
    connect?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
};
export type BoardMemberUpdateManyWithoutBoardNestedInput = {
    create?: Prisma.XOR<Prisma.BoardMemberCreateWithoutBoardInput, Prisma.BoardMemberUncheckedCreateWithoutBoardInput> | Prisma.BoardMemberCreateWithoutBoardInput[] | Prisma.BoardMemberUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.BoardMemberCreateOrConnectWithoutBoardInput | Prisma.BoardMemberCreateOrConnectWithoutBoardInput[];
    upsert?: Prisma.BoardMemberUpsertWithWhereUniqueWithoutBoardInput | Prisma.BoardMemberUpsertWithWhereUniqueWithoutBoardInput[];
    createMany?: Prisma.BoardMemberCreateManyBoardInputEnvelope;
    set?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
    disconnect?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
    delete?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
    connect?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
    update?: Prisma.BoardMemberUpdateWithWhereUniqueWithoutBoardInput | Prisma.BoardMemberUpdateWithWhereUniqueWithoutBoardInput[];
    updateMany?: Prisma.BoardMemberUpdateManyWithWhereWithoutBoardInput | Prisma.BoardMemberUpdateManyWithWhereWithoutBoardInput[];
    deleteMany?: Prisma.BoardMemberScalarWhereInput | Prisma.BoardMemberScalarWhereInput[];
};
export type BoardMemberUncheckedUpdateManyWithoutBoardNestedInput = {
    create?: Prisma.XOR<Prisma.BoardMemberCreateWithoutBoardInput, Prisma.BoardMemberUncheckedCreateWithoutBoardInput> | Prisma.BoardMemberCreateWithoutBoardInput[] | Prisma.BoardMemberUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.BoardMemberCreateOrConnectWithoutBoardInput | Prisma.BoardMemberCreateOrConnectWithoutBoardInput[];
    upsert?: Prisma.BoardMemberUpsertWithWhereUniqueWithoutBoardInput | Prisma.BoardMemberUpsertWithWhereUniqueWithoutBoardInput[];
    createMany?: Prisma.BoardMemberCreateManyBoardInputEnvelope;
    set?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
    disconnect?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
    delete?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
    connect?: Prisma.BoardMemberWhereUniqueInput | Prisma.BoardMemberWhereUniqueInput[];
    update?: Prisma.BoardMemberUpdateWithWhereUniqueWithoutBoardInput | Prisma.BoardMemberUpdateWithWhereUniqueWithoutBoardInput[];
    updateMany?: Prisma.BoardMemberUpdateManyWithWhereWithoutBoardInput | Prisma.BoardMemberUpdateManyWithWhereWithoutBoardInput[];
    deleteMany?: Prisma.BoardMemberScalarWhereInput | Prisma.BoardMemberScalarWhereInput[];
};
export type EnumBoardRoleFieldUpdateOperationsInput = {
    set?: $Enums.BoardRole;
};
export type BoardMemberCreateWithoutUserInput = {
    id?: string;
    role?: $Enums.BoardRole;
    board: Prisma.BoardCreateNestedOneWithoutMembersInput;
};
export type BoardMemberUncheckedCreateWithoutUserInput = {
    id?: string;
    boardId: string;
    role?: $Enums.BoardRole;
};
export type BoardMemberCreateOrConnectWithoutUserInput = {
    where: Prisma.BoardMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardMemberCreateWithoutUserInput, Prisma.BoardMemberUncheckedCreateWithoutUserInput>;
};
export type BoardMemberCreateManyUserInputEnvelope = {
    data: Prisma.BoardMemberCreateManyUserInput | Prisma.BoardMemberCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type BoardMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.BoardMemberWhereUniqueInput;
    update: Prisma.XOR<Prisma.BoardMemberUpdateWithoutUserInput, Prisma.BoardMemberUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.BoardMemberCreateWithoutUserInput, Prisma.BoardMemberUncheckedCreateWithoutUserInput>;
};
export type BoardMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.BoardMemberWhereUniqueInput;
    data: Prisma.XOR<Prisma.BoardMemberUpdateWithoutUserInput, Prisma.BoardMemberUncheckedUpdateWithoutUserInput>;
};
export type BoardMemberUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.BoardMemberScalarWhereInput;
    data: Prisma.XOR<Prisma.BoardMemberUpdateManyMutationInput, Prisma.BoardMemberUncheckedUpdateManyWithoutUserInput>;
};
export type BoardMemberScalarWhereInput = {
    AND?: Prisma.BoardMemberScalarWhereInput | Prisma.BoardMemberScalarWhereInput[];
    OR?: Prisma.BoardMemberScalarWhereInput[];
    NOT?: Prisma.BoardMemberScalarWhereInput | Prisma.BoardMemberScalarWhereInput[];
    id?: Prisma.StringFilter<"BoardMember"> | string;
    boardId?: Prisma.StringFilter<"BoardMember"> | string;
    userId?: Prisma.StringFilter<"BoardMember"> | string;
    role?: Prisma.EnumBoardRoleFilter<"BoardMember"> | $Enums.BoardRole;
};
export type BoardMemberCreateWithoutBoardInput = {
    id?: string;
    role?: $Enums.BoardRole;
    user: Prisma.UserCreateNestedOneWithoutBoardMembersInput;
};
export type BoardMemberUncheckedCreateWithoutBoardInput = {
    id?: string;
    userId: string;
    role?: $Enums.BoardRole;
};
export type BoardMemberCreateOrConnectWithoutBoardInput = {
    where: Prisma.BoardMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardMemberCreateWithoutBoardInput, Prisma.BoardMemberUncheckedCreateWithoutBoardInput>;
};
export type BoardMemberCreateManyBoardInputEnvelope = {
    data: Prisma.BoardMemberCreateManyBoardInput | Prisma.BoardMemberCreateManyBoardInput[];
    skipDuplicates?: boolean;
};
export type BoardMemberUpsertWithWhereUniqueWithoutBoardInput = {
    where: Prisma.BoardMemberWhereUniqueInput;
    update: Prisma.XOR<Prisma.BoardMemberUpdateWithoutBoardInput, Prisma.BoardMemberUncheckedUpdateWithoutBoardInput>;
    create: Prisma.XOR<Prisma.BoardMemberCreateWithoutBoardInput, Prisma.BoardMemberUncheckedCreateWithoutBoardInput>;
};
export type BoardMemberUpdateWithWhereUniqueWithoutBoardInput = {
    where: Prisma.BoardMemberWhereUniqueInput;
    data: Prisma.XOR<Prisma.BoardMemberUpdateWithoutBoardInput, Prisma.BoardMemberUncheckedUpdateWithoutBoardInput>;
};
export type BoardMemberUpdateManyWithWhereWithoutBoardInput = {
    where: Prisma.BoardMemberScalarWhereInput;
    data: Prisma.XOR<Prisma.BoardMemberUpdateManyMutationInput, Prisma.BoardMemberUncheckedUpdateManyWithoutBoardInput>;
};
export type BoardMemberCreateManyUserInput = {
    id?: string;
    boardId: string;
    role?: $Enums.BoardRole;
};
export type BoardMemberUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardRoleFieldUpdateOperationsInput | $Enums.BoardRole;
    board?: Prisma.BoardUpdateOneRequiredWithoutMembersNestedInput;
};
export type BoardMemberUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardRoleFieldUpdateOperationsInput | $Enums.BoardRole;
};
export type BoardMemberUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardRoleFieldUpdateOperationsInput | $Enums.BoardRole;
};
export type BoardMemberCreateManyBoardInput = {
    id?: string;
    userId: string;
    role?: $Enums.BoardRole;
};
export type BoardMemberUpdateWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardRoleFieldUpdateOperationsInput | $Enums.BoardRole;
    user?: Prisma.UserUpdateOneRequiredWithoutBoardMembersNestedInput;
};
export type BoardMemberUncheckedUpdateWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardRoleFieldUpdateOperationsInput | $Enums.BoardRole;
};
export type BoardMemberUncheckedUpdateManyWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumBoardRoleFieldUpdateOperationsInput | $Enums.BoardRole;
};
export type BoardMemberSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    boardId?: boolean;
    userId?: boolean;
    role?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["boardMember"]>;
export type BoardMemberSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    boardId?: boolean;
    userId?: boolean;
    role?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["boardMember"]>;
export type BoardMemberSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    boardId?: boolean;
    userId?: boolean;
    role?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["boardMember"]>;
export type BoardMemberSelectScalar = {
    id?: boolean;
    boardId?: boolean;
    userId?: boolean;
    role?: boolean;
};
export type BoardMemberOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "boardId" | "userId" | "role", ExtArgs["result"]["boardMember"]>;
export type BoardMemberInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type BoardMemberIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type BoardMemberIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $BoardMemberPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BoardMember";
    objects: {
        board: Prisma.$BoardPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        boardId: string;
        userId: string;
        role: $Enums.BoardRole;
    }, ExtArgs["result"]["boardMember"]>;
    composites: {};
};
export type BoardMemberGetPayload<S extends boolean | null | undefined | BoardMemberDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BoardMemberPayload, S>;
export type BoardMemberCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BoardMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BoardMemberCountAggregateInputType | true;
};
export interface BoardMemberDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BoardMember'];
        meta: {
            name: 'BoardMember';
        };
    };
    findUnique<T extends BoardMemberFindUniqueArgs>(args: Prisma.SelectSubset<T, BoardMemberFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BoardMemberClient<runtime.Types.Result.GetResult<Prisma.$BoardMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BoardMemberFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BoardMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BoardMemberClient<runtime.Types.Result.GetResult<Prisma.$BoardMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BoardMemberFindFirstArgs>(args?: Prisma.SelectSubset<T, BoardMemberFindFirstArgs<ExtArgs>>): Prisma.Prisma__BoardMemberClient<runtime.Types.Result.GetResult<Prisma.$BoardMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BoardMemberFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BoardMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BoardMemberClient<runtime.Types.Result.GetResult<Prisma.$BoardMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BoardMemberFindManyArgs>(args?: Prisma.SelectSubset<T, BoardMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BoardMemberCreateArgs>(args: Prisma.SelectSubset<T, BoardMemberCreateArgs<ExtArgs>>): Prisma.Prisma__BoardMemberClient<runtime.Types.Result.GetResult<Prisma.$BoardMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BoardMemberCreateManyArgs>(args?: Prisma.SelectSubset<T, BoardMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BoardMemberCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BoardMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BoardMemberDeleteArgs>(args: Prisma.SelectSubset<T, BoardMemberDeleteArgs<ExtArgs>>): Prisma.Prisma__BoardMemberClient<runtime.Types.Result.GetResult<Prisma.$BoardMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BoardMemberUpdateArgs>(args: Prisma.SelectSubset<T, BoardMemberUpdateArgs<ExtArgs>>): Prisma.Prisma__BoardMemberClient<runtime.Types.Result.GetResult<Prisma.$BoardMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BoardMemberDeleteManyArgs>(args?: Prisma.SelectSubset<T, BoardMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BoardMemberUpdateManyArgs>(args: Prisma.SelectSubset<T, BoardMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BoardMemberUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BoardMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BoardMemberUpsertArgs>(args: Prisma.SelectSubset<T, BoardMemberUpsertArgs<ExtArgs>>): Prisma.Prisma__BoardMemberClient<runtime.Types.Result.GetResult<Prisma.$BoardMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BoardMemberCountArgs>(args?: Prisma.Subset<T, BoardMemberCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BoardMemberCountAggregateOutputType> : number>;
    aggregate<T extends BoardMemberAggregateArgs>(args: Prisma.Subset<T, BoardMemberAggregateArgs>): Prisma.PrismaPromise<GetBoardMemberAggregateType<T>>;
    groupBy<T extends BoardMemberGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BoardMemberGroupByArgs['orderBy'];
    } : {
        orderBy?: BoardMemberGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BoardMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBoardMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BoardMemberFieldRefs;
}
export interface Prisma__BoardMemberClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    board<T extends Prisma.BoardDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BoardDefaultArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BoardMemberFieldRefs {
    readonly id: Prisma.FieldRef<"BoardMember", 'String'>;
    readonly boardId: Prisma.FieldRef<"BoardMember", 'String'>;
    readonly userId: Prisma.FieldRef<"BoardMember", 'String'>;
    readonly role: Prisma.FieldRef<"BoardMember", 'BoardRole'>;
}
export type BoardMemberFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardMemberSelect<ExtArgs> | null;
    omit?: Prisma.BoardMemberOmit<ExtArgs> | null;
    include?: Prisma.BoardMemberInclude<ExtArgs> | null;
    where: Prisma.BoardMemberWhereUniqueInput;
};
export type BoardMemberFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardMemberSelect<ExtArgs> | null;
    omit?: Prisma.BoardMemberOmit<ExtArgs> | null;
    include?: Prisma.BoardMemberInclude<ExtArgs> | null;
    where: Prisma.BoardMemberWhereUniqueInput;
};
export type BoardMemberFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardMemberFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardMemberFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BoardMemberCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardMemberSelect<ExtArgs> | null;
    omit?: Prisma.BoardMemberOmit<ExtArgs> | null;
    include?: Prisma.BoardMemberInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardMemberCreateInput, Prisma.BoardMemberUncheckedCreateInput>;
};
export type BoardMemberCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BoardMemberCreateManyInput | Prisma.BoardMemberCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BoardMemberCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardMemberSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BoardMemberOmit<ExtArgs> | null;
    data: Prisma.BoardMemberCreateManyInput | Prisma.BoardMemberCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BoardMemberIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BoardMemberUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardMemberSelect<ExtArgs> | null;
    omit?: Prisma.BoardMemberOmit<ExtArgs> | null;
    include?: Prisma.BoardMemberInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardMemberUpdateInput, Prisma.BoardMemberUncheckedUpdateInput>;
    where: Prisma.BoardMemberWhereUniqueInput;
};
export type BoardMemberUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BoardMemberUpdateManyMutationInput, Prisma.BoardMemberUncheckedUpdateManyInput>;
    where?: Prisma.BoardMemberWhereInput;
    limit?: number;
};
export type BoardMemberUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardMemberSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BoardMemberOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardMemberUpdateManyMutationInput, Prisma.BoardMemberUncheckedUpdateManyInput>;
    where?: Prisma.BoardMemberWhereInput;
    limit?: number;
    include?: Prisma.BoardMemberIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BoardMemberUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardMemberSelect<ExtArgs> | null;
    omit?: Prisma.BoardMemberOmit<ExtArgs> | null;
    include?: Prisma.BoardMemberInclude<ExtArgs> | null;
    where: Prisma.BoardMemberWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardMemberCreateInput, Prisma.BoardMemberUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BoardMemberUpdateInput, Prisma.BoardMemberUncheckedUpdateInput>;
};
export type BoardMemberDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardMemberSelect<ExtArgs> | null;
    omit?: Prisma.BoardMemberOmit<ExtArgs> | null;
    include?: Prisma.BoardMemberInclude<ExtArgs> | null;
    where: Prisma.BoardMemberWhereUniqueInput;
};
export type BoardMemberDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardMemberWhereInput;
    limit?: number;
};
export type BoardMemberDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardMemberSelect<ExtArgs> | null;
    omit?: Prisma.BoardMemberOmit<ExtArgs> | null;
    include?: Prisma.BoardMemberInclude<ExtArgs> | null;
};
export {};
