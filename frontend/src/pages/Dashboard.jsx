import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Navbar } from '../components/Navbar';
import { EventCard } from '../components/EventCard';
import { CreateEventModal } from '../components/CreateEventModal';
import { eventService } from '../services/api';

export const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventService.getMyEvents();
      setEvents(response.data.data);
    } catch (error) {
      toast.error('Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeSwappable = async (eventId) => {
    try {
      await eventService.updateEventStatus(eventId, 'SWAPPABLE');
      toast.success('Event marked as swappable! ✨');
      fetchEvents();
    } catch (error) {
      toast.error('Error updating event');
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(eventId);
        toast.success('Event deleted successfully');
        fetchEvents();
      } catch (error) {
        toast.error('Error deleting event');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Calendar</h1>
            <p className="text-gray-600 mt-2">Manage your events and swap slots</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition transform hover:scale-105"
          >
            ➕ Create Event
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-600 text-lg mb-6">Create your first event to get started!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Create Event
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onMakeSwappable={handleMakeSwappable}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={fetchEvents}
      />
    </div>
  );
};