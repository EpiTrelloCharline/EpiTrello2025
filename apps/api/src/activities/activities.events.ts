import { ActivityType } from '@prisma/client';

export class ActivityEvent {
    constructor(
        public readonly boardId: string,
        public readonly userId: string,
        public readonly type: ActivityType,
        public readonly entityId: string,
        public readonly details?: string,
    ) { }
}

export enum ActivityEvents {
    CARD_CREATED = 'card.created',
    CARD_MOVED = 'card.moved',
    CARD_ARCHIVED = 'card.archived',
    CARD_RESTORED = 'card.restored',
    UPDATE_DESCRIPTION = 'card.description_updated',
    COMMENT_ADDED = 'comment.added',
    MEMBER_ADDED = 'member.added',
    MEMBER_REMOVED = 'member.removed',
    ATTACHMENT_ADDED = 'attachment.added',
    ATTACHMENT_DELETED = 'attachment.deleted',
    CHECKLIST_ADDED = 'checklist.added',
    CHECKLIST_DELETED = 'checklist.deleted',
}
