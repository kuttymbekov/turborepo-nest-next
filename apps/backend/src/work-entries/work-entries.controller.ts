import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { WorkEntriesService } from './work-entries.service';
import type { CreateWorkEntryDto, UpdateWorkEntryDto, ListWorkEntriesQuery } from './work-entries.schema';

@Controller('work-entries')
export class WorkEntriesController {
  constructor(private readonly workEntriesService: WorkEntriesService) {}

  @Get()
  findAll(@Query() query: ListWorkEntriesQuery) {
    return this.workEntriesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workEntriesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateWorkEntryDto) {
    return this.workEntriesService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWorkEntryDto) {
    return this.workEntriesService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.workEntriesService.delete(id);
  }
}
