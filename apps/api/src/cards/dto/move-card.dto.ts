import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MoveCardDto {
    @IsString()
    cardId: string;

    @IsString()
    @IsOptional()
    listId?: string;

    @IsNumber()
    @IsOptional()
    newPosition?: number;
}
