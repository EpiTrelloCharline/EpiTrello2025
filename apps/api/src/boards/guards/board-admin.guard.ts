import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { BoardPermissionsService } from '../board-permissions.service';

/**
 * Guard verify if the user is OWNER or ADMIN
 */
@Injectable()
export class BoardAdminGuard implements CanActivate {
  constructor(private boardPermissions: BoardPermissionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const boardId = request.params.id;

    if (!userId || !boardId) {
      throw new ForbiddenException('Informations manquantes');
    }

    const role = await this.boardPermissions.getUserBoardRole(userId, boardId);

    if (!role) {
      throw new ForbiddenException('Vous n\'êtes pas membre de ce board');
    }

    // Only OWNER and ADMIN can invite members
    if (role !== 'OWNER' && role !== 'ADMIN') {
      throw new ForbiddenException('Seuls les propriétaires et administrateurs peuvent inviter des membres');
    }

    return true;
  }
}
