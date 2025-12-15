import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateCardDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    listId?: string;

    @IsOptional()
    @IsString()
    position?: string;

    @IsOptional()
    @IsBoolean()
    isArchived?: boolean;
}
