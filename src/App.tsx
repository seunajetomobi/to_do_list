import { useState, useCallback } from 'react';
import type { TodoList, TodoItem } from './types';
import { loadLists, saveLists, uuid } from './utils/storage';
import Sidebar from './components/Sidebar';
import TodoCard from './components/TodoCard';

function useLists() {
  const [lists, setLists] = useState<TodoList[]>(loadLists);

  const update = useCallback((next: TodoList[]) => {
    setLists(next);
    saveLists(next);
  }, []);

  const createList = useCallback(() => {
    const newList: TodoList = {
      id: uuid(),
      name: 'New List',
      items: [],
      createdAt: Date.now(),
    };
    const next = [...lists, newList];
    update(next);
    return newList.id;
  }, [lists, update]);

  const deleteList = useCallback((id: string) => {
    update(lists.filter((l) => l.id !== id));
  }, [lists, update]);

  const renameList = useCallback((id: string, name: string) => {
    update(lists.map((l) => (l.id === id ? { ...l, name } : l)));
  }, [lists, update]);

  const addItem = useCallback((listId: string, title: string) => {
    const item: TodoItem = { id: uuid(), title, done: false, comment: '', createdAt: Date.now() };
    update(lists.map((l) => l.id === listId ? { ...l, items: [...l.items, item] } : l));
  }, [lists, update]);

  const deleteItem = useCallback((listId: string, itemId: string) => {
    update(lists.map((l) => l.id === listId ? { ...l, items: l.items.filter((i) => i.id !== itemId) } : l));
  }, [lists, update]);

  const toggleItem = useCallback((listId: string, itemId: string) => {
    update(lists.map((l) => l.id === listId
      ? { ...l, items: l.items.map((i) => i.id === itemId ? { ...i, done: !i.done } : i) }
      : l));
  }, [lists, update]);

  const updateComment = useCallback((listId: string, itemId: string, comment: string) => {
    update(lists.map((l) => l.id === listId
      ? { ...l, items: l.items.map((i) => i.id === itemId ? { ...i, comment } : i) }
      : l));
  }, [lists, update]);

  return { lists, createList, deleteList, renameList, addItem, deleteItem, toggleItem, updateComment };
}

export default function App() {
  const { lists, createList, deleteList, renameList, addItem, deleteItem, toggleItem, updateComment } = useLists();
  const [selectedId, setSelectedId] = useState<string | null>(lists[0]?.id ?? null);
  const [newItemTitle, setNewItemTitle] = useState('');

  const selectedList = lists.find((l) => l.id === selectedId) ?? null;

  const handleNewList = () => {
    const id = createList();
    setSelectedId(id);
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
    addItem(selectedId, title);
    setNewItemTitle('');
  };

  const doneCount = selectedList?.items.filter((i) => i.done).length ?? 0;
  const totalCount = selectedList?.items.length ?? 0;

  return (
    <>
      <Sidebar
        lists={lists}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onNew={handleNewList}
        onRename={renameList}
        onDelete={handleDeleteList}
      />

      <main className="main">
        {selectedList ? (
          <>
            <div className="main-header">
              <h1>{selectedList.name}</h1>
              {totalCount > 0 && (
                <span className="main-header-subtitle">
                  {doneCount} / {totalCount} done
                </span>
              )}
            </div>

            <form className="add-item-form" onSubmit={handleAddItem}>
              <input
                className="add-item-input"
                placeholder="Add a new task…"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                aria-label="New task title"
              />
              <button type="submit" className="add-item-btn" disabled={!newItemTitle.trim()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Task
              </button>
            </form>

            <div className="items-container">
              {selectedList.items.length === 0 ? (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <p>No tasks yet. Add your first task above!</p>
                </div>
              ) : (
                selectedList.items.map((item) => (
                  <TodoCard
                    key={item.id}
                    item={item}
                    onToggleDone={(id) => toggleItem(selectedList.id, id)}
                    onDelete={(id) => deleteItem(selectedList.id, id)}
                    onCommentChange={(id, html) => updateComment(selectedList.id, id, html)}
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <div className="welcome">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <h2>Welcome to TaskFlow</h2>
            <p>Create your first list using the <strong>New List</strong> button in the sidebar.</p>
          </div>
        )}
      </main>
    </>
  );
}
