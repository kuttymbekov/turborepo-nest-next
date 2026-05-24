import { Module } from '@nestjs/common';
import { WorkEntriesService } from './work-entries.service';
import { WorkEntriesController } from './work-entries.controller';

@Module({
  controllers: [WorkEntriesController],
  providers: [WorkEntriesService],
})
export class WorkEntriesModule {}
