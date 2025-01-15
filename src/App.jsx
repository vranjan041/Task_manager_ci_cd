import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import CalendarView from './components/CalendarView';
import ViewToggle from './components/ViewToggle';
import Auth from './components/Auth';
import { useTodos } from './hooks/useTodos';

function App() {
  const [view, setView] = useState('list');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const { todos, fetchTodos } = useTodos(token);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        <Auth onAuth={setToken} />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-primary-900 animate-fade-in">
            Task Master
          </h1>
          <button
            onClick={() => setToken(null)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 animate-slide-in">
          <TodoForm onTodoAdded={fetchTodos} token={token} />
        </div>
        
        <ViewToggle view={view} onViewChange={setView} />

        <div className="mt-8 animate-slide-in">
          {view === 'list' ? (
            <TodoList todos={todos} onTodoDeleted={fetchTodos} token={token} />
          ) : (
            <CalendarView todos={todos} token={token} />
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App