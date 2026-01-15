import { IsEnum, IsString } from 'class-validator';

export class UpdateMemberRoleDto {
    @IsEnum(['ADMIN', 'MEMBER', 'OBSERVER'])
    role: 'ADMIN' | 'MEMBER' | 'OBSERVER';
}
