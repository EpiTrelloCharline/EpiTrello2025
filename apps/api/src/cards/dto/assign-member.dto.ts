import { IsNotEmpty, IsString } from 'class-validator';

export class AssignMemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
