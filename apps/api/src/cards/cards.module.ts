import { Module } from "@nestjs/common";
import { CardsService } from "./cards.service";
import { CardsController } from "./cards.controller";
import { PrismaService } from "../prisma.service";
import { BoardsModule } from "../boards/boards.module";
import { LabelsModule } from "../labels/labels.module";
import { ActivitiesModule } from "../activities/activities.module";
import { NotificationsModule } from "../notifications/notifications.module";
// WebSocketsGateway is available globally via WebSocketsModule

@Module({
  imports: [BoardsModule, LabelsModule, ActivitiesModule, NotificationsModule],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule { }
