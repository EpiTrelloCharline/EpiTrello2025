import { PrismaService } from '../prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { MoveCardDto } from './dto/move-card.dto';
import { Decimal } from '@prisma/client/runtime/library';
export declare class CardsService {
    private prisma;
    constructor(prisma: PrismaService);
    private assertBoardMember;
    list(userId: string, listId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: Decimal;
        listId: string;
    }[]>;
    create(userId: string, dto: CreateCardDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: Decimal;
        listId: string;
    }>;
    move(userId: string, dto: MoveCardDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: Decimal;
        listId: string;
    }>;
}
