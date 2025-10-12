import React, { useState } from 'react';
import { Heart, LogOut } from 'lucide-react';

const Header = ({ onLogout }) => {
  const [isHovering, setIsHovering] = useState(false);

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

          {/* Enhanced Logout Button */}
          <div className="-mr-8 mt-2">
            <button
              onClick={handleLogout}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="relative group flex items-center space-x-2
                         bg-red-700
                         text-white/80 px-5 py-3 rounded-xl
                         shadow-md shadow-red-500/10
                         transition-all duration-300
                         hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20
                         hover:scale-105 hover:-translate-y-0.5
                         active:scale-95 active:translate-y-0
                         focus:outline-none focus:ring-2 focus:ring-red-400/30
                         overflow-hidden"
            >
              {/* Animated background pulse */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
             
              {/* Icon with rotation effect */}
              <div className={`relative transition-all duration-300 ${isHovering ? 'rotate-90' : 'rotate-0'}`}>
                <LogOut className="w-4 h-4" />
              </div>
             
              {/* Text with sliding effect */}
              <span className="hidden sm:inline font-medium relative text-sm">
                Logout
              </span>

              {/* Decorative corner accents */}
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-white/20 rounded-bl-full
                            opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-white/20 rounded-tr-full
                            opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;