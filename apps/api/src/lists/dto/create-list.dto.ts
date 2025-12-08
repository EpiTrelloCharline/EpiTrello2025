// create-list.dto.ts
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateListDto {
  @IsString() @IsNotEmpty() boardId!: string;

  @IsString() @IsNotEmpty() title!: string;

  @IsOptional() @IsString() after?: string; // id de la liste après laquelle on insère
}
