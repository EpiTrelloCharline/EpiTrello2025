import { PrismaService } from '../prisma.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
export declare class LabelsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createLabelDto: CreateLabelDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        color: string;
    }>;
    findByBoard(boardId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        color: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        color: string;
    }>;
    update(id: string, updateLabelDto: UpdateLabelDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        color: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        color: string;
    }>;
    assignToCard(cardId: string, labelId: string): Promise<{
        id: string;
        createdAt: Date;
        cardId: string;
        labelId: string;
    }>;
    unassignFromCard(cardId: string, labelId: string): Promise<{
        id: string;
        createdAt: Date;
        cardId: string;
        labelId: string;
    }>;
    getCardLabels(cardId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        color: string;
    }[]>;
}
