import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}
