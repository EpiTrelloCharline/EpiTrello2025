import { IsBoolean, IsOptional, IsString, IsDateString } from 'class-validator';

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

    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @IsOptional()
    @IsBoolean()
    isDone?: boolean;

    @IsOptional()
    @IsString()
    priority?: string;

    @IsOptional()
    @IsString()
    size?: string;

    @IsOptional()
    @IsString()
    coverColor?: string;

    @IsOptional()
    @IsString()
    coverUrl?: string;

    @IsOptional()
    @IsString()
    coverSize?: string;
}
