import React from 'react';
import { Question, QuestionProgress } from '../types/quiz';
import { triggerHaptic } from '../lib/telegram';
import { AlertTriangle, Play, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';

interface MistakesScreenProps {
  mistakeQuestions: Question[];
  progress: Record<string, QuestionProgress>;
  onStartMistakesQuiz: () => void;
  onPracticeSingle: (question: Question) => void;
  onStartSmartReview: () => void;
}

export const MistakesScreen: React.FC<MistakesScreenProps> = ({
  mistakeQuestions,
  progress,
  onStartMistakesQuiz,
  onPracticeSingle,
  onStartSmartReview,
}) => {
  return (
    <div className="flex flex-col min-h-full px-4 pt-5 pb-24">
      {/* Header */}
      <header className="mb-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#8E8E93]">
          Xatolar Bilan Ishlash
        </span>
        <h1 className="text-2xl font-extrabold text-[#1C1C1E] tracking-tight">
          Xatolar
        </h1>
        <p className="text-xs text-[#8E8E93] mt-0.5">
          Oldin notoʻgʻri javob berilgan savollar
        </p>
      </header>

      {mistakeQuestions.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-[#E5E5EA] p-8 text-center shadow-card flex flex-col items-center my-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#34C759] flex items-center justify-center mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-[#1C1C1E]">
            Hozircha xatolar yoʻq!
          </h2>
          <p className="text-xs text-[#8E8E93] mt-1 max-w-xs leading-relaxed">
            Siz barcha ishlangan savollarga toʻgʻri javob bergansiz yoki xatolarni toʻliq toʻgʻirlagansiz.
          </p>
          <button
            onClick={() => {
              triggerHaptic('light');
              onStartSmartReview();
            }}
            className="mt-6 px-6 py-3 bg-[#007AFF] text-white rounded-2xl font-bold text-xs shadow-button transition-press flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Smart Review ni boshlash</span>
          </button>
        </div>
      ) : (
        /* Active Mistakes */
        <div className="space-y-4">
          {/* Main Action Banner */}
          <div className="bg-gradient-to-r from-[#FF3B30] to-[#E0241A] rounded-3xl p-5 text-white shadow-floating">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                Xatolar toʻplami
              </span>
              <span className="text-sm font-black">{mistakeQuestions.length} ta savol</span>
            </div>
            <h2 className="text-lg font-bold mb-1">
              Barcha xatolarni qayta yechish
            </h2>
            <p className="text-xs text-red-100 mb-4">
              Xato qilingan savollarni qayta ishlab, bilimlarni mustahkamlang
            </p>
            <button
              onClick={() => {
                triggerHaptic('light');
                onStartMistakesQuiz();
              }}
              className="w-full py-3 bg-white text-[#FF3B30] rounded-2xl font-bold text-sm shadow-sm transition-press flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-[#FF3B30]" />
              <span>Xatolar ustida testni boshlash</span>
            </button>
          </div>

          {/* List of Mistakes */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#8E8E93] px-1">
              Savollar roʻyxati ({mistakeQuestions.length})
            </h3>
            {mistakeQuestions.map((q, idx) => {
              const p = progress[q.id];
              return (
                <div
                  key={q.id}
                  onClick={() => {
                    triggerHaptic('light');
                    onPracticeSingle(q);
                  }}
                  className="bg-white rounded-2xl border border-[#E5E5EA] p-4 shadow-card hover:border-red-200 transition-press cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-[#FF3B30] bg-red-50 px-2 py-0.5 rounded-full">
                        {p?.times_wrong ?? 1}x xato
                      </span>
                      <span className="text-[10px] text-[#8E8E93]">
                        Savol #{idx + 1}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#1C1C1E] line-clamp-2 leading-snug">
                      {q.question}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#C7C7CC] shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
