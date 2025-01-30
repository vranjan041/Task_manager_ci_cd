import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const priorityOrder = {
  high: 1,
  medium: 2,
  low: 3,
};

const PORT = 5000;

export const useTodos = (token) => {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:${PORT}/api/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      const sortedTodos = data.sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      setTodos(sortedTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const checkUpcomingTasks = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:${PORT}/api/todos/upcoming`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const upcomingTodos = await response.json();

      upcomingTodos.forEach((todo) => {
        const deadline = new Date(todo.deadline);
        toast.warning(
          `Upcoming Task: ${todo.title}\nDue: ${deadline.toLocaleString()}`,
          {
            position: "top-right",
            autoClose: 8000,
          }
        );
      });
    } catch (error) {
      console.error("Error checking upcoming tasks:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTodos();
      checkUpcomingTasks();

      // Check for upcoming tasks every 15 minutes
      const interval = setInterval(checkUpcomingTasks, 15 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [token]);

  return { todos, fetchTodos };
};

export const checkHighPriorityTasks = (todos) => {
  const highPriorityTodos = todos.filter(
    (todo) =>
      todo.priority === "high" &&
      !todo.completed &&
      new Date(todo.deadline) > new Date()
  );

  highPriorityTodos.forEach((todo) => {
    toast.warning(`High Priority Task Alert: ${todo.title}`, {
      position: "top-right",
      autoClose: PORT,
    });
  });
};
