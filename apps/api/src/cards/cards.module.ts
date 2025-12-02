import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { PrismaService } from '../prisma.service';
import { BoardsModule } from '../boards/boards.module';

@Module({
    imports: [BoardsModule],
    controllers: [CardsController],
    providers: [CardsService, PrismaService],
})
export class CardsModule { }
