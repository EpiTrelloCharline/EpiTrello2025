import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { BoardsService } from './boards.service';

import { CreateBoardDto } from './dto/create-board.dto';

@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardsController {
  constructor(private svc: BoardsService) {}

  @Get()
  list(@Query('workspaceId') workspaceId: string, @Request() req: any) {
    return this.svc.listInWorkspace(req.user.id, workspaceId);
  }

  @Post()
  create(@Body() dto: CreateBoardDto, @Request() req: any) {
    return this.svc.create(req.user.id, dto);
  }

  @Get(':id')
  one(@Param('id') id: string, @Request() req: any) {
    return this.svc.getOne(req.user.id, id);
  }
}

