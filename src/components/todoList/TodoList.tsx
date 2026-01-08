import React from 'react';
import { TodoItem } from '../todoItem/TodoItem';
// eslint-disable-next-line import/extensions
import { Todo } from '../../types/Todo';

type Props = {
  todoList: Todo[];
  todoTemp: Todo | null;
  deleteTodo: (id: number) => void;
  updateTodo: (todo: Todo) => void;
  processingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todoList,
  todoTemp,
  deleteTodo,
  updateTodo,
  processingIds,
}) => {
  return (
    <section className="todoapp__main">
      {todoList.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          isLoading={processingIds.includes(todo.id)}
        />
      ))}

      {todoTemp && (
        <TodoItem
          todo={todoTemp}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          isLoading={processingIds.includes(todoTemp.id)}
        />
      )}
    </section>
  );
};
