import React from 'react';
import { Activity, BookOpen, Users } from 'lucide-react';

const StatsCards = () => {
  const stats = [
    {
      title: 'Average Mood',
      value: '4.2/5',
      subtitle: 'Last 7 days',
      icon: Activity,
      gradient: 'from-purple-400 to-pink-400',
      bgColor: 'hover:shadow-purple-500/10'
    },
    {
      title: 'Journal Entries',
      value: '12',
      subtitle: 'Total entries',
      icon: BookOpen,
      gradient: 'from-emerald-400 to-cyan-400',
      bgColor: 'hover:shadow-emerald-500/10'
    },
    {
      title: 'Community',
      value: '8',
      subtitle: 'Active posts',
      icon: Users,
      gradient: 'from-blue-400 to-indigo-400',
      bgColor: 'hover:shadow-blue-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700/50 hover:shadow-2xl ${stat.bgColor} transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
              <div className="p-3 bg-purple-600/20 rounded-xl">
                <Icon className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;