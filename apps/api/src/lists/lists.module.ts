import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { PrismaService } from '../prisma.service';
import { BoardsModule } from '../boards/boards.module';
// WebSocketsGateway is available globally via WebSocketsModule

@Module({
  imports: [BoardsModule], // Needed for BoardReadGuard and BoardWriteGuard
  controllers: [ListsController],
  providers: [ListsService, PrismaService],
})
export class ListsModule { }

