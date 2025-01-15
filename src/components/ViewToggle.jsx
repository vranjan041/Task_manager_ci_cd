import { Bars4Icon as ViewListIcon, CalendarIcon } from '@heroicons/react/24/outline';

function ViewToggle({ view, onViewChange }) {
  return (
    <div className="flex justify-center space-x-4">
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
          view === 'list'
            ? 'bg-primary-600 text-white'
            : 'bg-white text-primary-600 hover:bg-primary-50'
        }`}
      >
        <ViewListIcon className="h-5 w-5 mr-2" />
        List View
      </button>
      <button
        onClick={() => onViewChange('calendar')}
        className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
          view === 'calendar'
            ? 'bg-primary-600 text-white'
            : 'bg-white text-primary-600 hover:bg-primary-50'
        }`}
      >
        <CalendarIcon className="h-5 w-5 mr-2" />
        Calendar View
      </button>
    </div>
  );
}

export default ViewToggle;