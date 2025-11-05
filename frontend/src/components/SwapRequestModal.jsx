import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { swapService, eventService } from '../services/api';
import { formatDate } from '../utils/dateUtils';

export const SwapRequestModal = ({ isOpen, onClose, theirSlot, onSwapRequested }) => {
  const [mySlots, setMySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMySwappableSlots();
    }
  }, [isOpen]);

  const fetchMySwappableSlots = async () => {
    try {
      const response = await eventService.getMyEvents();
      const swappable = response.data.data.filter((e) => e.status === 'SWAPPABLE');
      setMySlots(swappable);
      if (swappable.length > 0) {
        setSelectedSlot(swappable[0]._id);
      }
    } catch (error) {
      toast.error('Error fetching your slots');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      toast.error('Please select a slot');
      return;
    }

    setSubmitting(true);
    try {
      await swapService.requestSwap({
        mySlotId: selectedSlot,
        theirSlotId: theirSlot._id,
      });
      toast.success('Swap request sent! 🎉');
      onSwapRequested();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending swap request');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Request Swap</h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : mySlots.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">You don't have any swappable slots</p>
            <p className="text-gray-500 text-sm mt-2">Mark some events as swappable first!</p>
            <button
              onClick={onClose}
              className="mt-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Their Slot:</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-medium text-lg">{theirSlot.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(theirSlot.startTime)} - {formatDate(theirSlot.endTime)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Owner: {theirSlot.owner.name}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Slot (Select one to offer):
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {mySlots.map((slot) => (
                  <option key={slot._id} value={slot._id}>
                    {slot.title} - {formatDate(slot.startTime)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 transition"
              >
                {submitting ? 'Sending...' : 'Send Request'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};