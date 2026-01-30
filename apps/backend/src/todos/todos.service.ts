import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto, UpdateTodoDto, Todo } from './todos.schema';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];

  getTodoById(id: string): Todo {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  getAllTodos(): Todo[] {
    return this.todos;
  }

  createTodo(todoData: CreateTodoDto): Todo {
    const todo: Todo = {
      id: Math.random().toString(36).substring(2, 15),
      ...todoData,
      createdAt: new Date().toISOString(),
    };

    this.todos.push(todo);
    return todo;
  }

  updateTodo(id: string, todoData: UpdateTodoDto): Todo {
    const idx = this.todos.findIndex((t) => t.id === id);
    if (idx === -1) {
      throw new NotFoundException('Todo not found');
    }

    const updatedTodo: Todo = {
      ...this.todos[idx],
      ...todoData,
    };

    this.todos[idx] = updatedTodo;
    return updatedTodo;
  }

  deleteTodo(id: string): { success: boolean } {
    const idx = this.todos.findIndex((t) => t.id === id);
    if (idx === -1) {
      throw new NotFoundException('Todo not found');
    }
    this.todos.splice(idx, 1);
    return { success: true };
  }
}
