import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateLabelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'color must be a valid hex color (e.g., #FF0000)' })
  color: string;
}
