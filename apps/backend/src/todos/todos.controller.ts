import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import type { CreateTodoDto, UpdateTodoDto } from './todos.schema';

@Controller('todos') // все роуты будут /todos/*
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  // GET /todos - получить все todos
  @Get()
  getAllTodos() {
    return this.todosService.getAllTodos();
  }

  // GET /todos/:id - получить один todo по id
  @Get(':id')
  getTodoById(@Param('id') id: string) {
    return this.todosService.getTodoById(id);
  }

  // POST /todos - создать новый todo
  @Post()
  createTodo(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.createTodo(createTodoDto);
  }

  // PUT /todos/:id - обновить todo
  @Put(':id')
  updateTodo(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.updateTodo(id, updateTodoDto);
  }

  // DELETE /todos/:id - удалить todo
  @Delete(':id')
  deleteTodo(@Param('id') id: string) {
    return this.todosService.deleteTodo(id);
  }
}
