import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { IStorageService } from './storage.interface';
import { readFileSync } from 'fs';

@Injectable()
export class S3StorageService implements IStorageService {
    private s3Client: S3Client;
    private bucket: string;

    constructor(private configService: ConfigService) {
        const endpoint = this.configService.get<string>('S3_ENDPOINT');
        const region = this.configService.get<string>('S3_REGION') || 'us-east-1';
        const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY');
        const secretAccessKey = this.configService.get<string>('S3_SECRET_KEY');
        this.bucket = this.configService.get<string>('S3_BUCKET', 'epitrello-attachments');

        this.s3Client = new S3Client({
            endpoint,
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            forcePathStyle: true, // Needed for Minio
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const key = `attachments/${Date.now()}-${file.originalname}`;
        const fileBuffer = readFileSync(file.path);

        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    Body: fileBuffer,
                    ContentType: file.mimetype,
                }),
            );

            // Return the key as the URL/Path for storage in DB
            return key;
        } catch (error) {
            console.error('Erreur upload S3:', error);
            throw new InternalServerErrorException('Erreur lors du transfert vers le stockage distant');
        }
    }

    async deleteFile(path: string): Promise<void> {
        try {
            await this.s3Client.send(
                new DeleteObjectCommand({
                    Bucket: this.bucket,
                    Key: path,
                }),
            );
        } catch (error) {
            console.error('Erreur suppression S3:', error);
        }
    }
}
