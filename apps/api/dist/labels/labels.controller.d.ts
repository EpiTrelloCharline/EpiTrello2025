import { LabelsService } from './labels.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { AssignLabelDto } from './dto/assign-label.dto';
export declare class LabelsController {
    private labelsService;
    constructor(labelsService: LabelsService);
    getLabelsByBoard(boardId: string, req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        color: string;
    }[]>;
    createLabel(boardId: string, dto: CreateLabelDto, req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        color: string;
    }>;
    updateLabel(labelId: string, dto: UpdateLabelDto, req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        color: string;
    }>;
    deleteLabel(labelId: string, req: any): Promise<{
        message: string;
    }>;
    assignLabelToCard(cardId: string, dto: AssignLabelDto, req: any): Promise<{
        message: string;
    }>;
    removeLabelFromCard(cardId: string, labelId: string, req: any): Promise<{
        message: string;
    }>;
}
