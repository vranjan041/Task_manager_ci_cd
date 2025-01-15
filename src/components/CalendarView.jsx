import { useState } from 'react';
import Calendar from 'react-calendar';
import TodoList from './TodoList';
import 'react-calendar/dist/Calendar.css';

function CalendarView({ todos, token }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateTodos, setSelectedDateTodos] = useState([]);

  const getTodosByDate = (date) => {
    return todos.filter(todo => {
      const todoDate = new Date(todo.deadline);
      return (
        todoDate.getDate() === date.getDate() &&
        todoDate.getMonth() === date.getMonth() &&
        todoDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleDateClick = async (date) => {
    setSelectedDate(date);
    try {
      const response = await fetch(`http://localhost:5000/api/todos/date/${date.toISOString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSelectedDateTodos(data);
    } catch (error) {
      console.error('Error fetching todos for date:', error);
    }
  };

  const tileContent = ({ date }) => {
    const todosForDate = getTodosByDate(date);
    if (todosForDate.length === 0) return null;

    return (
      <div className="text-xs mt-1">
        {todosForDate.map(todo => (
          <div
            key={todo._id}
            className={`px-1 py-0.5 rounded mb-0.5 truncate ${
              todo.priority === 'high' 
                ? 'bg-red-100 text-red-800'
                : todo.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {todo.title}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <Calendar
          onChange={handleDateClick}
          value={selectedDate}
          tileContent={tileContent}
          className="custom-calendar"
        />
      </div>

      {selectedDate && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Tasks for {selectedDate.toLocaleDateString()}
          </h2>
          <TodoList todos={selectedDateTodos} token={token} />
        </div>
      )}
    </div>
  );
}

export default CalendarView;