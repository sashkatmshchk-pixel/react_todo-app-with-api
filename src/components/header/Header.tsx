import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line import/extensions
import { Todo } from '../../types/Todo';

type Props = {
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  showError: (error: string) => void;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({ addTodo, showError, isLoading }) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null); // 1. Создаем ссылку на элемент

  useEffect(() => {
    if (!isLoading) {
      setTitle('');
      // 2. Когда загрузка закончилась, возвращаем фокус в поле
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!title.trim()) {
      showError('Title should not be empty');
      return;
    }

    addTodo({
      userId: 0,
      title: title.trim(),
      completed: false,
    });
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          disabled={isLoading}
          ref={inputRef} // 3. Привязываем ссылку к input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          autoFocus
        />
      </form>
    </header>
  );
};