import { Input, Mutation, Query, Router } from 'nestjs-trpc';
import { TodosService } from './todos.service';
import { z } from 'zod';
import { createTodoSchema, todosSchema } from './todos.schema';
import type { CreateTodoInput } from './todos.schema';

@Router({
  alias: 'todo',
})
export class TodoRouter {
  constructor(private readonly todosService: TodosService) {}

  @Query({
    input: z.object({
      id: z.string(),
    }),
    output: todosSchema,
  })
  getTodoById(@Input('id') id: string) {
    return this.todosService.getTodoById(id);
  }

  @Query({
    output: z.array(todosSchema),
  })
  getAllTodos() {
    return this.todosService.getAllTodos();
  }

  @Mutation({
    input: createTodoSchema,
    output: todosSchema,
  })
  createTodo(@Input() todoData: CreateTodoInput) {
    return this.todosService.createTodo(todoData);
  }

  @Mutation({
    input: z.object({
      id: z.string(),
      data: createTodoSchema.partial(),
    }),
    output: todosSchema,
  })
  updateTodo(
    @Input('id') id: string,
    @Input('data') data: Partial<CreateTodoInput>,
  ) {
    return this.todosService.updateTodo(id, data);
  }

  @Mutation({
    input: z.object({
      id: z.string(),
    }),
    output: z.boolean(),
  })
  deleteTodo(@Input('id') id: string) {
    return this.todosService.deleteTodo(id);
  }
}
