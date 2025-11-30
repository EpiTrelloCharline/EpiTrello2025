import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';

@Injectable()
export class LabelsService {
  constructor(private prisma: PrismaService) {}

  async create(createLabelDto: CreateLabelDto) {
    return this.prisma.label.create({
      data: createLabelDto,
    });
  }

  async findByBoard(boardId: string) {
    return this.prisma.label.findMany({
      where: { boardId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const label = await this.prisma.label.findUnique({
      where: { id },
    });
    if (!label) {
      throw new NotFoundException(`Label with ID ${id} not found`);
    }
    return label;
  }

  async update(id: string, updateLabelDto: UpdateLabelDto) {
    await this.findOne(id); // Check if exists
    return this.prisma.label.update({
      where: { id },
      data: updateLabelDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists
    return this.prisma.label.delete({
      where: { id },
    });
  }

  async assignToCard(cardId: string, labelId: string) {
    // Check if card exists
    const card = await this.prisma.card.findUnique({ where: { id: cardId } });
    if (!card) {
      throw new NotFoundException(`Card with ID ${cardId} not found`);
    }

    // Check if label exists
    await this.findOne(labelId);

    // Check if already assigned
    const existing = await this.prisma.cardLabel.findUnique({
      where: {
        cardId_labelId: { cardId, labelId },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.cardLabel.create({
      data: { cardId, labelId },
      include: { label: true },
    });
  }

  async unassignFromCard(cardId: string, labelId: string) {
    const cardLabel = await this.prisma.cardLabel.findUnique({
      where: {
        cardId_labelId: { cardId, labelId },
      },
    });

    if (!cardLabel) {
      throw new NotFoundException(`Label not assigned to this card`);
    }

    return this.prisma.cardLabel.delete({
      where: { id: cardLabel.id },
    });
  }

  async getCardLabels(cardId: string) {
    const cardLabels = await this.prisma.cardLabel.findMany({
      where: { cardId },
      include: { label: true },
    });

    return cardLabels.map((cl) => cl.label);
  }
}
