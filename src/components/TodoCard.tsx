import { Suspense, lazy, useState } from "react";
import type { TodoItem } from "../types";
const RichTextEditor = lazy(() => import("./RichTextEditor"));

interface TodoCardProps {
  item: TodoItem;
  onToggleDone: (id: string) => void;
  onDelete: (id: string) => void;
  onCommentChange: (id: string, html: string) => void;
  onRename: (id: string, title: string) => void;
  onToggleSelectForDelete: (id: string) => void;
  selectedForDelete: boolean;
}

export default function TodoCard({
  item,
  onToggleDone,
  onDelete,
  onCommentChange,
  onRename,
  onToggleSelectForDelete,
  selectedForDelete,
}: TodoCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(item.title);

  const commitRename = () => {
    const trimmed = titleDraft.trim();
    if (!trimmed) {
      setTitleDraft(item.title);
      setIsEditingTitle(false);
      return;
    }
    if (trimmed !== item.title) {
      onRename(item.id, trimmed);
    }
    setIsEditingTitle(false);
  };

  const priorityLabel =
    item.priority.charAt(0).toUpperCase() + item.priority.slice(1);

  return (
    <div className={`todo-card${item.done ? " done" : ""}`}>
      <div className="todo-card-header">
        <button
          className={`check-btn${item.done ? " checked" : ""}`}
          onClick={() => onToggleDone(item.id)}
          title={item.done ? "Mark as Not Done" : "Mark as Done"}
          aria-label={item.done ? "Mark as not done" : "Mark as done"}
        >
          {item.done && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        <label
          className={`delete-select-label${selectedForDelete ? " selected" : ""}`}
          title="Select task for bulk actions"
        >
          <input
            type="checkbox"
            checked={selectedForDelete}
            onChange={() => onToggleSelectForDelete(item.id)}
            aria-label="Select task for bulk actions"
          />
          Select
        </label>

        {isEditingTitle ? (
          <input
            className="todo-title-input"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") {
                setTitleDraft(item.title);
                setIsEditingTitle(false);
              }
            }}
            autoFocus
          />
        ) : (
          <span className="todo-title">{item.title}</span>
        )}

        <span className={`priority-badge ${item.priority}`}>
          {priorityLabel}
        </span>
        {item.dueDate && (
          <span className="due-date-badge">Due {item.dueDate}</span>
        )}

        {item.done && <span className="done-badge">Done</span>}

        <div className="card-actions">
          <button
            className="icon-btn"
            onClick={() => {
              setTitleDraft(item.title);
              setIsEditingTitle(true);
            }}
            title="Edit title"
            aria-label="Edit title"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </button>
          <button
            className="icon-btn danger"
            onClick={() => onDelete(item.id)}
            title="Delete item"
            aria-label="Delete item"
          >
            <svg
              width="14"
              height="14"
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

      <div className="todo-card-body">
        <button
          className="toggle-comments-btn"
          onClick={() => setShowComments((v) => !v)}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {showComments ? (
              <path d="M18 15l-6-6-6 6" />
            ) : (
              <path d="M6 9l6 6 6-6" />
            )}
          </svg>
          {showComments ? "Hide comments" : "Show comments"}
        </button>

        {showComments && (
          <div style={{ marginTop: 10 }}>
            <div className="comments-label">Comments</div>
            <Suspense
              fallback={
                <div>
                  <div className="comments-label">Comments</div>
                  <div className="skeleton" style={{ marginTop: 8 }} />
                </div>
              }
            >
              <RichTextEditor
                content={item.comment}
                onChange={(html) => onCommentChange(item.id, html)}
                placeholder="Add notes, links, or any details…"
              />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
