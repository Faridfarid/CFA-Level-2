
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CFATopic, Vignette, QuizSession } from './types';
import { generateVignette } from './services/geminiService';
import TopicSelector from './components/TopicSelector';
import QuestionCard from './components/QuestionCard';

const App: React.FC = () => {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTopicSelect = async (topic: CFATopic) => {
    setIsLoading(true);
    setError(null);
    try {
      const vignette = await generateVignette(topic);
      setSession({
        vignette,
        userAnswers: {},
        isComplete: false,
        startTime: Date.now()
      });
    } catch (err) {
      console.error(err);
      setError("Failed to generate vignette. Please try again or check your API configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answer: 'A' | 'B' | 'C') => {
    if (!session) return;
    setSession({
      ...session,
      userAnswers: {
        ...session.userAnswers,
        [questionId]: answer
      }
    });
  };

  const handleSubmit = () => {
    if (!session) return;
    setSession({ ...session, isComplete: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetSession = () => {
    setSession(null);
    setError(null);
  };

  const calculateScore = () => {
    if (!session) return 0;
    let score = 0;
    session.vignette.questions.forEach(q => {
      if (session.userAnswers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Advanced Vignette</h2>
        <p className="text-gray-500 text-center max-w-md">
          Synthesizing financial statements and exhibit tables for Level 2 analysis...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetSession}>
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-black text-xs">CFA</span>
            </div>
            <h1 className="font-bold text-xl text-gray-900 tracking-tight">Master Trainer <span className="text-blue-600 font-medium">L2</span></h1>
          </div>
          {session && (
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-sm font-medium text-gray-400 uppercase tracking-wider">{session.vignette.topic}</span>
              <button 
                onClick={resetSession}
                className="text-sm px-4 py-2 text-gray-600 hover:text-gray-900 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Quit Session
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        {!session ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-gray-900 mb-4">Master Your Level 2 Preparation</h2>
              <p className="text-lg text-gray-600">Dynamic CFA vignettes with detailed exhibits and case studies.</p>
            </div>
            <TopicSelector onSelect={handleTopicSelect} isLoading={isLoading} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">
                    {session.vignette.title}
                  </h2>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase rounded">Vignette</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase rounded">{session.vignette.topic}</span>
                  </div>
                </div>
                
                <div className="markdown-content text-gray-700">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      table: ({node, ...props}) => (
                        <div className="table-container">
                          <table {...props} />
                        </div>
                      ),
                    }}
                  >
                    {session.vignette.context}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6 pb-24">
              {session.isComplete && (
                <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-xl mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-1 opacity-80 text-blue-100">Performance</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">
                      {calculateScore()} / {session.vignette.questions.length}
                    </span>
                    <span className="text-xl font-medium opacity-80 italic">Correct</span>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={resetSession}
                      className="flex-1 py-3 px-4 bg-white text-blue-700 rounded-lg font-bold hover:bg-blue-50 transition-colors"
                    >
                      New Topic
                    </button>
                    <button 
                      onClick={() => handleTopicSelect(session.vignette.topic)}
                      className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-400 border border-blue-400 transition-colors"
                    >
                      Refresh Case
                    </button>
                  </div>
                </div>
              )}

              {session.vignette.questions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  selectedAnswer={session.userAnswers[q.id]}
                  onSelect={(ans) => handleAnswer(q.id, ans)}
                  isReviewMode={session.isComplete}
                />
              ))}

              {!session.isComplete && (
                <div className="sticky bottom-6 mt-12 bg-white/90 backdrop-blur border border-gray-200 p-4 rounded-xl shadow-lg">
                  <button
                    disabled={Object.keys(session.userAnswers).length < session.vignette.questions.length}
                    onClick={handleSubmit}
                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl"
                  >
                    Submit Case Study
                  </button>
                  <p className="mt-2 text-center text-xs text-gray-500 font-medium">
                    {Object.keys(session.userAnswers).length} of {session.vignette.questions.length} completed
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {!session && !isLoading && (
        <footer className="mt-24 border-t border-gray-100 py-12 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Disclaimer</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              This application is an AI supplement. CFA® is a registered trademark of CFA Institute.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
