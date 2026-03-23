import type { TodoList } from '../types';

const STORAGE_KEY = 'todoapp_lists';

export function loadLists(): TodoList[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TodoList[]) : [];
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
