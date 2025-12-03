import { IsNotEmpty, IsString } from 'class-validator';

export class AssignLabelDto {
  @IsNotEmpty()
  @IsString()
  labelId: string;
}
