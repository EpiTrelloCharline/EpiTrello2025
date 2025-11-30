import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LabelsService } from './labels.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('labels')
@UseGuards(JwtAuthGuard)
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Post()
  create(@Body() createLabelDto: CreateLabelDto) {
    return this.labelsService.create(createLabelDto);
  }

  @Get()
  findByBoard(@Query('boardId') boardId: string) {
    return this.labelsService.findByBoard(boardId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labelsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLabelDto: UpdateLabelDto) {
    return this.labelsService.update(id, updateLabelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labelsService.remove(id);
  }

  @Post(':labelId/assign/:cardId')
  assignToCard(@Param('labelId') labelId: string, @Param('cardId') cardId: string) {
    return this.labelsService.assignToCard(cardId, labelId);
  }

  @Delete(':labelId/unassign/:cardId')
  unassignFromCard(@Param('labelId') labelId: string, @Param('cardId') cardId: string) {
    return this.labelsService.unassignFromCard(cardId, labelId);
  }

  @Get('card/:cardId')
  getCardLabels(@Param('cardId') cardId: string) {
    return this.labelsService.getCardLabels(cardId);
  }
}
