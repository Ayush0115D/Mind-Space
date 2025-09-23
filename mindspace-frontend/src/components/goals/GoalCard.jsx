import React from 'react';
import {
  CheckCircle2, Circle, Flame, Award,
  Target, Book, Dumbbell, Moon, Users, Coffee, Camera, Heart, Brain, Music
} from 'lucide-react';

const GoalCard = ({ goal, onToggleCompletion, onDelete }) => {
  const iconOptions = {
    target: Target, book: Book, dumbbell: Dumbbell, moon: Moon,
    users: Users, coffee: Coffee, camera: Camera, music: Music,
    heart: Heart, brain: Brain
  };
  
  const IconComponent = iconOptions[goal.icon] || Target;
  const progress = Math.min((goal.streak / goal.target) * 100, 100);
  
  const getStreakColor = (streak) => {
    if (streak >= 21) return 'text-yellow-400';
    if (streak >= 7) return 'text-orange-400';
    if (streak >= 3) return 'text-green-400';
    return 'text-gray-400';
  };
  
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700 hover:shadow-purple-900/50 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-full" style={{ backgroundColor: `${goal.color}40` }}>
            <IconComponent className="h-6 w-6" style={{ color: goal.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{goal.title}</h3>
            <span className="text-sm text-gray-400 capitalize">{goal.category}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleCompletion(goal)}
            className="transition-colors duration-200"
          >
            {goal.completed ?
              <CheckCircle2 className="h-6 w-6 text-green-400" /> :
              <Circle className="h-6 w-6 text-gray-500 hover:text-green-400" />
            }
          </button>
          <button
            onClick={() => onDelete(goal._id)}
            className="text-red-500 hover:text-red-400 transition-colors duration-200"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-medium text-white">{goal.streak}/{goal.target} days</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500 shadow-inner"
            style={{ 
              width: `${progress}%`, 
              background: `linear-gradient(to right, ${goal.color}, ${goal.color}aa)` 
            }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Flame className={`h-5 w-5 ${getStreakColor(goal.streak)}`} />
          <span className={`font-medium ${getStreakColor(goal.streak)}`}>{goal.streak} day streak</span>
        </div>
        {goal.streak >= goal.target && <Award className="h-5 w-5 text-yellow-400" />}
      </div>
    </div>
  );
};

export default GoalCard;