import React, { useState } from 'react';
// eslint-disable-next-line import/extensions
import { Todo } from '../../types/Todo';

type Props = {
  addTodo: (todo: Omit<Todo, 'id'>) => void;
};

export const Header: React.FC<Props> = ({ addTodo }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    addTodo({
      userId: 0, // ID будет заменен сервером или родителем
      title: title.trim(),
      completed: false,
    });
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
