import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { PrismaService } from '../prisma.service';
import { IStorageService } from './storage/storage.interface';
import { LocalStorageService } from './storage/local-storage.service';
import { S3StorageService } from './storage/s3-storage.service';

@Module({
    imports: [ConfigModule],
    controllers: [AttachmentsController],
    providers: [
        AttachmentsService,
        PrismaService,
        {
            provide: IStorageService,
            useFactory: (configService: ConfigService) => {
                const storageType = configService.get<string>('STORAGE_TYPE', 'local');
                return storageType === 's3'
                    ? new S3StorageService(configService)
                    : new LocalStorageService();
            },
            inject: [ConfigService],
        },
    ],
    exports: [AttachmentsService],
})
export class AttachmentsModule { }
