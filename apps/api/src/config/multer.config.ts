import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // Archives
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    // Text
    'text/plain',
    'text/csv',
];

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const multerConfig: MulterOptions = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
            // Generate unique filename: timestamp-randomstring-originalname
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const nameWithoutExt = file.originalname.replace(ext, '');
            callback(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
        },
    }),
    fileFilter: (req, file, callback) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return callback(
                new BadRequestException(
                    `Type de fichier non autorisé. Types acceptés: ${ALLOWED_MIME_TYPES.join(', ')}`,
                ),
                false,
            );
        }
        callback(null, true);
    },
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
};
