/* eslint-disable import/extensions */
import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, deleteTodo, updateTodo } from './api/todos';
// eslint-disable-next-line import/extensions
import { Todo } from './types/Todo';
import { TodoList } from './components/todoList/TodoList';
import { Header } from './components/header/Header';
import { Footer } from './components/footer/Footer';
import { ErrorMessage } from './components/errorMessage/Error';

const USER_ID = 112233;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const handleAddTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
    const tempId = -1;
    const newTodo = { id: tempId, title, userId, completed };
    setTempTodo(newTodo);
    setProcessingIds(prev => [...prev, tempId]);

    addTodo(newTodo)
      .then((createdTodo) => {
        setTodos(current => [...current, createdTodo]);
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => id !== tempId));
      });
  };

  const handleDeleteTodo = (id: number) => {
    setProcessingIds(prev => [...prev, id]);
    deleteTodo(id)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(pId => pId !== id));
      });
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setProcessingIds(prev => [...prev, updatedTodo.id]);
    updateTodo(updatedTodo)
      .then((todoFromServer) => {
        setTodos(current =>
          current.map(todo => (todo.id === updatedTodo.id ? todoFromServer : todo))
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => id !== updatedTodo.id));
      });
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
  }, [todos, filter]);

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header 
          addTodo={(data) => handleAddTodo({ ...data, userId: USER_ID })} 
          showError={setErrorMessage}
          isLoading={!!tempTodo} // <-- Передаем статус загрузки (если есть tempTodo, значит грузим)
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todoList={filteredTodos}
            todoTemp={tempTodo}
            deleteTodo={handleDeleteTodo}
            updateTodo={handleUpdateTodo}
            processingIds={processingIds}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={() => {
               todos.filter(t => t.completed).forEach(t => handleDeleteTodo(t.id));
            }}
          />
        )}
      </div>

      <ErrorMessage 
        error={errorMessage} 
        hideError={() => setErrorMessage('')} 
      />
    </div>
  );
};