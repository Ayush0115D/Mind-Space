import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import RecommendationTabs from './RecommendationTabs';
import AIInsightsCTA from './AIInsightsCTA';

const AIRecommendations = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950/40 px-6 py-20 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full mb-8 shadow-2xl shadow-blue-500/20">
            <Brain className="w-10 h-10 text-blue-300" />
          </div>
<h3 className='text-red-500 bg-red-500/20 p-2 rounded-md'>
  ⚠️ CAUTION!! WORK IN PROGRESS IN THIS SECTION
</h3>
          <h2 className="text-5xl font-black text-transparent bg-gradient-to-r from-blue-300 via-indigo-300 to-slate-300 bg-clip-text mb-6 leading-tight">
            Personalized Recommendations
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover what works for you—personalized strategies backed by intelligent insights.
            </p>
        </div>

        <RecommendationTabs />
        <AIInsightsCTA />
      </div>
    </section>
  );
};

export default AIRecommendations;