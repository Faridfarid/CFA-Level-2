
import React from 'react';
import { CFATopic } from '../types';

interface TopicSelectorProps {
  onSelect: (topic: CFATopic) => void;
  isLoading: boolean;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelect, isLoading }) => {
  const topics = Object.values(CFATopic);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {topics.map((topic) => (
        <button
          key={topic}
          onClick={() => onSelect(topic)}
          disabled={isLoading}
          className={`p-6 text-left rounded-xl border-2 transition-all duration-200 group
            ${isLoading 
              ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50' 
              : 'bg-white border-blue-50 hover:border-blue-500 hover:shadow-lg active:scale-[0.98]'}`}
        >
          <div className="flex flex-col h-full">
            <span className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">Topic</span>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
              {topic}
            </h3>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              Practice specialized vignettes designed for the Level 2 curriculum with interactive exhibits.
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TopicSelector;
