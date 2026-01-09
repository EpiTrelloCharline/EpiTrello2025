
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { SearchQueryDto } from '@epitrello/validation';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Get()
    search(
        @Req() req: Request,
        @Query() query: SearchQueryDto
    ) {
        const userId = (req as any).user.id;
        return this.searchService.search(userId, query);
    }
}
