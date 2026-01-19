import {
    Controller,
    Post,
    Delete,
    Get,
    Param,
    Request,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Patch,
    Body,
} from '@nestjs/common';
import { RenameAttachmentDto } from './dto/rename-attachment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AttachmentsService } from './attachments.service';
import { multerConfig } from '../config/multer.config';

@UseGuards(JwtAuthGuard)
@Controller()
export class AttachmentsController {
    constructor(private readonly attachmentsService: AttachmentsService) { }

    /**
     * POST /cards/:id/attachments
     * Upload a file attachment to a card
     */
    @Post('cards/:id/attachments')
    @UseInterceptors(FileInterceptor('file', multerConfig))
    async uploadAttachment(
        @Param('id') cardId: string,
        @UploadedFile() file: Express.Multer.File,
        @Request() req: any,
    ) {
        if (!file) {
            throw new BadRequestException('Aucun fichier fourni');
        }

        return this.attachmentsService.uploadAttachment(req.user.id, cardId, file);
    }

    /**
     * DELETE /attachments/:id
     * Delete an attachment
     */
    @Delete('attachments/:id')
    async deleteAttachment(@Param('id') attachmentId: string, @Request() req: any) {
        return this.attachmentsService.deleteAttachment(req.user.id, attachmentId);
    }

    /**
     * GET /cards/:id/attachments
     * Get all attachments for a card
     */
    /**
     * GET /cards/:id/attachments
     * Get all attachments for a card
     */
    @Get('cards/:id/attachments')
    async getCardAttachments(@Param('id') cardId: string) {
        return this.attachmentsService.getCardAttachments(cardId);
    }

    /**
     * PATCH /attachments/:id
     * Rename an attachment
     */
    @Patch('attachments/:id')
    async renameAttachment(
        @Param('id') attachmentId: string,
        @Body() renameDto: RenameAttachmentDto,
        @Request() req: any,
    ) {
        return this.attachmentsService.renameAttachment(
            req.user.id,
            attachmentId,
            renameDto.name,
        );
    }
}
