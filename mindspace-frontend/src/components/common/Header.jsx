import React from 'react';
import { Moon } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-900/90 backdrop-blur-sm shadow-2xl border-b border-gray-700/50 sticky top-0 z-50">
      {/* match padding with App.jsx */}
      <div className="w-full px-8 sm:px-12 lg:px-24">
        <div className="flex justify-between items-center py-6">
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
        </div>
      </div>
    </header>
  );
};

export default Header;
