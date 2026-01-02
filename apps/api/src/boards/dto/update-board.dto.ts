import { IsOptional, IsString } from 'class-validator';

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @IsOptional()
  @IsString()
  backgroundImage?: string;
}
