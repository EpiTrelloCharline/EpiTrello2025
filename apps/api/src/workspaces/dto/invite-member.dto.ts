// dto/invite-member.dto.ts
import { IsEmail, IsEnum } from 'class-validator';

export enum WorkspaceRoleDto { OWNER = 'OWNER', ADMIN = 'ADMIN', MEMBER = 'MEMBER', OBSERVER = 'OBSERVER' }

export class InviteMemberDto {
  @IsEmail() email!: string;

  @IsEnum(WorkspaceRoleDto) role!: WorkspaceRoleDto;
}

