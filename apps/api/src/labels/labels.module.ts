import { Module } from "@nestjs/common";
import { LabelsController } from "./labels.controller";
import { LabelsService } from "./labels.service";
import { PrismaService } from "../prisma.service";

import { ActivitiesModule } from "../activities/activities.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [ActivitiesModule, NotificationsModule],
  controllers: [LabelsController],
  providers: [LabelsService, PrismaService],
  exports: [LabelsService],
})
export class LabelsModule { }
