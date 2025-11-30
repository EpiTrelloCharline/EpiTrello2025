import { IsString, IsOptional, Matches } from 'class-validator';

export class UpdateLabelDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Color must be a valid hex color code (e.g., #FF5733)' })
  color?: string;
}
