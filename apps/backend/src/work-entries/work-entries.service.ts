import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateWorkEntryDto, UpdateWorkEntryDto, ListWorkEntriesQuery } from './work-entries.schema';

@Injectable()
export class WorkEntriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: ListWorkEntriesQuery) {
    const where: Record<string, unknown> = {};

    if (query.from || query.to) {
      where['date'] = {
        ...(query.from ? { gte: new Date(query.from) } : {}),
        ...(query.to ? { lte: new Date(query.to) } : {}),
      };
    }

    return this.prisma.workEntry.findMany({
      where,
      orderBy: { date: query.sort === 'asc' ? 'asc' : 'desc' },
      include: { workType: true },
    });
  }

  async findOne(id: string) {
    const entry = await this.prisma.workEntry.findUnique({
      where: { id },
      include: { workType: true },
    });
    if (!entry) throw new NotFoundException('Work entry not found');
    return entry;
  }

  create(dto: CreateWorkEntryDto) {
    return this.prisma.workEntry.create({
      data: {
        date: new Date(dto.date),
        workTypeId: dto.workTypeId,
        volume: dto.volume,
        unit: dto.unit,
        executor: dto.executor,
        notes: dto.notes,
      },
      include: { workType: true },
    });
  }

  async update(id: string, dto: UpdateWorkEntryDto) {
    await this.findOne(id);
    return this.prisma.workEntry.update({
      where: { id },
      data: {
        ...(dto.date ? { date: new Date(dto.date) } : {}),
        ...(dto.workTypeId ? { workTypeId: dto.workTypeId } : {}),
        ...(dto.volume !== undefined ? { volume: dto.volume } : {}),
        ...(dto.unit ? { unit: dto.unit } : {}),
        ...(dto.executor ? { executor: dto.executor } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      },
      include: { workType: true },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.prisma.workEntry.delete({ where: { id } });
    return { success: true };
  }
}
