import React from 'react';
import { Brain } from 'lucide-react';

const AIInsightsCTA = () => {
  return (
    <div className="text-center">
      <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-slate-600/20 backdrop-blur-xl border border-blue-400/40 rounded-3xl p-12 shadow-2xl shadow-blue-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
        <div className="relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-400/30 to-yellow-400/30 rounded-2xl mb-6">
            <Brain className="w-8 h-8 text-amber-300" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-6">
            Need More Personalized Insights?
          </h3>
          <p className="text-gray-200 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
            Our advanced AI analyzes your wellness patterns, goals, and preferences to deliver hyper-personalized recommendations that evolve with your journey.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 border border-blue-400/20">
              Unlock AI Insights
            </button>
            <button className="bg-gray-900/60 text-blue-200 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800/80 border-2 border-blue-500/30 hover:border-blue-500/50 backdrop-blur-xl transition-all duration-300 hover:text-white">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsCTA;