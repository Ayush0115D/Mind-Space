import React, { useState, useEffect } from 'react';
import { Plus, Target, Brain, Dumbbell, Moon, Users } from 'lucide-react';
import SmartSuggestions from './SmartSuggestions';
import CategoryFilter from './CategoryFilter';
import GoalCard from './GoalCard';
import ProgressOverview from './ProgressOverview';
import AddGoalModel from './AddGoalModel';
import MotivationalBanner from './MotivationalBanner';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const GoalsHabitsTracker = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = {
    all: { label: 'All', icon: Target, color: '#6b7280' },
    mental: { label: 'Mental', icon: Brain, color: '#3b82f6' },
    physical: { label: 'Physical', icon: Dumbbell, color: '#10b981' },
    sleep: { label: 'Sleep', icon: Moon, color: '#7c3aed' },
    social: { label: 'Social', icon: Users, color: '#ec4899' },
  };

  // Fetch goals from backend
  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/goals`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch goals');
      const data = await res.json();
      setGoals(data);
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Add new goal
  const addGoal = async (goalData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(goalData)
      });
      if (!res.ok) throw new Error('Failed to add goal');
      const savedGoal = await res.json();
      setGoals([...goals, savedGoal]);
      setShowAddGoal(false);
    } catch (err) {
      console.error('Error adding goal:', err);
      alert('Failed to add goal');
    }
  };

  // Toggle completion
  const toggleGoal = async (goal) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/goals/${goal._id}/toggle`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to toggle goal');
      const updatedGoal = await res.json();
      setGoals(goals.map(g => g._id === updatedGoal._id ? updatedGoal : g));
    } catch (err) {
      console.error('Error toggling goal:', err);
      alert('Failed to update goal');
    }
  };

  // Delete goal
  const deleteGoal = async (goalId) => {
    if (!window.confirm('Delete this goal?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete goal');
      setGoals(goals.filter(g => g._id !== goalId));
    } catch (err) {
      console.error('Error deleting goal:', err);
      alert('Failed to delete goal');
    }
  };

  // Filtered goals by category
  const filteredGoals = selectedCategory === 'all'
    ? goals
    : goals.filter(g => g.category === selectedCategory);

  // Calculate completed today based on lastCompleted
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completedToday = goals.filter(g => {
    if (!g.lastCompleted) return false;
    const last = new Date(g.lastCompleted);
    last.setHours(0, 0, 0, 0);
    return last.getTime() === today.getTime();
  }).length;

  const longestStreak = goals.length > 0 ? Math.max(...goals.map(g => g.streak)) : 0;

  const getMotivationalMessage = () => {
    if (completedToday === goals.length && goals.length > 0) return "🎉 Amazing! All goals completed!";
    if (completedToday >= goals.length * 0.8) return "🌟 You're doing great!";
    if (longestStreak >= 7) return `🔥 ${longestStreak}-day streak! Keep going!`;
    if (completedToday > 0) return "👍 Good progress today!";
    return "🌅 New day, new opportunities!";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
            <Target className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Goals & Habits</h1>
            <p className="text-gray-300">Transform your mood tracking into active growth</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddGoal(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
        >
          <Plus className="h-5 w-5" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Motivational Banner */}
      <MotivationalBanner
        message={getMotivationalMessage()}
        goals={goals}
      />

      {/* Smart Suggestions */}
      <SmartSuggestions />

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loading ? (
          <p className="text-gray-400 text-center py-12 col-span-full">Loading goals...</p>
        ) : filteredGoals.length > 0 ? (
          filteredGoals.map(goal => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onToggleCompletion={() => toggleGoal(goal)}
              onDelete={() => deleteGoal(goal._id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Target className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No goals yet</h3>
            <p className="text-gray-400 mb-4">Start your journey by creating your first goal!</p>
            <button
              onClick={() => setShowAddGoal(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors shadow-lg"
            >
              Create Your First Goal
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <ProgressOverview goals={goals} />

      {/* Add Goal Modal */}
      {showAddGoal && (
        <AddGoalModel
          isOpen={showAddGoal}
          onClose={() => setShowAddGoal(false)}
          onAddGoal={addGoal}
          categories={categories}
        />
      )}
    </div>
  );
};
export default GoalsHabitsTracker;