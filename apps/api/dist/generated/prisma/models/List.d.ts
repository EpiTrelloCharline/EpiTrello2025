import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace";
export type ListModel = runtime.Types.Result.DefaultSelection<Prisma.$ListPayload>;
export type AggregateList = {
    _count: ListCountAggregateOutputType | null;
    _avg: ListAvgAggregateOutputType | null;
    _sum: ListSumAggregateOutputType | null;
    _min: ListMinAggregateOutputType | null;
    _max: ListMaxAggregateOutputType | null;
};
export type ListAvgAggregateOutputType = {
    position: runtime.Decimal | null;
};
export type ListSumAggregateOutputType = {
    position: runtime.Decimal | null;
};
export type ListMinAggregateOutputType = {
    id: string | null;
    boardId: string | null;
    title: string | null;
    position: runtime.Decimal | null;
    isArchived: boolean | null;
};
export type ListMaxAggregateOutputType = {
    id: string | null;
    boardId: string | null;
    title: string | null;
    position: runtime.Decimal | null;
    isArchived: boolean | null;
};
export type ListCountAggregateOutputType = {
    id: number;
    boardId: number;
    title: number;
    position: number;
    isArchived: number;
    _all: number;
};
export type ListAvgAggregateInputType = {
    position?: true;
};
export type ListSumAggregateInputType = {
    position?: true;
};
export type ListMinAggregateInputType = {
    id?: true;
    boardId?: true;
    title?: true;
    position?: true;
    isArchived?: true;
};
export type ListMaxAggregateInputType = {
    id?: true;
    boardId?: true;
    title?: true;
    position?: true;
    isArchived?: true;
};
export type ListCountAggregateInputType = {
    id?: true;
    boardId?: true;
    title?: true;
    position?: true;
    isArchived?: true;
    _all?: true;
};
export type ListAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListWhereInput;
    orderBy?: Prisma.ListOrderByWithRelationInput | Prisma.ListOrderByWithRelationInput[];
    cursor?: Prisma.ListWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ListCountAggregateInputType;
    _avg?: ListAvgAggregateInputType;
    _sum?: ListSumAggregateInputType;
    _min?: ListMinAggregateInputType;
    _max?: ListMaxAggregateInputType;
};
export type GetListAggregateType<T extends ListAggregateArgs> = {
    [P in keyof T & keyof AggregateList]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateList[P]> : Prisma.GetScalarType<T[P], AggregateList[P]>;
};
export type ListGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListWhereInput;
    orderBy?: Prisma.ListOrderByWithAggregationInput | Prisma.ListOrderByWithAggregationInput[];
    by: Prisma.ListScalarFieldEnum[] | Prisma.ListScalarFieldEnum;
    having?: Prisma.ListScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ListCountAggregateInputType | true;
    _avg?: ListAvgAggregateInputType;
    _sum?: ListSumAggregateInputType;
    _min?: ListMinAggregateInputType;
    _max?: ListMaxAggregateInputType;
};
export type ListGroupByOutputType = {
    id: string;
    boardId: string;
    title: string;
    position: runtime.Decimal;
    isArchived: boolean;
    _count: ListCountAggregateOutputType | null;
    _avg: ListAvgAggregateOutputType | null;
    _sum: ListSumAggregateOutputType | null;
    _min: ListMinAggregateOutputType | null;
    _max: ListMaxAggregateOutputType | null;
};
type GetListGroupByPayload<T extends ListGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ListGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ListGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ListGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ListGroupByOutputType[P]>;
}>>;
export type ListWhereInput = {
    AND?: Prisma.ListWhereInput | Prisma.ListWhereInput[];
    OR?: Prisma.ListWhereInput[];
    NOT?: Prisma.ListWhereInput | Prisma.ListWhereInput[];
    id?: Prisma.StringFilter<"List"> | string;
    boardId?: Prisma.StringFilter<"List"> | string;
    title?: Prisma.StringFilter<"List"> | string;
    position?: Prisma.DecimalFilter<"List"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: Prisma.BoolFilter<"List"> | boolean;
    board?: Prisma.XOR<Prisma.BoardScalarRelationFilter, Prisma.BoardWhereInput>;
};
export type ListOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    board?: Prisma.BoardOrderByWithRelationInput;
};
export type ListWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ListWhereInput | Prisma.ListWhereInput[];
    OR?: Prisma.ListWhereInput[];
    NOT?: Prisma.ListWhereInput | Prisma.ListWhereInput[];
    boardId?: Prisma.StringFilter<"List"> | string;
    title?: Prisma.StringFilter<"List"> | string;
    position?: Prisma.DecimalFilter<"List"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: Prisma.BoolFilter<"List"> | boolean;
    board?: Prisma.XOR<Prisma.BoardScalarRelationFilter, Prisma.BoardWhereInput>;
}, "id">;
export type ListOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    _count?: Prisma.ListCountOrderByAggregateInput;
    _avg?: Prisma.ListAvgOrderByAggregateInput;
    _max?: Prisma.ListMaxOrderByAggregateInput;
    _min?: Prisma.ListMinOrderByAggregateInput;
    _sum?: Prisma.ListSumOrderByAggregateInput;
};
export type ListScalarWhereWithAggregatesInput = {
    AND?: Prisma.ListScalarWhereWithAggregatesInput | Prisma.ListScalarWhereWithAggregatesInput[];
    OR?: Prisma.ListScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ListScalarWhereWithAggregatesInput | Prisma.ListScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"List"> | string;
    boardId?: Prisma.StringWithAggregatesFilter<"List"> | string;
    title?: Prisma.StringWithAggregatesFilter<"List"> | string;
    position?: Prisma.DecimalWithAggregatesFilter<"List"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: Prisma.BoolWithAggregatesFilter<"List"> | boolean;
};
export type ListCreateInput = {
    id?: string;
    title: string;
    position?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: boolean;
    board: Prisma.BoardCreateNestedOneWithoutListsInput;
};
export type ListUncheckedCreateInput = {
    id?: string;
    boardId: string;
    title: string;
    position?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: boolean;
};
export type ListUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    board?: Prisma.BoardUpdateOneRequiredWithoutListsNestedInput;
};
export type ListUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ListCreateManyInput = {
    id?: string;
    boardId: string;
    title: string;
    position?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: boolean;
};
export type ListUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ListUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    boardId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ListListRelationFilter = {
    every?: Prisma.ListWhereInput;
    some?: Prisma.ListWhereInput;
    none?: Prisma.ListWhereInput;
};
export type ListOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ListCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
};
export type ListAvgOrderByAggregateInput = {
    position?: Prisma.SortOrder;
};
export type ListMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
};
export type ListMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
};
export type ListSumOrderByAggregateInput = {
    position?: Prisma.SortOrder;
};
export type ListCreateNestedManyWithoutBoardInput = {
    create?: Prisma.XOR<Prisma.ListCreateWithoutBoardInput, Prisma.ListUncheckedCreateWithoutBoardInput> | Prisma.ListCreateWithoutBoardInput[] | Prisma.ListUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.ListCreateOrConnectWithoutBoardInput | Prisma.ListCreateOrConnectWithoutBoardInput[];
    createMany?: Prisma.ListCreateManyBoardInputEnvelope;
    connect?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
};
export type ListUncheckedCreateNestedManyWithoutBoardInput = {
    create?: Prisma.XOR<Prisma.ListCreateWithoutBoardInput, Prisma.ListUncheckedCreateWithoutBoardInput> | Prisma.ListCreateWithoutBoardInput[] | Prisma.ListUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.ListCreateOrConnectWithoutBoardInput | Prisma.ListCreateOrConnectWithoutBoardInput[];
    createMany?: Prisma.ListCreateManyBoardInputEnvelope;
    connect?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
};
export type ListUpdateManyWithoutBoardNestedInput = {
    create?: Prisma.XOR<Prisma.ListCreateWithoutBoardInput, Prisma.ListUncheckedCreateWithoutBoardInput> | Prisma.ListCreateWithoutBoardInput[] | Prisma.ListUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.ListCreateOrConnectWithoutBoardInput | Prisma.ListCreateOrConnectWithoutBoardInput[];
    upsert?: Prisma.ListUpsertWithWhereUniqueWithoutBoardInput | Prisma.ListUpsertWithWhereUniqueWithoutBoardInput[];
    createMany?: Prisma.ListCreateManyBoardInputEnvelope;
    set?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
    disconnect?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
    delete?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
    connect?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
    update?: Prisma.ListUpdateWithWhereUniqueWithoutBoardInput | Prisma.ListUpdateWithWhereUniqueWithoutBoardInput[];
    updateMany?: Prisma.ListUpdateManyWithWhereWithoutBoardInput | Prisma.ListUpdateManyWithWhereWithoutBoardInput[];
    deleteMany?: Prisma.ListScalarWhereInput | Prisma.ListScalarWhereInput[];
};
export type ListUncheckedUpdateManyWithoutBoardNestedInput = {
    create?: Prisma.XOR<Prisma.ListCreateWithoutBoardInput, Prisma.ListUncheckedCreateWithoutBoardInput> | Prisma.ListCreateWithoutBoardInput[] | Prisma.ListUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.ListCreateOrConnectWithoutBoardInput | Prisma.ListCreateOrConnectWithoutBoardInput[];
    upsert?: Prisma.ListUpsertWithWhereUniqueWithoutBoardInput | Prisma.ListUpsertWithWhereUniqueWithoutBoardInput[];
    createMany?: Prisma.ListCreateManyBoardInputEnvelope;
    set?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
    disconnect?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
    delete?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
    connect?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
    update?: Prisma.ListUpdateWithWhereUniqueWithoutBoardInput | Prisma.ListUpdateWithWhereUniqueWithoutBoardInput[];
    updateMany?: Prisma.ListUpdateManyWithWhereWithoutBoardInput | Prisma.ListUpdateManyWithWhereWithoutBoardInput[];
    deleteMany?: Prisma.ListScalarWhereInput | Prisma.ListScalarWhereInput[];
};
export type DecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type ListCreateWithoutBoardInput = {
    id?: string;
    title: string;
    position?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: boolean;
};
export type ListUncheckedCreateWithoutBoardInput = {
    id?: string;
    title: string;
    position?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: boolean;
};
export type ListCreateOrConnectWithoutBoardInput = {
    where: Prisma.ListWhereUniqueInput;
    create: Prisma.XOR<Prisma.ListCreateWithoutBoardInput, Prisma.ListUncheckedCreateWithoutBoardInput>;
};
export type ListCreateManyBoardInputEnvelope = {
    data: Prisma.ListCreateManyBoardInput | Prisma.ListCreateManyBoardInput[];
    skipDuplicates?: boolean;
};
export type ListUpsertWithWhereUniqueWithoutBoardInput = {
    where: Prisma.ListWhereUniqueInput;
    update: Prisma.XOR<Prisma.ListUpdateWithoutBoardInput, Prisma.ListUncheckedUpdateWithoutBoardInput>;
    create: Prisma.XOR<Prisma.ListCreateWithoutBoardInput, Prisma.ListUncheckedCreateWithoutBoardInput>;
};
export type ListUpdateWithWhereUniqueWithoutBoardInput = {
    where: Prisma.ListWhereUniqueInput;
    data: Prisma.XOR<Prisma.ListUpdateWithoutBoardInput, Prisma.ListUncheckedUpdateWithoutBoardInput>;
};
export type ListUpdateManyWithWhereWithoutBoardInput = {
    where: Prisma.ListScalarWhereInput;
    data: Prisma.XOR<Prisma.ListUpdateManyMutationInput, Prisma.ListUncheckedUpdateManyWithoutBoardInput>;
};
export type ListScalarWhereInput = {
    AND?: Prisma.ListScalarWhereInput | Prisma.ListScalarWhereInput[];
    OR?: Prisma.ListScalarWhereInput[];
    NOT?: Prisma.ListScalarWhereInput | Prisma.ListScalarWhereInput[];
    id?: Prisma.StringFilter<"List"> | string;
    boardId?: Prisma.StringFilter<"List"> | string;
    title?: Prisma.StringFilter<"List"> | string;
    position?: Prisma.DecimalFilter<"List"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: Prisma.BoolFilter<"List"> | boolean;
};
export type ListCreateManyBoardInput = {
    id?: string;
    title: string;
    position?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: boolean;
};
export type ListUpdateWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ListUncheckedUpdateWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ListUncheckedUpdateManyWithoutBoardInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ListSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    boardId?: boolean;
    title?: boolean;
    position?: boolean;
    isArchived?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["list"]>;
export type ListSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    boardId?: boolean;
    title?: boolean;
    position?: boolean;
    isArchived?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["list"]>;
export type ListSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    boardId?: boolean;
    title?: boolean;
    position?: boolean;
    isArchived?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["list"]>;
export type ListSelectScalar = {
    id?: boolean;
    boardId?: boolean;
    title?: boolean;
    position?: boolean;
    isArchived?: boolean;
};
export type ListOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "boardId" | "title" | "position" | "isArchived", ExtArgs["result"]["list"]>;
export type ListInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
};
export type ListIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
};
export type ListIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
};
export type $ListPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "List";
    objects: {
        board: Prisma.$BoardPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        boardId: string;
        title: string;
        position: runtime.Decimal;
        isArchived: boolean;
    }, ExtArgs["result"]["list"]>;
    composites: {};
};
export type ListGetPayload<S extends boolean | null | undefined | ListDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ListPayload, S>;
export type ListCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ListFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ListCountAggregateInputType | true;
};
export interface ListDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['List'];
        meta: {
            name: 'List';
        };
    };
    findUnique<T extends ListFindUniqueArgs>(args: Prisma.SelectSubset<T, ListFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ListClient<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ListFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ListFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ListClient<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ListFindFirstArgs>(args?: Prisma.SelectSubset<T, ListFindFirstArgs<ExtArgs>>): Prisma.Prisma__ListClient<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ListFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ListFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ListClient<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ListFindManyArgs>(args?: Prisma.SelectSubset<T, ListFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ListCreateArgs>(args: Prisma.SelectSubset<T, ListCreateArgs<ExtArgs>>): Prisma.Prisma__ListClient<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ListCreateManyArgs>(args?: Prisma.SelectSubset<T, ListCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ListCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ListCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ListDeleteArgs>(args: Prisma.SelectSubset<T, ListDeleteArgs<ExtArgs>>): Prisma.Prisma__ListClient<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ListUpdateArgs>(args: Prisma.SelectSubset<T, ListUpdateArgs<ExtArgs>>): Prisma.Prisma__ListClient<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ListDeleteManyArgs>(args?: Prisma.SelectSubset<T, ListDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ListUpdateManyArgs>(args: Prisma.SelectSubset<T, ListUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ListUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ListUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ListUpsertArgs>(args: Prisma.SelectSubset<T, ListUpsertArgs<ExtArgs>>): Prisma.Prisma__ListClient<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ListCountArgs>(args?: Prisma.Subset<T, ListCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ListCountAggregateOutputType> : number>;
    aggregate<T extends ListAggregateArgs>(args: Prisma.Subset<T, ListAggregateArgs>): Prisma.PrismaPromise<GetListAggregateType<T>>;
    groupBy<T extends ListGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ListGroupByArgs['orderBy'];
    } : {
        orderBy?: ListGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ListGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetListGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ListFieldRefs;
}
export interface Prisma__ListClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    board<T extends Prisma.BoardDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BoardDefaultArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ListFieldRefs {
    readonly id: Prisma.FieldRef<"List", 'String'>;
    readonly boardId: Prisma.FieldRef<"List", 'String'>;
    readonly title: Prisma.FieldRef<"List", 'String'>;
    readonly position: Prisma.FieldRef<"List", 'Decimal'>;
    readonly isArchived: Prisma.FieldRef<"List", 'Boolean'>;
}
export type ListFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelect<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    include?: Prisma.ListInclude<ExtArgs> | null;
    where: Prisma.ListWhereUniqueInput;
};
export type ListFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelect<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    include?: Prisma.ListInclude<ExtArgs> | null;
    where: Prisma.ListWhereUniqueInput;
};
export type ListFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ListFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ListFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ListCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelect<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    include?: Prisma.ListInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListCreateInput, Prisma.ListUncheckedCreateInput>;
};
export type ListCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ListCreateManyInput | Prisma.ListCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ListCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    data: Prisma.ListCreateManyInput | Prisma.ListCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ListIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ListUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelect<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    include?: Prisma.ListInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListUpdateInput, Prisma.ListUncheckedUpdateInput>;
    where: Prisma.ListWhereUniqueInput;
};
export type ListUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ListUpdateManyMutationInput, Prisma.ListUncheckedUpdateManyInput>;
    where?: Prisma.ListWhereInput;
    limit?: number;
};
export type ListUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListUpdateManyMutationInput, Prisma.ListUncheckedUpdateManyInput>;
    where?: Prisma.ListWhereInput;
    limit?: number;
    include?: Prisma.ListIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ListUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelect<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    include?: Prisma.ListInclude<ExtArgs> | null;
    where: Prisma.ListWhereUniqueInput;
    create: Prisma.XOR<Prisma.ListCreateInput, Prisma.ListUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ListUpdateInput, Prisma.ListUncheckedUpdateInput>;
};
export type ListDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelect<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    include?: Prisma.ListInclude<ExtArgs> | null;
    where: Prisma.ListWhereUniqueInput;
};
export type ListDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListWhereInput;
    limit?: number;
};
export type ListDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelect<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    include?: Prisma.ListInclude<ExtArgs> | null;
};
export {};
