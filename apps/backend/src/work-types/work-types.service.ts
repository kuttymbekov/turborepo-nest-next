import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateWorkTypeDto } from './work-types.schema';

@Injectable()
export class WorkTypesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.workType.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateWorkTypeDto) {
    const existing = await this.prisma.workType.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Work type already exists');
    return this.prisma.workType.create({ data: { name: dto.name } });
  }
}
