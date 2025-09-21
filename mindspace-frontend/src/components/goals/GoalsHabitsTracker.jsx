import React, { useState } from 'react';
import { Plus, Target, Brain, Dumbbell, Moon, Users, Coffee, Camera, Heart, Book } from 'lucide-react';
import SmartSuggestions from './SmartSuggestions'; 
import CategoryFilter from './CategoryFilter';
import GoalCard from './GoalCard'; 
import ProgressOverview from './ProgressOverview';
import AddGoalModel from './AddGoalModel'; 
import MotivationalBanner from './MotivationalBanner';

const GoalsHabitsTracker = () => {
  const [goals, setGoals] = useState([
    { id: 1, title: "Sleep by 11 PM", category: "sleep", streak: 5, target: 7, icon: "moon", color: "#7c3aed", completed: false },
    { id: 2, title: "Journal 3x/week", category: "mental", streak: 12, target: 21, icon: "book", color: "#3b82f6", completed: true },
    { id: 3, title: "Exercise daily", category: "physical", streak: 3, target: 30, icon: "dumbbell", color: "#10b981", completed: false },
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newGoal, setNewGoal] = useState({ title: '', category: 'mental', target: 7, icon: 'target' });

  const categories = {
    all: { label: 'All', icon: Target, color: '#6b7280' },
    mental: { label: 'Mental', icon: Brain, color: '#3b82f6' },
    physical: { label: 'Physical', icon: Dumbbell, color: '#10b981' },
    sleep: { label: 'Sleep', icon: Moon, color: '#7c3aed' },
    social: { label: 'Social', icon: Users, color: '#ec4899' }
  };

  const iconOptions = { target: Target, book: Book, dumbbell: Dumbbell, moon: Moon, users: Users, coffee: Coffee, camera: Camera, heart: Heart, brain: Brain };

  // Toggle completion
  const toggleGoal = (id) => {
    setGoals(goals.map(g => g.id === id ? { 
      ...g, 
      completed: !g.completed, 
      streak: g.completed ? g.streak : g.streak + 1 
    } : g));
  };

  // Delete goal
  const deleteGoal = (id) => {
    if (window.confirm('Delete this goal?')) setGoals(goals.filter(g => g.id !== id));
  };

  // Add goal
  const addGoal = () => {
    if (!newGoal.title.trim()) return;

    const goalToAdd = {
      ...newGoal,
      id: Date.now(),
      streak: 0,
      completed: false,
      color: categories[newGoal.category]?.color || '#3b82f6'
    };

    setGoals([...goals, goalToAdd]);
    setNewGoal({ title: '', category: 'mental', target: 7, icon: 'target' });
    setShowAddGoal(false);
  };

  const filteredGoals = selectedCategory === 'all' ? goals : goals.filter(g => g.category === selectedCategory);
  const completedToday = goals.filter(g => g.completed).length;
  const longestStreak = Math.max(...goals.map(g => g.streak), 0);

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
        stats={{ completedToday, totalGoals: goals.length }} 
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
        {filteredGoals.map(goal => (
          <GoalCard 
            key={goal.id} 
            goal={goal} 
            onToggleCompletion={toggleGoal} 
            onDelete={deleteGoal} 
          />
        ))}

        {filteredGoals.length === 0 && (
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
         isOpen={showAddGoal}               // important!
       onClose={() => setShowAddGoal(false)}
       onAddGoal={(goal) => setGoals([...goals, goal])}  // add goal from modal
       categories={categories}
      //  iconOptions={iconOptions}
     />
      )}  
    </div>
  );
};
export default GoalsHabitsTracker;
