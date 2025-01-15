import { TrashIcon, PaperClipIcon } from '@heroicons/react/24/outline';

function TodoItem({ todo, onDelete }) {
  const priorityClasses = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  const handleFileDownload = (todoId, fileIndex) => {
    window.open(`http://localhost:5000/api/todos/files/${todoId}/${fileIndex}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-800">{todo.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityClasses[todo.priority]}`}>
              {todo.priority}
            </span>
          </div>
          <button
            onClick={() => onDelete(todo._id)}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
        
        {todo.description && (
          <p className="mt-2 text-gray-600">{todo.description}</p>
        )}
        
        {todo.notes && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Notes:</span> {todo.notes}
            </p>
          </div>
        )}

        {todo.attachments && todo.attachments.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h4>
            <div className="space-y-2">
              {todo.attachments.map((file, index) => (
                <button
                  key={index}
                  onClick={() => handleFileDownload(todo._id, index)}
                  className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  <PaperClipIcon className="h-4 w-4" />
                  <span>{file.filename}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-3 text-sm text-gray-500">
          <span className="font-medium">Deadline:</span>{' '}
          {new Date(todo.deadline).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default TodoItem;