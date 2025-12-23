import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';

export class CreateCardDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    listId: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @IsOptional()
    @IsBoolean()
    isDone?: boolean;
}
