import React, { useState } from 'react';
import {
  Target, Book, Dumbbell, Moon, Users, Coffee,
  Camera, Music, Heart, Brain
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AddGoalModel = ({ isOpen, onClose, onAddGoal, categories }) => {
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: 'mental', // default backend category
    target: 7,
    icon: 'target'
  });

  const iconOptions = {
    target: Target, book: Book, dumbbell: Dumbbell, moon: Moon,
    users: Users, coffee: Coffee, camera: Camera, music: Music,
    heart: Heart, brain: Brain
  };

  const iconLabels = {
    target: 'Focus Goal',
    book: 'Learning Goal',
    dumbbell: 'Fitness Goal',
    moon: 'Sleep Goal',
    users: 'Social Goal',
    coffee: 'Energy Goal',
    camera: 'Creative Goal',
    music: 'Music Goal',
    heart: 'Health Goal',
    brain: 'Mental Goal'
  };

  const categoryIcons = {
    mental: ['brain', 'target', 'book'],
    physical: ['dumbbell', 'heart'],
    sleep: ['moon', 'coffee'],
    social: ['users', 'heart', 'coffee'],
    creative: ['camera', 'music', 'book']
  };

  const handleAddGoal = async () => {
    if (!newGoal.title.trim()) return alert('Please enter a goal title');

    const goalPayload = {
      title: newGoal.title,
      category: newGoal.category,
      target: Math.min(Math.max(newGoal.target, 1), 365), // ensure 1–365
      icon: newGoal.icon
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(goalPayload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add goal');
      }

      const savedGoal = await res.json();
      onAddGoal(savedGoal);

      // Reset form
      setNewGoal({ title: '', category: 'mental', target: 7, icon: 'target' });
      onClose();
    } catch (err) {
      console.error('Error adding goal:', err);
      alert(err.message || 'Failed to add goal. Please try again.');
    }
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
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder="e.g., Read 30 mins daily"
              className="w-full px-4 py-3 border border-gray-700 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={newGoal.category}
              onChange={(e) => {
                const cat = e.target.value;
                setNewGoal({
                  ...newGoal,
                  category: cat,
                  icon: categoryIcons[cat][0] // default icon for category
                });
              }}
              className="w-full px-4 py-3 border border-gray-700 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {Object.keys(categories)
                .filter(key => key !== 'all')
                .map(key => (
                  <option key={key} value={key}>{categories[key].label}</option>
                ))}
            </select>
          </div>

          {/* Target Days */}
          <div>
            <label className="block text-sm font-medium mb-2">Target Days</label>
            <input
              type="number"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 1 })}
              min="1"
              max="365"
              className="w-full px-4 py-3 text-lg border border-gray-700 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <div className="grid grid-cols-5 gap-3">
              {(categoryIcons[newGoal.category] || []).map((key) => {
                const IconComponent = iconOptions[key];
                return (
                  <button
                    key={key}
                    onClick={() => setNewGoal({ ...newGoal, icon: key })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      newGoal.icon === key
                        ? 'border-purple-500 bg-purple-800'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-sm text-gray-400 text-center italic">
              {iconLabels[newGoal.icon]}
            </p>
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
