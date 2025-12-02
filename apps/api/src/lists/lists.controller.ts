import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BoardReadGuard } from '../boards/guards/board-read.guard';
import { BoardWriteGuard } from '../boards/guards/board-write.guard';

import { ListsService } from './lists.service';

import { CreateListDto } from './dto/create-list.dto';

import { MoveListDto } from './dto/move-list.dto';

@UseGuards(JwtAuthGuard)
@Controller('lists')
export class ListsController {
  constructor(private svc: ListsService) { }

  @UseGuards(BoardReadGuard)
  @Get()
  list(@Query('boardId') boardId: string, @Request() req: any) {
    return this.svc.list(boardId, req.user.id);
  }

  @UseGuards(BoardWriteGuard)
  @Post()
  create(@Body() dto: CreateListDto, @Request() req: any) {
    return this.svc.create(req.user.id, dto.boardId, dto.title, dto.after);
  }

  @UseGuards(BoardWriteGuard)
  @Post('move')
  move(@Body() dto: MoveListDto, @Request() req: any) {
    return this.svc.move(req.user.id, dto.listId, dto.boardId, dto.newPosition);
  }
}

