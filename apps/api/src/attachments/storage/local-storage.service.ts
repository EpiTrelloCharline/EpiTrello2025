import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IStorageService } from './storage.interface';
import { unlink } from 'fs/promises';

@Injectable()
export class LocalStorageService implements IStorageService {
    async uploadFile(file: Express.Multer.File): Promise<string> {
        // In local storage, Multer handles the save to disk via diskStorage
        // We just return the path relative to the root or however it's configured in Multer
        return file.path;
    }

    async deleteFile(path: string): Promise<void> {
        try {
            await unlink(path);
        } catch (error) {
            console.error('Erreur lors de la suppression du fichier local:', error);
            // We don't throw if file doesn't exist, as it might have been deleted manually
        }
    }
}
