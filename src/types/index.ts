export interface TodoItem {
  id: string;
  title: string;
  done: boolean;
  comment: string; // HTML string from TipTap
  createdAt: number;
}

export interface TodoList {
  id: string;
  name: string;
  items: TodoItem[];
  createdAt: number;
}
