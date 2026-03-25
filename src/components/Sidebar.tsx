import { useEffect, useRef, useState } from "react";
import type { TodoList } from "../types";

interface SidebarProps {
  lists: TodoList[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function Sidebar({
  lists,
  selectedId,
  onSelect,
  onNew,
  onRename,
  onDelete,
  theme,
  onToggleTheme,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const startEdit = (list: TodoList, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(list.id);
    setEditingName(list.name);
  };

  const commitEdit = () => {
    if (editingId) {
      const trimmed = editingName.trim();
      if (trimmed) onRename(editingId, trimmed);
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditingId(null);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          TaskFlow
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title="Toggle theme"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
          <button className="new-list-btn" onClick={onNew}>
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
            New List
          </button>
        </div>
      </div>

      <div className="lists-section">
        {lists.length === 0 && (
          <div
            style={{
              padding: "16px 20px",
              color: "rgba(199,210,254,0.4)",
              fontSize: "0.82rem",
              textAlign: "center",
            }}
          >
            No lists yet. Create one!
          </div>
        )}
        {lists.map((list) => (
          <div
            key={list.id}
            className={`list-item${selectedId === list.id ? " active" : ""}`}
            onClick={() => onSelect(list.id)}
          >
            {editingId === list.id ? (
              <input
                ref={inputRef}
                className="list-item-name-input"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="list-item-name" title={list.name}>
                {list.name}
              </span>
            )}

            <span className="list-item-count">{list.items.length}</span>

            <div className="list-actions">
              <button
                className="icon-btn"
                onClick={(e) => startEdit(list, e)}
                title="Rename list"
                aria-label="Rename list"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                className="icon-btn danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(list.id);
                }}
                title="Delete list"
                aria-label="Delete list"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
