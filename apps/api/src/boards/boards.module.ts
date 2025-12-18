import { Module } from "@nestjs/common";
import { BoardsController } from "./boards.controller";
import { BoardsService } from "./boards.service";
import { PrismaService } from "../prisma.service";
import { ActivitiesModule } from "../activities/activities.module";
import { BoardPermissionsService } from "./board-permissions.service";
import { BoardReadGuard } from "./guards/board-read.guard";
import { BoardWriteGuard } from "./guards/board-write.guard";
import { BoardAdminGuard } from "./guards/board-admin.guard";

import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [ActivitiesModule, NotificationsModule],
  controllers: [BoardsController],
  providers: [
    BoardsService,
    PrismaService,
    BoardPermissionsService,
    BoardReadGuard,
    BoardWriteGuard,
    BoardAdminGuard,
  ],
  exports: [BoardPermissionsService, BoardReadGuard, BoardWriteGuard],
})
export class BoardsModule { }
