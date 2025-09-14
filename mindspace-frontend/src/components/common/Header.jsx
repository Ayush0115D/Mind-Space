import React from 'react';
import { Moon, LogOut } from 'lucide-react';

const Header = ({ onLogout }) => {
  const handleLogout = () => {
    // Clear stored auth info
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Call parent handler if passed
    if (onLogout) onLogout();
  };

  return (
    <header className="bg-gray-900/90 backdrop-blur-sm shadow-2xl border-b border-gray-700/50 sticky top-0 z-50">
      <div className="w-full px-8 sm:px-12 lg:px-24">
        <div className="flex justify-between items-center py-6">
          {/* Logo + Title */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Moon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MindSpace
              </h1>
              <p className="text-gray-400 text-sm">Your mental wellness companion</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-700 text-white px-4 py-2 rounded-xl shadow-lg hover:from-red-700 hover:to-pink-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400/50"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
