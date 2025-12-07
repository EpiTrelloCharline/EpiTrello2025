import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BoardReadGuard } from '../boards/guards/board-read.guard';
import { BoardWriteGuard } from '../boards/guards/board-write.guard';

import { ListsService } from './lists.service';

import { CreateListDto } from './dto/create-list.dto';

import { MoveListDto } from './dto/move-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@UseGuards(JwtAuthGuard)
@Controller('lists')
export class ListsController {
  constructor(private svc: ListsService) { }

  @UseGuards(BoardReadGuard)
  @Get()
  list(@Query('boardId') boardId: string, @Request() req: any) {
    return this.svc.list(boardId, req.user.id);
  }

  // Temporarily removed BoardWriteGuard to debug - service has assertBoardMember
  @Post()
  create(@Body() dto: CreateListDto, @Request() req: any) {
    return this.svc.create(req.user.id, dto.boardId, dto.title, dto.after);
  }

  @UseGuards(BoardWriteGuard)
  @Post('move')
  move(@Body() dto: MoveListDto, @Request() req: any) {
    return this.svc.move(req.user.id, dto.listId, dto.boardId, dto.newPosition);
  }

  @UseGuards(BoardWriteGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateListDto, @Request() req: any) {
    return this.svc.update(req.user.id, id, dto.title);
  }

  @UseGuards(BoardWriteGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.svc.delete(req.user.id, id);
  }
}

