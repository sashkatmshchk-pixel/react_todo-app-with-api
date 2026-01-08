import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line import/extensions
import { Todo } from '../../types/Todo';

type Props = {
  addTodo: (todo: Omit<Todo, 'id'>) => Promise<void>; // Изменили тип на Promise
  showError: (error: string) => void;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({ addTodo, showError, isLoading }) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      // Убрали setTitle('') отсюда! Очищаем только при успехе.
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!title.trim()) {
      showError('Title should not be empty');
      return;
    }

    // Вызываем addTodo и ждем результат
    addTodo({
      userId: 0,
      title: title.trim(),
      completed: false,
    })
      .then(() => {
        setTitle(''); // Очищаем ТОЛЬКО если успешно
      })
      .catch(() => {
        // Если ошибка — ничего не делаем, текст остается в поле
        // Ошибку покажет ErrorMessage в App
      });
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          disabled={isLoading}
          ref={inputRef}
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