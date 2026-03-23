export type TodoPriority = 'low' | 'medium' | 'high';

export interface TodoItem {
  id: string;
  title: string;
  done: boolean;
  comment: string; // HTML string from TipTap
  priority: TodoPriority;
  dueDate: string | null;
  createdAt: number;
}

export interface TodoList {
  id: string;
  name: string;
  items: TodoItem[];
  createdAt: number;
}
