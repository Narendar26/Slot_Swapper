import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Navbar } from '../components/Navbar';
import { swapService } from '../services/api';
import { formatDate } from '../utils/dateUtils';

export const Requests = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const [incoming, outgoing] = await Promise.all([
        swapService.getIncomingRequests(),
        swapService.getOutgoingRequests(),
      ]);
      
      // Filter out requests with missing data
      const validIncoming = incoming.data.data.filter(req => 
        req.requesterSlot && req.recipientSlot && req.requesterUser && req.recipientUser
      );
      const validOutgoing = outgoing.data.data.filter(req => 
        req.requesterSlot && req.recipientSlot && req.requesterUser && req.recipientUser
      );
      
      setIncomingRequests(validIncoming);
      setOutgoingRequests(validOutgoing);
    } catch (error) {
      toast.error('Error fetching requests');
      console.error('Fetch requests error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId, accept) => {
    setResponding(requestId);
    try {
      await swapService.respondToSwapRequest(requestId, accept);
      toast.success(accept ? 'Swap accepted! 🎉' : 'Swap rejected');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error responding to request');
    } finally {
      setResponding(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Swap Requests</h1>
          <p className="text-gray-600 mt-2">Manage your incoming and outgoing swap requests</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Incoming Requests */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📥 Incoming Requests
                <span className="ml-3 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {incomingRequests.length}
                </span>
              </h2>
              {incomingRequests.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">No incoming requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incomingRequests.map((request) => {
                    if (!request.requesterSlot || !request.recipientSlot) {
                      return null;
                    }
                    
                    return (
                      <div
                        key={request._id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                            <h3 className="font-semibold text-green-900 mb-2 text-sm uppercase tracking-wide">
                              ✅ What You'll Get
                            </h3>
                            <p className="text-lg font-medium text-gray-900">
                              {request.requesterSlot.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              📅 {formatDate(request.requesterSlot.startTime)}
                            </p>
                            <p className="text-sm text-gray-600">
                              📅 {formatDate(request.requesterSlot.endTime)}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              👤 From: <span className="font-semibold">{request.requesterUser?.name || 'Unknown'}</span>
                            </p>
                          </div>

                          <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                            <h3 className="font-semibold text-orange-900 mb-2 text-sm uppercase tracking-wide">
                              ⬅️ What You'll Give Up
                            </h3>
                            <p className="text-lg font-medium text-gray-900">
                              {request.recipientSlot.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              📅 {formatDate(request.recipientSlot.startTime)}
                            </p>
                            <p className="text-sm text-gray-600">
                              📅 {formatDate(request.recipientSlot.endTime)}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              👤 To: <span className="font-semibold">{request.requesterUser?.name || 'Unknown'}</span>
                            </p>
                          </div>
                        </div>

                        {request.status === 'PENDING' ? (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleRespond(request._id, true)}
                              disabled={responding === request._id}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 transition"
                            >
                              {responding === request._id ? 'Processing...' : '✓ Accept Trade'}
                            </button>
                            <button
                              onClick={() => handleRespond(request._id, false)}
                              disabled={responding === request._id}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 transition"
                            >
                              {responding === request._id ? 'Processing...' : '✗ Decline'}
                            </button>
                          </div>
                        ) : (
                          <div className={`text-center py-3 rounded-lg font-semibold ${
                            request.status === 'ACCEPTED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {request.status === 'ACCEPTED' ? '✓ Trade Accepted' : '✗ Trade Declined'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Outgoing Requests */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📤 Outgoing Requests
                <span className="ml-3 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {outgoingRequests.length}
                </span>
              </h2>
              {outgoingRequests.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">No outgoing requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {outgoingRequests.map((request) => {
                    if (!request.requesterSlot || !request.recipientSlot) {
                      return null;
                    }
                    
                    return (
                      <div
                        key={request._id}
                        className="bg-white rounded-lg shadow-md p-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                            <h3 className="font-semibold text-green-900 mb-2 text-sm uppercase tracking-wide">
                              ✅ What You'll Get
                            </h3>
                            <p className="text-lg font-medium text-gray-900">
                              {request.recipientSlot.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              📅 {formatDate(request.recipientSlot.startTime)}
                            </p>
                            <p className="text-sm text-gray-600">
                              📅 {formatDate(request.recipientSlot.endTime)}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              👤 From: <span className="font-semibold">{request.recipientUser?.name || 'Unknown'}</span>
                            </p>
                          </div>

                          <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                            <h3 className="font-semibold text-orange-900 mb-2 text-sm uppercase tracking-wide">
                              ⬅️ What You're Giving Up
                            </h3>
                            <p className="text-lg font-medium text-gray-900">
                              {request.requesterSlot.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              📅 {formatDate(request.requesterSlot.startTime)}
                            </p>
                            <p className="text-sm text-gray-600">
                              📅 {formatDate(request.requesterSlot.endTime)}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              👤 To: <span className="font-semibold">{request.recipientUser?.name || 'Unknown'}</span>
                            </p>
                          </div>
                        </div>

                        <div className={`text-center py-3 rounded-lg font-semibold ${
                          request.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'ACCEPTED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status === 'PENDING' && '⏳ Waiting for Response'}
                          {request.status === 'ACCEPTED' && '✓ Trade Accepted'}
                          {request.status === 'REJECTED' && '✗ Trade Declined'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};