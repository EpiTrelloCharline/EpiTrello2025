import { PrismaService } from "../prisma.service";
import { ActivitiesService } from "../activities/activities.service";
import { CreateLabelDto } from "./dto/create-label.dto";
import { UpdateLabelDto } from "./dto/update-label.dto";
export declare class LabelsService {
    private prisma;
    private activitiesService;
    constructor(prisma: PrismaService, activitiesService: ActivitiesService);
    assignLabelToCard(userId: string, cardId: string, labelId: string): Promise<{
        message: string;
    }>;
    private checkBoardMembership;
    getLabelsByBoard(userId: string, boardId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        color: string;
    }[]>;
    createLabel(userId: string, boardId: string, dto: CreateLabelDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        color: string;
    }>;
    updateLabel(userId: string, labelId: string, dto: UpdateLabelDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        color: string;
    }>;
    deleteLabel(userId: string, labelId: string): Promise<{
        message: string;
    }>;
    removeLabelFromCard(userId: string, cardId: string, labelId: string): Promise<{
        message: string;
    }>;
}
