import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
    constructor(private readonly activitiesService: ActivitiesService) { }

    @Get('cards/:id/activity')
    async getCardActivity(
        @Param('id') cardId: string,
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ) {
        return this.activitiesService.getCardActivityHistory(
            cardId,
            limit ? parseInt(limit, 10) : undefined,
            offset ? parseInt(offset, 10) : undefined,
        );
    }

    @Get('boards/:id/activities')
    async getBoardActivities(@Param('id') boardId: string) {
        return this.activitiesService.getBoardActivities(boardId);
    }
}
