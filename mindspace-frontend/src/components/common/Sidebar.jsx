import React from 'react';
import { TrendingUp, Smile, Target, BookOpen, Brain } from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, color: 'purple' },
    { id: 'mood', label: 'Mood Tracker', icon: Smile, color: 'pink' },
    { id: 'goals', label: 'Goals & Habits', icon: Target, color: 'blue' },
    { id: 'resources', label: 'Resources', icon: BookOpen, color: 'green' },
    { id: 'ai-recommend', label: 'Recommendations', icon: Brain, color: 'indigo' }
  ];

  const colorMap = {
    purple: 'border-purple-500 text-purple-400 hover:bg-purple-700/20 hover:text-purple-300 shadow-purple-400/20',
    pink: 'border-pink-500 text-pink-400 hover:bg-pink-700/20 hover:text-pink-300 shadow-pink-400/20',
    blue: 'border-blue-500 text-blue-400 hover:bg-blue-700/20 hover:text-blue-300 shadow-blue-400/20',
    green: 'border-green-500 text-green-400 hover:bg-green-700/20 hover:text-green-300 shadow-green-400/20',
    indigo: 'border-indigo-500 text-indigo-400 hover:bg-indigo-700/20 hover:text-indigo-300 shadow-indigo-400/20'
  };

  const hoverBgMap = {
    purple: 'hover:bg-purple-700/20',
    pink: 'hover:bg-pink-700/20',
    blue: 'hover:bg-blue-500/20',
    green: 'hover:bg-green-700/20',
    indigo: 'hover:bg-indigo-700/20'
  };

  return (
    <div className="lg:w-72">
      <nav className="bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-800/50 p-6 space-y-3 sticky top-24">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                relative w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300
                ${isActive
                  ? `bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg border-l-4 ${colorMap[item.color].split(' ')[0]}`
                  : `border-l-4 border-transparent ${hoverBgMap[item.color]} hover:shadow-md`}
              `}
            >
              <Icon
                className={`w-6 h-6 transition-transform duration-300 ${
                  isActive ? colorMap[item.color].split(' ')[1] : 'text-gray-400 hover:text-white group-hover:scale-110'
                }`}
              />
              <span
                className={`font-medium text-sm transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
export default Sidebar;