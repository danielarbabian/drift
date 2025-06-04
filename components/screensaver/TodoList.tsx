import { memo, useState, useCallback } from 'react';
import { Plus, X, CheckCircle2, Circle } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TodoListProps {
  showControls: boolean;
}

function TodoListComponent({ showControls }: TodoListProps) {
  const [todos, setTodos] = useLocalStorage<Todo[]>('screensaver-todos', []);
  const [newTodo, setNewTodo] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const addTodo = useCallback(() => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: Date.now(),
      };
      setTodos([...todos, todo]);
      setNewTodo('');
      setIsAddingTodo(false);
    }
  }, [newTodo, todos, setTodos]);

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
    [todos, setTodos]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos(todos.filter((todo) => todo.id !== id));
    },
    [todos, setTodos]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        addTodo();
      } else if (e.key === 'Escape') {
        setIsAddingTodo(false);
        setNewTodo('');
      }
    },
    [addTodo]
  );

  const pendingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="relative w-full h-full">
        <div className="absolute animate-orbit-offset">
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl px-6 py-6 shadow-2xl pointer-events-auto max-w-sm">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle2 className="text-blue-400 mr-2" size={20} />
                <span className="text-white/90 font-medium">Todo List</span>
              </div>

              {isAddingTodo ? (
                <div className="mb-4 space-y-3">
                  <Input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a task..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400/50 focus:ring-blue-400/25 rounded-xl"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={addTodo}
                      size="sm"
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white border-0 rounded-xl"
                    >
                      Add
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingTodo(false);
                        setNewTodo('');
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAddingTodo(true)}
                  variant="outline"
                  className="w-full mb-4 bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:text-white rounded-xl"
                >
                  <Plus className="mr-2" size={16} />
                  Add Task
                </Button>
              )}

              <div className="max-h-48 overflow-y-auto space-y-2 rounded-xl">
                {pendingTodos.length === 0 && completedTodos.length === 0 ? (
                  <div className="text-white/50 text-sm py-6">No tasks yet</div>
                ) : (
                  <>
                    {pendingTodos.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl group transition-colors"
                      >
                        <Button
                          onClick={() => toggleTodo(todo.id)}
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-white/60 hover:text-blue-400 hover:bg-transparent rounded-full"
                        >
                          <Circle size={16} />
                        </Button>
                        <span className="flex-1 text-left text-white/80 text-sm truncate">
                          {todo.text}
                        </span>
                        <Button
                          onClick={() => deleteTodo(todo.id)}
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 p-0 text-white/40 hover:text-red-400 hover:bg-transparent transition-all opacity-0 group-hover:opacity-100 rounded-full ${
                            showControls ? 'opacity-100' : ''
                          }`}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}

                    {completedTodos.length > 0 && pendingTodos.length > 0 && (
                      <div className="border-t border-white/10 pt-3 mt-3 rounded-t-xl">
                        <div className="text-white/50 text-xs mb-2 font-medium">
                          Completed ({completedTodos.length})
                        </div>
                      </div>
                    )}
                    {completedTodos.slice(0, 3).map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl group opacity-60 transition-colors"
                      >
                        <Button
                          onClick={() => toggleTodo(todo.id)}
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-green-400 hover:text-white/60 hover:bg-transparent rounded-full"
                        >
                          <CheckCircle2 size={16} />
                        </Button>
                        <span className="flex-1 text-left text-white/60 text-sm line-through truncate">
                          {todo.text}
                        </span>
                        <Button
                          onClick={() => deleteTodo(todo.id)}
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 p-0 text-white/40 hover:text-red-400 hover:bg-transparent transition-all opacity-0 group-hover:opacity-100 rounded-full ${
                            showControls ? 'opacity-100' : ''
                          }`}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {todos.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10 rounded-b-xl">
                  <div className="text-white/50 text-xs font-medium">
                    {pendingTodos.length} pending • {completedTodos.length}{' '}
                    completed
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const TodoList = memo(TodoListComponent);
