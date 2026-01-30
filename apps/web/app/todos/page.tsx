"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todosApi, Todo } from "../../api/client";
import { CreateTodo } from "./create-todo";

const priorityConfig = {
  low: {
    label: "Low",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
  },
  medium: {
    label: "Medium",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
  high: {
    label: "High",
    bgColor: "bg-rose-100",
    textColor: "text-rose-700",
    borderColor: "border-rose-200",
  },
};

export default function TodosPage() {
  const queryClient = useQueryClient();

  // GET /todos - получить все todos
  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: todosApi.getAll,
  });

  // PUT /todos/:id - обновить todo
  const updateTodo = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { completed: boolean } }) =>
      todosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // DELETE /todos/:id - удалить todo
  const deleteTodo = useMutation({
    mutationFn: (id: string) => todosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleToggleTodo = (id: string, completed: boolean) => {
    updateTodo.mutate({ id, data: { completed } });
  };

  const handleDeleteTodo = (id: string) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;
    deleteTodo.mutate(id);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const completedCount = todos?.filter((t) => t.completed).length ?? 0;
  const totalCount = todos?.length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            My Tasks
          </h1>
          <p className="text-slate-500">
            {totalCount > 0 ? (
              <>
                <span className="font-medium text-slate-700">
                  {completedCount}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-700">{totalCount}</span>{" "}
                tasks completed
              </>
            ) : (
              "Start by adding your first task"
            )}
          </p>
        </div>

        {/* Create Todo Form */}
        <div className="mb-8">
          <CreateTodo />
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
            </div>
          ) : todos?.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-1">
                No tasks yet
              </h3>
              <p className="text-slate-500">
                Create your first task to get started!
              </p>
            </div>
          ) : (
            todos?.map((todo) => {
              const priority =
                priorityConfig[todo.priority as keyof typeof priorityConfig] ??
                priorityConfig.low;
              return (
                <div
                  key={todo.id}
                  className={`group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden ${
                    todo.completed ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex items-start gap-4 p-5">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleTodo(todo.id, !todo.completed)}
                      className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        todo.completed
                          ? "bg-violet-600 border-violet-600"
                          : "border-slate-300 hover:border-violet-400"
                      }`}
                    >
                      {todo.completed && (
                        <svg
                          className="w-3.5 h-3.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3
                          className={`text-lg font-semibold transition-all ${
                            todo.completed
                              ? "text-slate-400 line-through"
                              : "text-slate-800"
                          }`}
                        >
                          {todo.name}
                        </h3>
                        <span
                          className={`flex-shrink-0 px-2.5 py-1 text-xs font-medium rounded-full border ${priority.bgColor} ${priority.textColor} ${priority.borderColor}`}
                        >
                          {priority.label}
                        </span>
                      </div>

                      {todo.description && (
                        <p
                          className={`text-sm mb-3 ${
                            todo.completed ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          {todo.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4">
                        {todo.dueDate && (
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>{formatDate(todo.dueDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="flex-shrink-0 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete task"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
