
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Get()
    search(
        @Req() req: Request,
        @Query('boardId') boardId: string,
        @Query('q') query: string
    ) {
        // @ts-ignore
        const userId = req.user.id;
        return this.searchService.search(userId, boardId, query);
    }
}
