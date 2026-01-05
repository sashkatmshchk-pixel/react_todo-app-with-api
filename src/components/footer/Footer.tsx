import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  filter: (filter: string) => void;
  unCompletedCount: number;
  completed: Todo[];
  deleteAll: (id: number) => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  unCompletedCount,
  completed,
  deleteAll,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {unCompletedCount} items left
      </span>

      <nav className="filter">
        <a href="#/" className="filter__link selected" onClick={() => filter('all')}>All</a>
        <a href="#/active" className="filter__link" onClick={() => filter('active')}>Active</a>
        <a href="#/completed" className="filter__link" onClick={() => filter('completed')}>Completed</a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        // Тут має бути логіка видалення всіх виконаних
        onClick={() => completed.forEach(todo => deleteAll(todo.id))}
        disabled={completed.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};