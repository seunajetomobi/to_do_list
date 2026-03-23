import { useState } from 'react';
import type { TodoItem } from '../types';
import RichTextEditor from './RichTextEditor';

interface TodoCardProps {
  item: TodoItem;
  onToggleDone: (id: string) => void;
  onDelete: (id: string) => void;
  onCommentChange: (id: string, html: string) => void;
}

export default function TodoCard({ item, onToggleDone, onDelete, onCommentChange }: TodoCardProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className={`todo-card${item.done ? ' done' : ''}`}>
      <div className="todo-card-header">
        <button
          className={`check-btn${item.done ? ' checked' : ''}`}
          onClick={() => onToggleDone(item.id)}
          title={item.done ? 'Mark as Not Done' : 'Mark as Done'}
          aria-label={item.done ? 'Mark as not done' : 'Mark as done'}
        >
          {item.done && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <span className="todo-title">{item.title}</span>

        {item.done && <span className="done-badge">Done</span>}

        <div className="card-actions">
          <button
            className="icon-btn danger"
            onClick={() => onDelete(item.id)}
            title="Delete item"
            aria-label="Delete item"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {showComments
              ? <path d="M18 15l-6-6-6 6" />
              : <path d="M6 9l6 6 6-6" />}
          </svg>
          {showComments ? 'Hide comments' : 'Show comments'}
        </button>

        {showComments && (
          <div style={{ marginTop: 10 }}>
            <div className="comments-label">Comments</div>
            <RichTextEditor
              content={item.comment}
              onChange={(html) => onCommentChange(item.id, html)}
              placeholder="Add notes, links, or any details…"
            />
          </div>
        )}
      </div>
    </div>
  );
}
