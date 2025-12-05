import { PrismaService } from '../prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { MoveCardDto } from './dto/move-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Decimal } from '@prisma/client/runtime/library';
export declare class CardsService {
    private prisma;
    constructor(prisma: PrismaService);
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
        labels: {
            id: string;
            createdAt: Date;
            cardId: string;
            labelId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: Decimal;
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
        labels: {
            id: string;
            createdAt: Date;
            cardId: string;
            labelId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: Decimal;
        isArchived: boolean;
        listId: string;
    }>;
    move(userId: string, dto: MoveCardDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: Decimal;
        isArchived: boolean;
        listId: string;
    }>;
    update(userId: string, cardId: string, dto: UpdateCardDto): Promise<{
        members: {
            id: string;
            email: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        labels: {
            id: string;
            createdAt: Date;
            cardId: string;
            labelId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: Decimal;
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
        labels: {
            id: string;
            createdAt: Date;
            cardId: string;
            labelId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: Decimal;
        isArchived: boolean;
        listId: string;
    }>;
}
