import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">🔄 SlotSwapper</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  📅 Dashboard
                </Link>
                <Link
                  to="/marketplace"
                  className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  🛒 Marketplace
                </Link>
                <Link
                  to="/requests"
                  className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  📬 Requests
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 font-medium">
              👤 {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};