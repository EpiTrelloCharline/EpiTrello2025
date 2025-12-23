import { Module, forwardRef } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { PrismaService } from '../prisma.service';
import { BoardsModule } from '../boards/boards.module';

@Module({
    imports: [forwardRef(() => BoardsModule)],
    providers: [ActivitiesService, PrismaService],
    exports: [ActivitiesService],
})
export class ActivitiesModule { }
