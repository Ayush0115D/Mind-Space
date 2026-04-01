import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const MotivationalQuoteCard = () => {
  const quotes = [
    "Every day may not be good, but there's something good in every day.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    "You are stronger than you think and more resilient than you believe.",
    "Progress, not perfection, is the goal.",
    "Take time to make your soul happy.",
    "You don't have to be perfect, you just have to be yourself.",
    "Small steps in the right direction can turn out to be the biggest step of your life.",
    "Your current situation is not your final destination. The best is yet to come."
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => 
          prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
        );
        setIsVisible(true);
      }, 200);
    }, 2000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-medium font-medium text-gray-300 mb-1">Daily Inspiration</p>
          <p className="text-xs text-gray-500">(Motivational Quote)</p>
        </div>
        <div className="p-3 bg-purple-600/20 rounded-xl">
          <Quote className="w-8 h-8 text-purple-400" />
        </div>
      </div>
      
      <div className="relative min-h-[80px] flex items-center">
        <p 
          className={`text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 transition-opacity duration-200 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.3))'
          }}
        >
          "{quotes[currentQuoteIndex]}"
        </p>
      </div>
      
      {/* Quote indicator dots */}
      <div className="flex justify-center space-x-1 mt-4">
        {quotes.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentQuoteIndex 
                ? 'bg-purple-400 w-6' 
                : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MotivationalQuoteCard;