import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { ActivitiesListener } from './activities.listener';
import { PrismaService } from '../prisma.service';
// WebSocketsGateway is available globally via WebSocketsModule

@Module({
    controllers: [ActivitiesController],
    providers: [ActivitiesService, ActivitiesListener, PrismaService],
    exports: [ActivitiesService],
})
export class ActivitiesModule { }
