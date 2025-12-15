import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { BoardPermissionsService } from '../board-permissions.service';

@Injectable()
export class BoardReadGuard implements CanActivate {
    constructor(private permissions: BoardPermissionsService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.id;

        if (!userId) {
            throw new ForbiddenException('Utilisateur non authentifié');
        }

        // Determine the boardId from the request parameters
        const boardId = await this.resolveBoardId(request);

        if (!boardId) {
            throw new ForbiddenException('Board non spécifié');
        }

        // Retrieve the user's role
        const role = await this.permissions.getUserBoardRole(userId, boardId);

        if (!role) {
            throw new ForbiddenException('Vous n\'êtes pas membre de ce board');
        }

        // Check read access
        if (!this.permissions.hasReadAccess(role)) {
            throw new ForbiddenException('Vous n\'avez pas les droits pour cette action');
        }

        return true;
    }

    /**
     * Resolves the boardId from the request parameters
     * Supports: params.id, params.boardId, query.boardId, body.boardId, query.listId, body.listId, params.id (card)
     */
    private async resolveBoardId(request: any): Promise<string | null> {
        // Case 1: boardId directly in params, query or body
        if (request.params?.id && request.route?.path?.includes('/boards/')) {
            return request.params.id;
        }
        if (request.params?.boardId) {
            return request.params.boardId;
        }
        if (request.query?.boardId) {
            return request.query.boardId;
        }
        if (request.body?.boardId) {
            return request.body.boardId;
        }

        // Case 2: listId - derive boardId from the list
        const listId = request.query?.listId || request.body?.listId;
        if (listId) {
            return await this.permissions.getBoardIdFromList(listId);
        }

        // Case 3: cardId - derive the boardId via the card's list
        const cardId = request.params?.id;
        if (cardId && request.route?.path?.includes('/cards/')) {
            return await this.permissions.getBoardIdFromCard(cardId);
        }

        // Case 4: listId from params - derive the boardId via the list
        const listIdParam = request.params?.id;
        if (listIdParam && request.route?.path?.includes('/lists/')) {
            return await this.permissions.getBoardIdFromList(listIdParam);
        }

        return null;
    }
}
