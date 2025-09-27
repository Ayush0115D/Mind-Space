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
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = {
    all: { label: 'All', icon: Target, color: '#6b7280' },
    mental: { label: 'Mental', icon: Brain, color: '#3b82f6' },
    physical: { label: 'Physical', icon: Dumbbell, color: '#10b981' },
    sleep: { label: 'Sleep', icon: Moon, color: '#7c3aed' },
    social: { label: 'Social', icon: Users, color: '#ec4899' },
  };

  // Helper function to check if goal was completed today
  const isCompletedToday = (lastCompleted) => {
    if (!lastCompleted) return false;
    
    const today = new Date();
    const istToday = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    istToday.setHours(0, 0, 0, 0);
    
    const lastCompletedDate = new Date(lastCompleted);
    const istLastCompleted = new Date(lastCompletedDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    istLastCompleted.setHours(0, 0, 0, 0);
    
    return istLastCompleted.getTime() === istToday.getTime();
  };

  // Fetch goals from backend
  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch goals');

      const response = await res.json();
      const data = response.success && response.data ? response.data : [];

      // Normalize backend data with proper completion tracking
      const normalizedGoals = (Array.isArray(data) ? data : []).map(g => ({
        _id: g._id,
        title: g.title || 'Untitled Goal',
        category: g.category?.toLowerCase() || 'mental',
        icon: g.icon || 'target',
        streak: g.streak || 0,
        target: g.target || 7,
        lastCompleted: g.lastCompleted, // Important: Track when last completed
        completionHistory: g.completionHistory || [],
        color: categories[g.category?.toLowerCase()]?.color || '#6b7280',
      }));

      setGoals(normalizedGoals);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setGoals([]);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Add new goal
  const addGoal = (savedGoal) => {
    const goalData = savedGoal.data || savedGoal;
    if (!goalData?._id) return;

    const goalWithDefaults = {
      _id: goalData._id,
      title: goalData.title || 'Untitled Goal',
      category: goalData.category?.toLowerCase() || 'mental',
      icon: goalData.icon || 'target',
      streak: goalData.streak || 0,
      target: goalData.target || 7,
      lastCompleted: goalData.lastCompleted,
      completionHistory: goalData.completionHistory || [],
      color: categories[goalData.category?.toLowerCase()]?.color || '#6b7280',
    };

    setGoals(prev => [...prev, goalWithDefaults]);
    setShowAddGoal(false);
  };

  // Fixed: Toggle daily completion with proper date handling
  const toggleGoal = async (goal) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/goals/${goal._id}/toggle`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // Send current IST timestamp
        body: JSON.stringify({
          completedAt: new Date().toISOString()
        })
      });
      
      if (!res.ok) throw new Error('Failed to toggle goal');

      const response = await res.json();
      const updatedGoal = response.data;

      // Update local state with the response from backend
      setGoals(prev =>
        prev.map(g =>
          g._id === updatedGoal._id
            ? {
                ...updatedGoal,
                color: categories[updatedGoal.category?.toLowerCase()]?.color || '#6b7280',
              }
            : g
        )
      );
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
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete goal');

      setGoals(prev => prev.filter(g => g._id !== goalId));
    } catch (err) {
      console.error('Error deleting goal:', err);
      alert('Failed to delete goal');
    }
  };

  const allGoals = goals || [];
  const filteredGoals =
    selectedCategory === 'all'
      ? allGoals
      : allGoals.filter(g => g.category === selectedCategory);

  // Fixed: Use proper today completion check
  const completedGoalsCount = allGoals.filter(g => isCompletedToday(g.lastCompleted)).length;
  const longestStreak =
    allGoals.length > 0 ? Math.max(...allGoals.map(g => g.streak)) : 0;

  const getMotivationalMessage = () => {
    if (completedGoalsCount === allGoals.length && allGoals.length > 0)
      return 'Amazing! All goals completed!';
    if (completedGoalsCount >= allGoals.length * 0.8) return "You're doing great!";
    if (longestStreak >= 7) return `${longestStreak}-day streak! Keep going!`;
    if (completedGoalsCount > 0) return 'Good progress today!';
    return 'New day, new opportunities!';
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

      <MotivationalBanner
        message={getMotivationalMessage()}
        stats={{ completedToday: completedGoalsCount, totalGoals: allGoals.length }}
      />

      <SmartSuggestions />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredGoals.length > 0 ? (
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

      <ProgressOverview goals={allGoals} />

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