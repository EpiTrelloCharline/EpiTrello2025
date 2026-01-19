import { IsString, MinLength } from 'class-validator';

export class RenameAttachmentDto {
    @IsString()
    @MinLength(1)
    name: string;
}
