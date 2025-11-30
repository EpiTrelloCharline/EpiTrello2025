import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  @IsNotEmpty()
  boardId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Color must be a valid hex color code (e.g., #FF5733)' })
  color: string;
}
