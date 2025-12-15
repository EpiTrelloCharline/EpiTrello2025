import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { BoardReadGuard } from "./guards/board-read.guard";
import { BoardAdminGuard } from "./guards/board-admin.guard";

import { BoardsService } from "./boards.service";

import { CreateBoardDto } from "./dto/create-board.dto";
import { InviteMemberDto } from "./dto/invite-member.dto";

import { ActivitiesService } from "../activities/activities.service";

@UseGuards(JwtAuthGuard)
@Controller("boards")
export class BoardsController {
  constructor(
    private svc: BoardsService,
    private activitiesService: ActivitiesService,
  ) { }

  @Get()
  list(@Query("workspaceId") workspaceId: string, @Request() req: any) {
    return this.svc.listInWorkspace(req.user.id, workspaceId);
  }

  @Post()
  create(@Body() dto: CreateBoardDto, @Request() req: any) {
    return this.svc.create(req.user.id, dto);
  }

  @UseGuards(BoardReadGuard)
  @Get(":id")
  one(@Param("id") id: string, @Request() req: any) {
    return this.svc.getOne(req.user.id, id);
  }

  @UseGuards(BoardReadGuard)
  @Get(":id/members")
  getMembers(@Param("id") id: string, @Request() req: any) {
    return this.svc.getMembers(req.user.id, id);
  }

  @UseGuards(BoardAdminGuard)
  @Post(":id/invite")
  inviteMember(
    @Param("id") id: string,
    @Body() dto: InviteMemberDto,
    @Request() req: any,
  ) {
    return this.svc.inviteMember(req.user.id, id, dto);
  }

  @UseGuards(BoardReadGuard)
  @Get(":id/activity")
  getActivity(@Param("id") id: string) {
    return this.activitiesService.getBoardActivities(id);
  }
}

