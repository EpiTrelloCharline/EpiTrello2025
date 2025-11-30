import { IsString, IsNotEmpty } from 'class-validator';

export class AssignLabelDto {
  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsString()
  @IsNotEmpty()
  labelId: string;
}
