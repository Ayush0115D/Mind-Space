import React, { useState } from 'react';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import MoodTracker from './components/mood/MoodTracker';
import Journal from './components/journal/Journal';
import Community from './components/community/Community';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      {/* Small padding for breathing space */}
      <div className="w-full px-8 sm:px-12 lg:px-24 py-8">
  <div className="flex flex-col lg:flex-row gap-8">
    <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
    <div className="flex-1">
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'mood' && <MoodTracker />}
      {currentView === 'journal' && <Journal />}
      {currentView === 'community' && <Community />}
    </div>
  </div>
</div>
      </div>
  );
};

export default App;
