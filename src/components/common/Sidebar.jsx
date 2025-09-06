import React from 'react';
import { TrendingUp, Smile, BookOpen, Users } from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, color: 'purple' },
    { id: 'mood', label: 'Mood Tracker', icon: Smile, color: 'pink' },
    { id: 'journal', label: 'Journal', icon: BookOpen, color: 'emerald' },
    { id: 'community', label: 'Community', icon: Users, color: 'blue' }
  ];

  const getColorClasses = (color, isActive) => {
    const colors = {
      purple: isActive 
        ? 'bg-purple-600/20 text-purple-400 border-purple-500/50 shadow-lg shadow-purple-500/20' 
        : 'text-gray-400 hover:bg-purple-600/10 hover:text-purple-400',
      pink: isActive 
        ? 'bg-pink-600/20 text-pink-400 border-pink-500/50 shadow-lg shadow-pink-500/20' 
        : 'text-gray-400 hover:bg-pink-600/10 hover:text-pink-400',
      emerald: isActive 
        ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/50 shadow-lg shadow-emerald-500/20' 
        : 'text-gray-400 hover:bg-emerald-600/10 hover:text-emerald-400',
      blue: isActive 
        ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 shadow-lg shadow-blue-500/20' 
        : 'text-gray-400 hover:bg-blue-600/10 hover:text-blue-400'
    };
    return colors[color];
  };

  return (
    <div className="lg:w-72">
      {/* smaller top offset to align closer under header */}
      <nav className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6 space-y-3 sticky top-24">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 border ${
                isActive 
                  ? `${getColorClasses(item.color, true)} border` 
                  : `${getColorClasses(item.color, false)} border-transparent`
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
