import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ActivitiesService } from './activities.service';
import { ActivityEvent, ActivityEvents } from './activities.events';

@Injectable()
export class ActivitiesListener {
    constructor(private readonly activitiesService: ActivitiesService) { }

    @OnEvent('**')
    async handleAllEvents(event: any) {
        if (event instanceof ActivityEvent) {
            await this.activitiesService.logActivity(
                event.boardId,
                event.userId,
                event.type,
                event.entityId,
                event.details,
            );
        }
    }
}
