import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import TodoCard from "./components/TodoCard";
import ToolsPanel from "./components/ToolsPanel";
import type { TodoItem, TodoList, TodoPriority } from "./types";
import {
  loadLists,
  loadTheme,
  saveLists,
  saveTheme,
  uuid,
} from "./utils/storage";

const PRIORITY_WEIGHT: Record<TodoPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

function useLists() {
  const [lists, setLists] = useState<TodoList[]>(loadLists);

  const update = useCallback((next: TodoList[]) => {
    setLists(next);
    saveLists(next);
  }, []);

  const createList = useCallback(() => {
    const newList: TodoList = {
      id: uuid(),
      name: "New List",
      items: [],
      createdAt: Date.now(),
    };
    const next = [...lists, newList];
    update(next);
    return newList.id;
  }, [lists, update]);

  const deleteList = useCallback(
    (id: string) => {
      update(lists.filter((l) => l.id !== id));
    },
    [lists, update],
  );

  const renameList = useCallback(
    (id: string, name: string) => {
      update(lists.map((l) => (l.id === id ? { ...l, name } : l)));
    },
    [lists, update],
  );

  const addItem = useCallback(
    (
      listId: string,
      title: string,
      priority: TodoPriority,
      dueDate: string | null,
    ) => {
      const item: TodoItem = {
        id: uuid(),
        title,
        done: false,
        comment: "",
        priority,
        dueDate,
        createdAt: Date.now(),
      };
      update(
        lists.map((l) =>
          l.id === listId ? { ...l, items: [...l.items, item] } : l,
        ),
      );
    },
    [lists, update],
  );

  const deleteItem = useCallback(
    (listId: string, itemId: string) => {
      update(
        lists.map((l) =>
          l.id === listId
            ? { ...l, items: l.items.filter((i) => i.id !== itemId) }
            : l,
        ),
      );
    },
    [lists, update],
  );

  const deleteManyItems = useCallback(
    (listId: string, itemIds: string[]) => {
      const selected = new Set(itemIds);
      update(
        lists.map((l) =>
          l.id === listId
            ? { ...l, items: l.items.filter((i) => !selected.has(i.id)) }
            : l,
        ),
      );
    },
    [lists, update],
  );

  const toggleItem = useCallback(
    (listId: string, itemId: string) => {
      update(
        lists.map((l) =>
          l.id === listId
            ? {
                ...l,
                items: l.items.map((i) =>
                  i.id === itemId ? { ...i, done: !i.done } : i,
                ),
              }
            : l,
        ),
      );
    },
    [lists, update],
  );

  const updateComment = useCallback(
    (listId: string, itemId: string, comment: string) => {
      update(
        lists.map((l) =>
          l.id === listId
            ? {
                ...l,
                items: l.items.map((i) =>
                  i.id === itemId ? { ...i, comment } : i,
                ),
              }
            : l,
        ),
      );
    },
    [lists, update],
  );

  const renameItem = useCallback(
    (listId: string, itemId: string, title: string) => {
      update(
        lists.map((l) =>
          l.id === listId
            ? {
                ...l,
                items: l.items.map((i) =>
                  i.id === itemId ? { ...i, title } : i,
                ),
              }
            : l,
        ),
      );
    },
    [lists, update],
  );

  const clearCompleted = useCallback(
    (listId: string) => {
      update(
        lists.map((l) =>
          l.id === listId ? { ...l, items: l.items.filter((i) => !i.done) } : l,
        ),
      );
    },
    [lists, update],
  );

  const toggleAll = useCallback(
    (listId: string, done: boolean) => {
      update(
        lists.map((l) =>
          l.id === listId
            ? { ...l, items: l.items.map((i) => ({ ...i, done })) }
            : l,
        ),
      );
    },
    [lists, update],
  );

  return {
    lists,
    createList,
    deleteList,
    renameList,
    addItem,
    deleteItem,
    deleteManyItems,
    toggleItem,
    updateComment,
    renameItem,
    clearCompleted,
    toggleAll,
  };
}

export default function App() {
  const {
    lists,
    createList,
    deleteList,
    renameList,
    addItem,
    deleteItem,
    deleteManyItems,
    toggleItem,
    updateComment,
    renameItem,
  } = useLists();
  const [selectedId, setSelectedId] = useState<string | null>(
    lists[0]?.id ?? null,
  );
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemPriority, setNewItemPriority] =
    useState<TodoPriority>("medium");
  const [newItemDueDate, setNewItemDueDate] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(loadTheme());
  const [showTools, setShowTools] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "createdDesc" | "createdAsc" | "priority" | "dueDate"
  >("createdDesc");

  const selectedList = lists.find((l) => l.id === selectedId) ?? null;

  useEffect(() => {
    // apply theme class to document
    try {
      const root = document.documentElement;
      if (theme === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    } catch {}
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    // avoid synchronous setState inside effect to prevent cascading renders
    const t = setTimeout(() => setSelectedForDelete([]), 0);
    return () => clearTimeout(t);
  }, [selectedId]);

  useEffect(() => {
    if (!selectedList) return;
    const validIds = new Set(selectedList.items.map((item) => item.id));
    const t = setTimeout(() => {
      setSelectedForDelete((current) =>
        current.filter((id) => validIds.has(id)),
      );
    }, 0);
    return () => clearTimeout(t);
  }, [selectedList]);

  const handleNewList = () => {
    const id = createList();
    setSelectedId(id);
    setIsNavOpen(false);
  };

  const handleSelectList = (id: string) => {
    setSelectedId(id);
    setIsNavOpen(false);
  };

  const handleDeleteList = (id: string) => {
    deleteList(id);
    if (selectedId === id) {
      const remaining = lists.filter((l) => l.id !== id);
      setSelectedId(remaining[0]?.id ?? null);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newItemTitle.trim();
    if (!title || !selectedId) return;
    addItem(selectedId, title, newItemPriority, newItemDueDate || null);
    setNewItemTitle("");
    setNewItemDueDate("");
    setNewItemPriority("medium");
  };

  const handleToggleSelectForDelete = (itemId: string) => {
    setSelectedForDelete((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId],
    );
  };

  const handleDeleteSelected = () => {
    if (!selectedId || selectedForDelete.length === 0) return;
    deleteManyItems(selectedId, selectedForDelete);
    setSelectedForDelete([]);
  };

  const visibleItems = useMemo(() => {
    if (!selectedList) return [];
    const normalizedQuery = query.trim().toLowerCase();

    return selectedList.items
      .filter((item) => {
        if (!normalizedQuery) return true;
        return item.title.toLowerCase().includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (sortBy === "createdAsc") return a.createdAt - b.createdAt;
        if (sortBy === "priority")
          return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
        if (sortBy === "dueDate") {
          if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        return b.createdAt - a.createdAt;
      });
  }, [query, selectedList, sortBy]);

  const completedCount = selectedList?.items.filter((i) => i.done).length ?? 0;
  // activeCount intentionally omitted (UI simplified)
  const selectedVisibleCount = visibleItems.filter((item) =>
    selectedForDelete.includes(item.id),
  ).length;

  const doneCount = selectedList?.items.filter((i) => i.done).length ?? 0;
  const totalCount = selectedList?.items.length ?? 0;

  return (
    <>
      {/* debug banner removed for production */}
      <div className="app-shell">
        <div className={`sidebar-drawer${isNavOpen ? " open" : ""}`}>
          <Sidebar
            lists={lists}
            selectedId={selectedId}
            onSelect={handleSelectList}
            onNew={handleNewList}
            onRename={renameList}
            onDelete={handleDeleteList}
            theme={theme}
            onToggleTheme={() =>
              setTheme((t) => (t === "dark" ? "light" : "dark"))
            }
          />
        </div>
        <button
          type="button"
          className="drawer-backdrop"
          aria-label="Close sidebar"
          onClick={() => setIsNavOpen(false)}
        />

        <main className="main">
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setIsNavOpen(true)}
            aria-label="Open sidebar"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            Lists
          </button>

          {selectedList ? (
            <>
              <div className="main-header">
                <h1>{selectedList.name}</h1>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    className="tool-btn"
                    onClick={() => setShowTools((s) => !s)}
                  >
                    Tools
                  </button>
                </div>
                {totalCount > 0 && (
                  <span className="main-header-subtitle">
                    {doneCount} / {totalCount} done
                  </span>
                )}
              </div>

              {showTools && <ToolsPanel />}

              <form className="add-item-form" onSubmit={handleAddItem}>
                <input
                  className="add-item-input"
                  placeholder="Add a new task…"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  aria-label="New task title"
                />
                <select
                  className="task-meta-select"
                  value={newItemPriority}
                  onChange={(e) =>
                    setNewItemPriority(e.target.value as TodoPriority)
                  }
                  aria-label="Task priority"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <input
                  type="date"
                  className="task-date-input"
                  value={newItemDueDate}
                  onChange={(e) => setNewItemDueDate(e.target.value)}
                  aria-label="Task due date"
                />
                <button
                  type="submit"
                  className="add-item-btn"
                  disabled={!newItemTitle.trim()}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Task
                </button>
              </form>

              <div className="task-tools">
                <div className="task-tools-row">
                  <input
                    className="task-search-input"
                    placeholder="Search tasks..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search tasks"
                  />

                  <select
                    className="task-tools-select"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                          | "createdDesc"
                          | "createdAsc"
                          | "priority"
                          | "dueDate",
                      )
                    }
                    aria-label="Sort tasks"
                  >
                    <option value="createdDesc">Newest first</option>
                    <option value="createdAsc">Oldest first</option>
                    <option value="priority">Priority</option>
                    <option value="dueDate">Due date</option>
                  </select>
                </div>

                <div className="task-tools-row actions">
                  <p className="task-tools-hint">
                    Tip: Select tasks using each card checkbox, then use Delete
                    Selected.
                  </p>
                  <div className="task-controls">
                    <div className="task-summary">
                      <span>{completedCount} completed</span>
                      <span>{selectedVisibleCount} selected</span>
                    </div>
                    {/* Select Visible removed per request */}
                    <button
                      type="button"
                      className="tool-btn"
                      onClick={() => setSelectedForDelete([])}
                    >
                      Clear Selection
                    </button>
                    <button
                      type="button"
                      className="tool-btn danger"
                      onClick={handleDeleteSelected}
                      disabled={selectedForDelete.length === 0}
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
              </div>

              <div className="items-container">
                {selectedList.items.length === 0 ? (
                  <div className="empty-state">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    <p>No tasks yet. Add your first task above!</p>
                  </div>
                ) : visibleItems.length === 0 ? (
                  <div className="empty-state">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <p>No tasks match your current filters.</p>
                  </div>
                ) : (
                  visibleItems.map((item) => (
                    <TodoCard
                      key={item.id}
                      item={item}
                      onToggleDone={(id) => toggleItem(selectedList.id, id)}
                      onDelete={(id) => {
                        deleteItem(selectedList.id, id);
                        setSelectedForDelete((current) =>
                          current.filter(
                            (selectedItemId) => selectedItemId !== id,
                          ),
                        );
                      }}
                      onCommentChange={(id, html) =>
                        updateComment(selectedList.id, id, html)
                      }
                      onRename={(id, title) =>
                        renameItem(selectedList.id, id, title)
                      }
                      onToggleSelectForDelete={handleToggleSelectForDelete}
                      selectedForDelete={selectedForDelete.includes(item.id)}
                    />
                  ))
                )}
              </div>

              <footer className="builder-credit">
                Built by <strong>Seun Ajetomobi</strong>.
                <a
                  href="https://github.com/seunajetomobi"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/seunajetomobi
                </a>
              </footer>
            </>
          ) : (
            <div className="welcome">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <h2>Welcome to TaskFlow</h2>
              <p>
                Create your first list using the <strong>New List</strong>{" "}
                button in the sidebar, then add your first task with title,
                priority, and due date.
              </p>
              <h3>Welcome to Seun Ajetomobi todo list project</h3>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
