import { Body, Controller, Delete, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post('cards/:cardId/comments')
    create(
        @Param('cardId') cardId: string,
        @Body() createCommentDto: CreateCommentDto,
        @Request() req: any,
    ) {
        return this.commentsService.create(req.user.id, cardId, createCommentDto);
    }

    @Patch('comments/:id')
    update(
        @Param('id') id: string,
        @Body() updateCommentDto: UpdateCommentDto,
        @Request() req: any,
    ) {
        return this.commentsService.update(req.user.id, id, updateCommentDto);
    }

    @Delete('comments/:id')
    remove(@Param('id') id: string, @Request() req: any) {
        return this.commentsService.remove(req.user.id, id);
    }
}
