import { IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class UpdateListDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    title?: string;

    @IsOptional()
    @IsBoolean()
    isArchived?: boolean;
}
