import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateChecklistItemDto {
    @IsString()
    @IsOptional()
    content?: string;

    @IsBoolean()
    @IsOptional()
    checked?: boolean;
}
