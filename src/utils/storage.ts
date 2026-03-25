import type { TodoItem, TodoList, TodoPriority } from "../types";

const STORAGE_KEY = "todoapp_lists";

function normalizePriority(value: unknown): TodoPriority {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }
  return "medium";
}

function normalizeItem(item: Partial<TodoItem>): TodoItem {
  return {
    id: typeof item.id === "string" ? item.id : uuid(),
    title: typeof item.title === "string" ? item.title : "Untitled task",
    done: Boolean(item.done),
    comment: typeof item.comment === "string" ? item.comment : "",
    priority: normalizePriority(item.priority),
    dueDate:
      typeof item.dueDate === "string" && item.dueDate ? item.dueDate : null,
    createdAt: typeof item.createdAt === "number" ? item.createdAt : Date.now(),
  };
}

function normalizeList(list: Partial<TodoList>): TodoList {
  return {
    id: typeof list.id === "string" ? list.id : uuid(),
    name: typeof list.name === "string" ? list.name : "New List",
    items: Array.isArray(list.items)
      ? list.items.map((item) => normalizeItem(item as Partial<TodoItem>))
      : [],
    createdAt: typeof list.createdAt === "number" ? list.createdAt : Date.now(),
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

const THEME_KEY = "todoapp_theme";

export type Theme = "light" | "dark";

export function loadTheme(): Theme {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw === "dark" || raw === "light") return raw;
  } catch {}
  return "light";
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}

export function uuid(): string {
  // Use native randomUUID when available (secure contexts), otherwise use a
  // crypto.getRandomValues-based RFC4122 v4 fallback so the app works over HTTP
  // (S3 static website) as well as HTTPS/localhost.
  try {
    if (typeof crypto !== "undefined") {
      const c = crypto as unknown as
        | (Crypto & { randomUUID?: () => string })
        | undefined;
      if (c?.randomUUID) return c.randomUUID();
    }
  } catch {
    // ignore and fall back to non-native implementation
  }

  // Fallback implementation (RFC4122 v4)
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined") {
    const c = crypto as unknown as
      | (Crypto & { getRandomValues?: (arr: Uint8Array) => void })
      | undefined;
    if (c?.getRandomValues) {
      c.getRandomValues(bytes);
    }
  }
  if (!bytes.some((n) => n !== 0)) {
    // Last resort: Math.random (not cryptographically secure)
    for (let i = 0; i < 16; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const b = Array.from(bytes, (n) => n.toString(16).padStart(2, "0"));
  return `${b.slice(0, 4).join("")}-${b.slice(4, 6).join("")}-${b.slice(6, 8).join("")}-${b.slice(8, 10).join("")}-${b.slice(10, 16).join("")}`;
}
