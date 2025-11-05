import { formatDate } from '../utils/dateUtils';

export const EventCard = ({ event, onMakeSwappable, onDelete }) => {
  const isSwappable = event.status === 'SWAPPABLE';
  const isPending = event.status === 'SWAP_PENDING';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
          {event.description && (
            <p className="text-sm text-gray-600 mt-2">{event.description}</p>
          )}
          <div className="mt-3 text-sm text-gray-600">
            <p>🕐 {formatDate(event.startTime)}</p>
            <p>🕐 {formatDate(event.endTime)}</p>
          </div>
          <div className="mt-3">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                isSwappable
                  ? 'bg-green-100 text-green-800'
                  : isPending
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {event.status}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {!isSwappable && !isPending && (
            <button
              onClick={() => onMakeSwappable(event._id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Make Swappable
            </button>
          )}
          <button
            onClick={() => onDelete(event._id)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};