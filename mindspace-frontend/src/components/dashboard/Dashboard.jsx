import React from 'react';
import StatsCards from './StatsCards';
import MoodChart from './MoodChart';
import RecentEntries from './RecentEntries';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <StatsCards />
      <MoodChart />
      <RecentEntries />
    </div>
  );
};

export default Dashboard;