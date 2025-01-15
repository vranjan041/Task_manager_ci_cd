import TodoItem from './TodoItem';

function TodoList({ todos, onTodoDeleted, token }) {
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      onTodoDeleted();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No tasks yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map(todo => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default TodoList;