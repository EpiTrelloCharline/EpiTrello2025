import {
    Body,
    Controller,
    Delete,
    Param,
    Patch,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChecklistsService } from './checklists.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class ChecklistsController {
    constructor(private readonly checklistsService: ChecklistsService) { }

    /**
     * POST /cards/:id/checklists
     * Create a new checklist for a card
     */
    @Post('cards/:id/checklists')
    createChecklist(
        @Param('id') cardId: string,
        @Body() dto: CreateChecklistDto,
        @Request() req: any,
    ) {
        return this.checklistsService.createChecklist(req.user.id, cardId, dto);
    }

    /**
     * PATCH /checklists/:id
     * Update a checklist
     */
    @Patch('checklists/:id')
    updateChecklist(
        @Param('id') checklistId: string,
        @Body() dto: UpdateChecklistDto,
        @Request() req: any,
    ) {
        return this.checklistsService.updateChecklist(req.user.id, checklistId, dto);
    }

    /**
     * DELETE /checklists/:id
     * Delete a checklist
     */
    @Delete('checklists/:id')
    deleteChecklist(@Param('id') checklistId: string, @Request() req: any) {
        return this.checklistsService.deleteChecklist(req.user.id, checklistId);
    }

    /**
     * POST /checklists/:id/items
     * Create a new item in a checklist
     */
    @Post('checklists/:id/items')
    createChecklistItem(
        @Param('id') checklistId: string,
        @Body() dto: CreateChecklistItemDto,
        @Request() req: any,
    ) {
        return this.checklistsService.createChecklistItem(req.user.id, checklistId, dto);
    }

    /**
     * PATCH /checklist-items/:id
     * Update a checklist item
     */
    @Patch('checklist-items/:id')
    updateChecklistItem(
        @Param('id') itemId: string,
        @Body() dto: UpdateChecklistItemDto,
        @Request() req: any,
    ) {
        return this.checklistsService.updateChecklistItem(req.user.id, itemId, dto);
    }

    /**
     * DELETE /checklist-items/:id
     * Delete a checklist item
     */
    @Delete('checklist-items/:id')
    deleteChecklistItem(@Param('id') itemId: string, @Request() req: any) {
        return this.checklistsService.deleteChecklistItem(req.user.id, itemId);
    }
}
