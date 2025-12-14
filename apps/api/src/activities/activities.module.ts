import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { PrismaService } from '../prisma.service';

@Module({
    providers: [ActivitiesService, PrismaService],
    exports: [ActivitiesService],
})
export class ActivitiesModule { }
