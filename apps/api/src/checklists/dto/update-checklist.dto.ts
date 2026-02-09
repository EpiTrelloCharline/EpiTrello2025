import { IsOptional, IsString } from 'class-validator';

export class UpdateChecklistDto {
    @IsString()
    @IsOptional()
    title?: string;
}
