"use client";

import { useState } from "react";
import { trpc } from "../../trpc/client";

export function CreateTodo() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const utils = trpc.useUtils();

  const { mutate: createTodo, isPending } = trpc.todo.createTodo.useMutation({
    onSuccess: () => {
      setName("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setIsExpanded(false);
      utils.todo.getAllTodos.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    createTodo({ name, description, dueDate, completed: false, priority });
  };

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-emerald-500" },
    { value: "medium", label: "Medium", color: "bg-amber-500" },
    { value: "high", label: "High", color: "bg-rose-500" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center gap-3 p-5 text-left hover:bg-slate-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <span className="text-slate-500 font-medium">Add a new task...</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <input
                type="text"
                placeholder="Task name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="w-full text-lg font-medium text-slate-800 placeholder-slate-400 border-0 p-0 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Description Input */}
            <div>
              <textarea
                placeholder="Add a description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full text-slate-600 placeholder-slate-400 border-0 p-0 resize-none focus:outline-none focus:ring-0"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100"></div>

            {/* Options Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Due Date */}
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                <svg
                  className="w-4 h-4 text-slate-500"
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
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-transparent text-sm text-slate-600 border-0 p-0 focus:outline-none focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Priority Selector */}
              <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-lg border border-slate-200">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setPriority(option.value as "low" | "medium" | "high")
                    }
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      priority === option.value
                        ? "bg-white shadow-sm text-slate-700"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${option.color}`}
                    ></span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setName("");
                  setDescription("");
                  setDueDate("");
                  setPriority("medium");
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isPending || !name.trim()}
                type="submit"
                className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-violet-200 hover:shadow-lg hover:shadow-violet-300"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Add Task"
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
