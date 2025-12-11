import { PrismaService } from "../prisma.service";
import { CreateCardDto } from "./dto/create-card.dto";
import { MoveCardDto } from "./dto/move-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { ActivitiesService } from "../activities/activities.service";
export declare class CardsService {
    private prisma;
    private activitiesService;
    constructor(prisma: PrismaService, activitiesService: ActivitiesService);
    private assertBoardMember;
    private assertCardAccess;
    list(userId: string, listId: string): Promise<({
        members: {
            id: string;
            email: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        labels: ({
            label: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                boardId: string;
                color: string;
            };
        } & {
            id: string;
            createdAt: Date;
            cardId: string;
            labelId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        isArchived: boolean;
        listId: string;
    })[]>;
    create(userId: string, dto: CreateCardDto): Promise<{
        members: {
            id: string;
            email: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        labels: ({
            label: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                boardId: string;
                color: string;
            };
        } & {
            id: string;
            createdAt: Date;
            cardId: string;
            labelId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        isArchived: boolean;
        listId: string;
    }>;
    move(userId: string, dto: MoveCardDto): Promise<({
        list: {
            id: string;
            boardId: string;
            title: string;
            position: import("@prisma/client/runtime/library").Decimal;
            isArchived: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        isArchived: boolean;
        listId: string;
    }) | ({
        members: {
            id: string;
            email: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        labels: ({
            label: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                boardId: string;
                color: string;
            };
        } & {
            id: string;
            createdAt: Date;
            cardId: string;
            labelId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        isArchived: boolean;
        listId: string;
    })>;
    update(userId: string, cardId: string, dto: UpdateCardDto): Promise<{
        members: {
            id: string;
            email: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        labels: ({
            label: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                boardId: string;
                color: string;
            };
        } & {
            id: string;
            createdAt: Date;
            cardId: string;
            labelId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        isArchived: boolean;
        listId: string;
    }>;
    archive(userId: string, cardId: string): Promise<{
        members: {
            id: string;
            email: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        labels: ({
            label: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                boardId: string;
                color: string;
            };
        } & {
            id: string;
            createdAt: Date;
            cardId: string;
            labelId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        isArchived: boolean;
        listId: string;
    }>;
    duplicate(userId: string, cardId: string): Promise<{
        members: {
            id: string;
            email: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        labels: ({
            label: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                boardId: string;
                color: string;
            };
        } & {
            id: string;
            createdAt: Date;
            cardId: string;
            labelId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        isArchived: boolean;
        listId: string;
    }>;
}
