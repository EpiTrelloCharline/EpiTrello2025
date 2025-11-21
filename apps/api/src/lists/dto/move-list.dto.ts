// move-list.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class MoveListDto {
  @IsString() @IsNotEmpty() listId!: string;

  @IsString() @IsNotEmpty() boardId!: string;

  @IsNumber() newPosition!: number;
}

