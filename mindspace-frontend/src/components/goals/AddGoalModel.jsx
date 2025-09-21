import React, { useState } from 'react';
import { Target, Book, Dumbbell, Moon, Users, Coffee, Camera, Music, Heart, Brain } from 'lucide-react';

const AddGoalModel = ({ isOpen, onClose, onAddGoal, categories }) => {
  const [newGoal, setNewGoal] = useState({ 
    title: '', 
    category: 'mental', 
    target: 7, 
    icon: 'target' 
  });

  const iconOptions = {
    target: Target, book: Book, dumbbell: Dumbbell, moon: Moon, 
    users: Users, coffee: Coffee, camera: Camera, music: Music,
    heart: Heart, brain: Brain
  };

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal = {
      id: Date.now(),
      ...newGoal,
      streak: 0,
      completed: false,
      color: categories[newGoal.category]?.color || '#3b82f6'
    };
    onAddGoal(goal);
    setNewGoal({ title: '', category: 'mental', target: 7, icon: 'target' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">Add New Goal</h2>
        
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Goal Title</label>
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              placeholder="e.g., Read 30 mins daily"
              className="w-full px-4 py-3 border border-gray-700 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={newGoal.category}
              onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
              className="w-full px-4 py-3 border border-gray-700 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {Object.entries(categories)
                .filter(([key]) => key !== 'all')
                .map(([key, cat]) => (
                  <option key={key} value={key}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Target */}
          <div>
            <label className="block text-sm font-medium mb-2">Target Days</label>
            <input
              type="number"
              value={newGoal.target}
              onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value)})}
              min="1"
              max="365"
              className="w-full px-4 py-3 border border-gray-700 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(iconOptions).map(([key, IconComponent]) => (
                <button
                  key={key}
                  onClick={() => setNewGoal({...newGoal, icon: key})}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    newGoal.icon === key 
                      ? 'border-purple-500 bg-purple-800' 
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <IconComponent className="h-6 w-6 text-white" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddGoal}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white hover:shadow-lg transition-all duration-300"
          >
            Add Goal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGoalModel;
  