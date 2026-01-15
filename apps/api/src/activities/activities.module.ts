import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { PrismaService } from '../prisma.service';
// WebSocketsGateway is available globally via WebSocketsModule

@Module({
    providers: [ActivitiesService, PrismaService],
    exports: [ActivitiesService],
})
export class ActivitiesModule { }
