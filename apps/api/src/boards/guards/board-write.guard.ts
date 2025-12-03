import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { BoardPermissionsService } from '../board-permissions.service';

@Injectable()
export class BoardWriteGuard implements CanActivate {
    constructor(private permissions: BoardPermissionsService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.id;

        if (!userId) {
            throw new ForbiddenException('Utilisateur non authentifié');
        }

        // Déterminer le boardId depuis les paramètres
        const boardId = await this.resolveBoardId(request);

        if (!boardId) {
            throw new ForbiddenException('Board non spécifié');
        }

        // Récupérer le rôle de l'utilisateur
        const role = await this.permissions.getUserBoardRole(userId, boardId);

        if (!role) {
            throw new ForbiddenException('Vous n\'êtes pas membre de ce board');
        }

        // Vérifier l'accès en écriture (bloque OBSERVER)
        if (!this.permissions.hasWriteAccess(role)) {
            throw new ForbiddenException('Vous n\'avez pas les droits pour cette action');
        }

        return true;
    }

    /**
     * Résout le boardId depuis les paramètres de la requête
     * Supporte: params.id, params.boardId, query.boardId, body.boardId, query.listId, body.listId, params.id (card)
     */
    private async resolveBoardId(request: any): Promise<string | null> {
        // Cas 1: boardId directement dans les paramètres ou query
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

        // Cas 2: listId - remonter au board
        const listId = request.query?.listId || request.body?.listId;
        if (listId) {
            return await this.permissions.getBoardIdFromList(listId);
        }

        // Cas 3: cardId - remonter au board via la liste
        const cardId = request.params?.id;
        if (cardId && request.route?.path?.includes('/cards/')) {
            return await this.permissions.getBoardIdFromCard(cardId);
        }

        return null;
    }
}
