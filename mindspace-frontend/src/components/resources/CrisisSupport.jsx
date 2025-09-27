import React from 'react';
import { Shield, Clock } from 'lucide-react';

const CrisisSupport = () => {
  const crisisSupports = [
    { name: "Tele-MANAS", contact: "14416 or 1800-891-4416", available: "24/7" },
    { name: "National Suicide Prevention", contact: "call or text 988", available: "24/7" },
    { name: "Emergency Helpline", contact: "112", available: "24/7" }
  ];

  return (
    <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-400/30 rounded-3xl p-8 mb-16 backdrop-blur-lg shadow-2xl shadow-red-900/20">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-red-500/20 rounded-full mr-4">
          <Shield className="w-7 h-7 text-red-300" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-red-200">Emergency Crisis Support</h3>
          <p className="text-red-300/80 text-sm">Available 24/7 - You're not alone</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {crisisSupports.map((support, index) => (
          <div 
            key={index} 
            className="bg-red-900/40 border border-red-400/20 rounded-2xl p-5 hover:bg-red-900/60 hover:border-red-400/40 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 cursor-pointer group"
          >
            <h4 className="font-bold text-red-200 mb-3 text-lg group-hover:text-red-100 transition-colors">
              {support.name}
            </h4>
            <p className="text-red-100 text-xl font-mono mb-2 group-hover:text-white transition-colors">
              {support.contact}
            </p>
            <div className="flex items-center text-red-300/80">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{support.available}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrisisSupport;