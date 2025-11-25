import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { MoveCardDto } from './dto/move-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) { }

    @Get()
    list(@Query('listId') listId: string, @Request() req: any) {
        return this.cardsService.list(req.user.id, listId);
    }

    @Post()
    create(@Body() createCardDto: CreateCardDto, @Request() req: any) {
        return this.cardsService.create(req.user.id, createCardDto);
    }

    @Post('move')
    move(@Body() moveCardDto: MoveCardDto, @Request() req: any) {
        return this.cardsService.move(req.user.id, moveCardDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto, @Request() req: any) {
        return this.cardsService.update(req.user.id, id, updateCardDto);
    }

    @Delete(':id')
    archive(@Param('id') id: string, @Request() req: any) {
        return this.cardsService.archive(req.user.id, id);
    }
}
