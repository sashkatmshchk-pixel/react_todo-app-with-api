import React from 'react';
import classNames from 'classnames';

type Props = {
  activeCount: number;
  completedCount: number;
  filter: string;
  onFilterChange: (filter: string) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeCount,
  completedCount,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCount">
        {activeCount} items left
      </span>

      <nav className="filter">
        <a
          data-cy="FilterLink"
          href="#/"
          className={classNames('filter__link', { selected: filter === 'all' })}
          onClick={() => onFilterChange('all')}
        >
          All
        </a>

        <a
          data-cy="FilterLink"
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'active',
          })}
          onClick={() => onFilterChange('active')}
        >
          Active
        </a>

        <a
          data-cy="FilterLink"
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'completed',
          })}
          onClick={() => onFilterChange('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
