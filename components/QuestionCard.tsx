
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  index: number;
  selectedAnswer?: 'A' | 'B' | 'C';
  onSelect: (answer: 'A' | 'B' | 'C') => void;
  isReviewMode?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  index, 
  selectedAnswer, 
  onSelect,
  isReviewMode = false 
}) => {
  const getOptionClasses = (key: 'A' | 'B' | 'C') => {
    const isSelected = selectedAnswer === key;
    const isCorrect = question.correctAnswer === key;
    
    if (isReviewMode) {
      if (isCorrect) return 'border-green-500 bg-green-50 text-green-800 ring-2 ring-green-200';
      if (isSelected && !isCorrect) return 'border-red-500 bg-red-50 text-red-800 ring-2 ring-red-200';
      return 'border-gray-200 bg-white opacity-60';
    }

    return isSelected 
      ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-100' 
      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 transition-all">
      <div className="flex items-start gap-3 mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm shrink-0">
          {index + 1}
        </span>
        <div className="markdown-content text-lg font-semibold text-gray-800">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {question.questionText}
          </ReactMarkdown>
        </div>
      </div>

      <div className="space-y-3">
        {(['A', 'B', 'C'] as const).map((key) => (
          <button
            key={key}
            onClick={() => !isReviewMode && onSelect(key)}
            disabled={isReviewMode}
            className={`w-full flex items-start gap-4 p-4 rounded-lg border text-left transition-all ${getOptionClasses(key)}`}
          >
            <span className="font-bold shrink-0">{key}.</span>
            <span className="flex-grow">{question.options[key]}</span>
            {isReviewMode && question.correctAnswer === key && (
              <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {isReviewMode && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          <h5 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-tight">Explanation:</h5>
          <div className="markdown-content text-gray-700 leading-relaxed text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {question.explanation}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
