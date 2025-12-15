import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { LabelsService } from './labels.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { AssignLabelDto } from './dto/assign-label.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class LabelsController {
  constructor(private labelsService: LabelsService) { }

  // ==================== BOARD LABELS ROUTES ====================

  /**
   * GET /boards/:id/labels
   * Get all labels for a board
   */
  @Get('boards/:id/labels')
  getLabelsByBoard(@Param('id') boardId: string, @Request() req: any) {
    return this.labelsService.getLabelsByBoard(req.user.id, boardId);
  }

  /**
   * POST /boards/:id/labels
   * Create a new label on a board
   */
  @Post('boards/:id/labels')
  createLabel(
    @Param('id') boardId: string,
    @Body() dto: CreateLabelDto,
    @Request() req: any,
  ) {
    return this.labelsService.createLabel(req.user.id, boardId, dto);
  }

  // ==================== LABEL CRUD ROUTES ====================

  /**
   * PATCH /labels/:id
   * Update a label (name and/or color)
   */
  @Patch('labels/:id')
  updateLabel(
    @Param('id') labelId: string,
    @Body() dto: UpdateLabelDto,
    @Request() req: any,
  ) {
    return this.labelsService.updateLabel(req.user.id, labelId, dto);
  }

  /**
   * DELETE /labels/:id
   * Delete a label
   */
  @Delete('labels/:id')
  deleteLabel(@Param('id') labelId: string, @Request() req: any) {
    return this.labelsService.deleteLabel(req.user.id, labelId);
  }
  // ==================== CARD LABELS ROUTES ====================

  /**
   * POST /cards/:id/labels
   * Assign a label to a card
   */
  @Post('cards/:id/labels')
  assignLabelToCard(
    @Param('id') cardId: string,
    @Body() dto: AssignLabelDto,
    @Request() req: any,
  ) {
    return this.labelsService.assignLabelToCard(req.user.id, cardId, dto.labelId);
  }

  /**
   * DELETE /cards/:id/labels/:labelId
   * Remove a label from a card
   */
  @Delete('cards/:id/labels/:labelId')
  removeLabelFromCard(
    @Param('id') cardId: string,
    @Param('labelId') labelId: string,
    @Request() req: any,
  ) {
    return this.labelsService.removeLabelFromCard(req.user.id, cardId, labelId);
  }
}
