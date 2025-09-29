import React from 'react';
import { Heart, LogOut } from 'lucide-react';

const Header = ({ onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) onLogout();
  };

  return (
    <header
      className="sticky top-0 z-50 
                 bg-gray-900/80 backdrop-blur-lg 
                 border-b border-transparent 
                 shadow-[0_8px_30px_rgba(0,0,0,0.3)]
                 [border-image:linear-gradient(to_right,#22c55e,#3b82f6)_1]"
    >
      <div className="w-full px-8 sm:px-12 lg:px-24">
        <div className="flex justify-between items-center py-6">
          
          {/* Logo + Title */}
          <div className="flex items-center space-x-4 group">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden
                         bg-gradient-to-r from-green-500 to-blue-500 shadow-lg 
                         transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            >
              <div className="absolute inset-0 bg-white/20 blur-2xl rounded-2xl"></div>
              <Heart className="w-7 h-7 text-white relative z-10" />
            </div>

            <div>
              <h1
                className="text-2xl font-bold 
                           bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 
                           bg-clip-text text-transparent 
                           bg-[length:200%_200%] animate-gradient"
              >
                MindSpace
              </h1>
              <p className="text-gray-400 text-sm">
                Your mental wellness companion
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 
                       bg-gradient-to-r from-red-600 to-pink-700 
                       text-white px-4 py-2 rounded-xl 
                       shadow-lg transition-all duration-300 
                       hover:from-red-700 hover:to-pink-800 
                       hover:shadow-[0_0_15px_rgba(255,0,70,0.6)]
                       active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400/50"
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
