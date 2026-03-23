import type { TodoItem, TodoList, TodoPriority } from '../types';

const STORAGE_KEY = 'todoapp_lists';

function normalizePriority(value: unknown): TodoPriority {
  if (value === 'low' || value === 'medium' || value === 'high') {
    return value;
  }
  return 'medium';
}

function normalizeItem(item: Partial<TodoItem>): TodoItem {
  return {
    id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
    title: typeof item.title === 'string' ? item.title : 'Untitled task',
    done: Boolean(item.done),
    comment: typeof item.comment === 'string' ? item.comment : '',
    priority: normalizePriority(item.priority),
    dueDate: typeof item.dueDate === 'string' && item.dueDate ? item.dueDate : null,
    createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
  };
}

function normalizeList(list: Partial<TodoList>): TodoList {
  return {
    id: typeof list.id === 'string' ? list.id : crypto.randomUUID(),
    name: typeof list.name === 'string' ? list.name : 'New List',
    items: Array.isArray(list.items) ? list.items.map((item) => normalizeItem(item as Partial<TodoItem>)) : [],
    createdAt: typeof list.createdAt === 'number' ? list.createdAt : Date.now(),
  };
}

export function loadLists(): TodoList[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((list) => normalizeList(list as Partial<TodoList>));
  } catch {
    return [];
  }
}

export function saveLists(lists: TodoList[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

export function uuid(): string {
  return crypto.randomUUID();
}
