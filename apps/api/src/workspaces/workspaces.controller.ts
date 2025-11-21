// workspaces.controller.ts
import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { WorkspacesService } from './workspaces.service';

import { CreateWorkspaceDto } from './dto/create-workspace.dto';

import { InviteMemberDto } from './dto/invite-member.dto';

@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private svc: WorkspacesService) {}

  @Get()
  list(@Request() req: any) { return this.svc.listForUser(req.user.id); }

  @Post()
  create(@Request() req: any, @Body() dto: CreateWorkspaceDto) {
    return this.svc.create(req.user.id, dto);
  }

  @Get(':id')
  one(@Request() req: any, @Param('id') id: string) {
    return this.svc.getOne(req.user.id, id);
  }

  @Post(':id/invite')
  invite(@Request() req: any, @Param('id') id: string, @Body() dto: InviteMemberDto) {
    return this.svc.inviteByEmail(req.user.id, id, dto.email, dto.role as any);
  }
}

