import React from 'react';
import { Brain, ExternalLink, Star } from 'lucide-react';

const ResourceSidebar = () => {
  const therapyPlatforms = [
    { 
      name: "TherapyMantra", 
      description: "Online therapy & counselling", 
      rating: 4.4, 
      users: "100K+", 
      url: "https://therapymantra.in"
    },
    { 
      name: "Lissun", 
      description: "1-on-1 counselling & self-help tools", 
      rating: 4.5, 
      users: "75K+", 
      url: "https://www.lissun.app"
    },
    { 
      name: "PsychiCare", 
      description: "Therapy for individuals & couples", 
      rating: 4.6, 
      users: "50K+", 
      url: "https://psychicare.com"
    }
  ];

  return (
    <div className="bg-gray-900/60 backdrop-blur-xl border border-teal-500/30 rounded-3xl p-8 shadow-2xl shadow-teal-900/10">
      <div className="flex items-center mb-8">
        <div className="p-3 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl mr-4">
          <Brain className="w-7 h-7 text-teal-300" />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-white">Therapy Platforms</h3>
          <p className="text-teal-300/80">Professional mental health support</p>
        </div>
      </div> 
      
      {/* Grid layout for therapy platforms */}
      <div className="grid md:grid-cols-3 gap-6">
        {therapyPlatforms.map((platform, index) => (
          <div 
            key={index} 
            className="bg-gray-800/50 border border-teal-500/20 rounded-2xl p-6 hover:bg-gray-800/70 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-white text-xl group-hover:text-teal-200 transition-colors">
                {platform.name}
              </h4>
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-yellow-300 font-bold text-lg">{platform.rating}</span>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">{platform.description}</p>
            <a 
              href={platform.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between"
            >
              <span className="text-teal-300 font-semibold text-lg">{platform.users} users</span>
              <ExternalLink className="w-5 h-5 text-teal-400 group-hover:text-teal-300 transition-colors" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceSidebar;