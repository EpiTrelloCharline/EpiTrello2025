export interface IStorageService {
    uploadFile(file: Express.Multer.File): Promise<string>;
    deleteFile(path: string): Promise<void>;
}

export const IStorageService = Symbol('IStorageService');
