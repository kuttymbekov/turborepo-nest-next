// Простой API клиент на fetch
// Без tRPC, без магии — просто HTTP запросы

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Типы (можно вынести в отдельный файл types.ts)
export interface Todo {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

export interface CreateTodoInput {
  name: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

export interface UpdateTodoInput {
  name?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

// API функции
export const todosApi = {
  // GET /todos
  getAll: async (): Promise<Todo[]> => {
    const res = await fetch(`${API_URL}/todos`);
    if (!res.ok) throw new Error("Failed to fetch todos");
    return res.json();
  },

  // GET /todos/:id
  getById: async (id: string): Promise<Todo> => {
    const res = await fetch(`${API_URL}/todos/${id}`);
    if (!res.ok) throw new Error("Failed to fetch todo");
    return res.json();
  },

  // POST /todos
  create: async (data: CreateTodoInput): Promise<Todo> => {
    const res = await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create todo");
    return res.json();
  },

  // PUT /todos/:id
  update: async (id: string, data: UpdateTodoInput): Promise<Todo> => {
    const res = await fetch(`${API_URL}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update todo");
    return res.json();
  },

  // DELETE /todos/:id
  delete: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_URL}/todos/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete todo");
    return res.json();
  },
};
