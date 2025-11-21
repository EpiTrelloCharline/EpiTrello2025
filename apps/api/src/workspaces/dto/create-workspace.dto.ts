// dto/create-workspace.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString() @IsNotEmpty() name!: string;

  @IsString() @IsOptional() description?: string;
}

