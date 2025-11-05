import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Navbar } from '../components/Navbar';
import { SwapRequestModal } from '../components/SwapRequestModal';
import { swapService } from '../services/api';
import { formatDate } from '../utils/dateUtils';

export const Marketplace = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSwappableSlots();
  }, []);

  const fetchSwappableSlots = async () => {
    try {
      const response = await swapService.getSwappableSlots();
      setSlots(response.data.data);
    } catch (error) {
      toast.error('Error fetching swappable slots');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = (slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-2">Browse and request available time slots</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : slots.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No swappable slots available</h3>
            <p className="text-gray-600 text-lg">Check back later for available time slots!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot) => (
              <div
                key={slot._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {slot.title}
                  </h3>
                  {slot.description && (
                    <p className="text-sm text-gray-600 mb-3">{slot.description}</p>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">📅 Start:</span> {formatDate(slot.startTime)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">📅 End:</span> {formatDate(slot.endTime)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">👤 Owner:</span> {slot.owner.name}
                  </p>
                </div>
                
                <button
                  onClick={() => handleRequestSwap(slot)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
                >
                  Request Swap 🔄
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSlot && (
        <SwapRequestModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSlot(null);
          }}
          theirSlot={selectedSlot}
          onSwapRequested={fetchSwappableSlots}
        />
      )}
    </div>
  );
};