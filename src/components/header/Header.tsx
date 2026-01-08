import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/extensions
import { Todo } from '../../types/Todo';

type Props = {
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  showError: (error: string) => void;
  isLoading: boolean; // 1. Добавляем новый проп
};

export const Header: React.FC<Props> = ({ addTodo, showError, isLoading }) => {
  const [title, setTitle] = useState('');

  // 2. Если загрузка закончилась (успешно), очищаем поле
  useEffect(() => {
    if (!isLoading) {
      setTitle('');
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
    // setTitle('') убрали отсюда, теперь это делает useEffect после успеха
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          disabled={isLoading} // 3. Блокируем поле при загрузке
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