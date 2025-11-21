import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { ListsService } from './lists.service';

import { CreateListDto } from './dto/create-list.dto';

import { MoveListDto } from './dto/move-list.dto';

@UseGuards(JwtAuthGuard)
@Controller('lists')
export class ListsController {
  constructor(private svc: ListsService) {}

  @Get()
  list(@Query('boardId') boardId: string, @Request() req: any) {
    return this.svc.list(boardId, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateListDto, @Request() req: any) {
    return this.svc.create(req.user.id, dto.boardId, dto.title, dto.after);
  }

  @Post('move')
  move(@Body() dto: MoveListDto, @Request() req: any) {
    return this.svc.move(req.user.id, dto.listId, dto.boardId, dto.newPosition);
  }
}

