import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';

@Module({
  controllers: [TodosController], // Контроллер вместо Router
  providers: [TodosService],
})
export class TodosModule {}
