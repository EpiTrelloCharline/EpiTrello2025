import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { BoardRole } from '@prisma/client';

export class InviteMemberDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(BoardRole)
  @IsNotEmpty()
  role: BoardRole;
}
