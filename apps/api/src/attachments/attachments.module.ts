import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { PrismaService } from '../prisma.service';
import { multerConfig } from '../config/multer.config';

@Module({
    imports: [MulterModule.register(multerConfig)],
    controllers: [AttachmentsController],
    providers: [AttachmentsService, PrismaService],
    exports: [AttachmentsService],
})
export class AttachmentsModule { }
