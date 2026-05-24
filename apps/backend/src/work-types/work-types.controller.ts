import { Controller, Get, Post, Body } from '@nestjs/common';
import { WorkTypesService } from './work-types.service';
import type { CreateWorkTypeDto } from './work-types.schema';

@Controller('work-types')
export class WorkTypesController {
  constructor(private readonly workTypesService: WorkTypesService) {}

  @Get()
  findAll() {
    return this.workTypesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateWorkTypeDto) {
    return this.workTypesService.create(dto);
  }
}
