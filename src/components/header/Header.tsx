import React, { useState, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todoList: Todo[];
  isCompletedTodo: boolean;
  addPost: (title: string) => Promise<void>;
  setError: (error: any) => void;
  shouldFocus: boolean;
  updatePost?: (todo: Todo) => Promise<void>;
};

export const Header: React.FC<Props> = ({
  addPost,
  shouldFocus,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldFocus]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      return; // Можна додати помилку "Title can't be empty"
    }

    addPost(title)
      .then(() => setTitle(''))
      .catch(() => {
         // Помилка обробляється в addPost в App.tsx
      });
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={!shouldFocus}
        />
      </form>
    </header>
  );
};