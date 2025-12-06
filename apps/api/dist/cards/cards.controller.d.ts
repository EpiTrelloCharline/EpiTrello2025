import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { MoveCardDto } from './dto/move-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { LabelsService } from '../labels/labels.service';
import { AssignLabelDto } from '../labels/dto/assign-label.dto';
export declare class CardsController {
    private readonly cardsService;
    private readonly labelsService;
    constructor(cardsService: CardsService, labelsService: LabelsService);
    list(listId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        listId: string;
    }[]>;
    create(createCardDto: CreateCardDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        listId: string;
    }>;
    move(moveCardDto: MoveCardDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        listId: string;
    }>;
    update(id: string, updateCardDto: UpdateCardDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        listId: string;
    }>;
    archive(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        position: import("@prisma/client/runtime/library").Decimal;
        listId: string;
    }>;
    assignLabel(cardId: string, dto: AssignLabelDto, req: any): Promise<{
        message: string;
    }>;
    removeLabel(cardId: string, labelId: string, req: any): Promise<{
        message: string;
    }>;
}
