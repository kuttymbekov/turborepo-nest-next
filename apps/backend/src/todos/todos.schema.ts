// Простые TypeScript интерфейсы вместо Zod схем

export interface Todo {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface CreateTodoDto {
  name: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateTodoDto {
  name?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}
