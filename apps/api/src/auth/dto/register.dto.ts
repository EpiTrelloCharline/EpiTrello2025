import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail() email!: string;

  @IsString() @IsNotEmpty() password!: string;

  @IsString() @IsOptional() name?: string;
}

