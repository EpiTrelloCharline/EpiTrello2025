import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class ListPositionDto {
    @IsString()
    listId: string;

    @IsNumber()
    position: number;
}

export class BatchMoveListsDto {
    @IsString()
    boardId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ListPositionDto)
    lists: ListPositionDto[];
}
