import { Module } from "@nestjs/common";
import { CardsService } from "./cards.service";
import { CardsController } from "./cards.controller";
import { PrismaService } from "../prisma.service";
import { BoardsModule } from "../boards/boards.module";
import { LabelsModule } from "../labels/labels.module";
import { ActivitiesModule } from "../activities/activities.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [BoardsModule, LabelsModule, ActivitiesModule, NotificationsModule],
  controllers: [CardsController],
  providers: [CardsService, PrismaService],
})
export class CardsModule { }
