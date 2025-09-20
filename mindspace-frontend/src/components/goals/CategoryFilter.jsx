import React from 'react';
import { Target, Brain, Dumbbell, Moon, Users, Camera, Clock, Book } from 'lucide-react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const iconMap = {
    Target, Brain, Dumbbell, Moon, Users, Camera, Clock, Book
  };

  return (
    <div className="mb-6">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {Object.entries(categories).map(([key, category]) => {
          const IconComponent = iconMap[category.icon] || Target;
          return (
            <button
              key={key}
              onClick={() => onCategoryChange(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 shadow-md
                ${
                  selectedCategory === key
                    ? `bg-${category.color}-600 text-white shadow-lg border border-${category.color}-500`
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
