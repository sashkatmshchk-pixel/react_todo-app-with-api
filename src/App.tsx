import React, { useEffect, useMemo, useState } from 'react';
import { Footer } from './components/footer/Footer';
import { ErrorMessage } from './components/errorMessage/Error';
import { Header } from './components/header/Header';
import { TodoList } from './components/todoList/TodoList';
// 
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 3217; // 

enum FILTERS {
  all = 'all',
  completed = 'completed',
  active = 'active',
}

enum ERROR {
  unableToLoad = 'Unable to load todos',
  unableToAdd = 'Unable to add a todo',
  unableToDelete = 'Unable to delete a todo',
  unableToUpdate = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState<ERROR | null>(null);
  const [shouldFocus, setShouldFocus] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  
  // !!!
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const filteredTodos = useMemo(() => {
    return todoList.filter(todo => {
      switch (filter) {
        case FILTERS.completed:
          return todo.completed === true;
        case FILTERS.active:
          return todo.completed === false;
        default:
          return true;
      }
    });
  }, [todoList, filter]);

  const completedTodos = useMemo(() => {
    return todoList.filter(todo => todo.completed === true);
  }, [todoList]);

  const unCompletedCount = useMemo(() => {
    return todoList.filter(todo => todo.completed === false).length;
  }, [todoList]);

  const isCompleted = useMemo(() => {
    if (todoList.length === 0) return false;
    return todoList.every(todo => todo.completed);
  }, [todoList]);

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodoList(data);
      })
      .catch(() => {
        setError(ERROR.unableToLoad);
      });
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }
    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleFilter = (query: string) => {
    setFilter(query);
  };

  const addPost = (title: string) => {
    setError(null);
    setShouldFocus(false);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title,
      completed: false,
    });

    return addTodo({ title, userId: USER_ID, completed: false })
      .then(newPost => {
        setTodoList(prevList => [...prevList, newPost]);
        setTempTodo(null);
        setShouldFocus(true);
      })
      .catch(() => {
        setError(ERROR.unableToAdd);
        setTempTodo(null);
        setShouldFocus(true);
        return Promise.reject();
      });
  };

  // !!! 
  const deletePost = (postId: number) => {
    setError(null);
    setProcessingIds(prev => [...prev, postId]); //

    return deleteTodo(postId)
      .then(() => {
        setTodoList(prevTodos => prevTodos.filter(todo => todo.id !== postId));
      })
      .catch(() => {
        setError(ERROR.unableToDelete);
        return Promise.reject();
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => id !== postId)); //
        setShouldFocus(true);
      });
  };

  // !!! 3. Оновлення тудушки
  const updatePost = (todoToUpdate: Todo) => {
    setError(null);
    setProcessingIds(prev => [...prev, todoToUpdate.id]);

    return updateTodo(todoToUpdate)
      .then(updatedTodo => {
        setTodoList(prevTodos =>
          prevTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setError(ERROR.unableToUpdate);
        return Promise.reject();
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => id !== todoToUpdate.id));
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoList={todoList}
          isCompletedTodo={isCompleted}
          addPost={addPost}
          setError={setError}
          shouldFocus={shouldFocus}
          // 
        />

        <TodoList
          todoList={filteredTodos}
          todoTemp={tempTodo}
          deleteTodo={deletePost}
          updateTodo={updatePost}
          // !!! 4. Передаємо лоадери
          processingIds={processingIds}
        />

        {todoList.length > 0 && (
          <Footer
            filter={handleFilter}
            unCompletedCount={unCompletedCount}
            completed={completedTodos}
            deleteAll={deletePost} //
          />
        )}
      </div>

      <ErrorMessage error={error} hideError={() => setError(null)} />
    </div>
  );
} 