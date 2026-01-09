import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CardPositionDto {
    @IsString()
    cardId: string;

    @IsString()
    listId: string;

    @IsNumber()
    position: number;
}

export class BatchMoveCardsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CardPositionDto)
    cards: CardPositionDto[];

    @IsString()
    @IsOptional()
    boardId?: string;
}
