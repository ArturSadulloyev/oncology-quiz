import React from 'react';
import { QuizMode } from '../types/quiz';
import { triggerHaptic } from '../lib/telegram';
import { Brain, Zap, BookOpen, AlertTriangle, ChevronRight } from 'lucide-react';

interface PracticeScreenProps {
  onStartQuiz: (mode: QuizMode) => void;
  mistakesCount: number;
  dueCount: number;
  totalQuestions: number;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  onStartQuiz,
  mistakesCount,
  dueCount,
  totalQuestions,
}) => {
  return (
    <div className="flex flex-col min-h-full px-4 pt-5 pb-24">
      <header className="mb-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#8E8E93]">
          Mashq Rejimlari
        </span>
        <h1 className="text-2xl font-extrabold text-[#1C1C1E] tracking-tight">
          Mashq
        </h1>
        <p className="text-xs text-[#8E8E93] mt-0.5">
          Oʻzingizga qulay oʻrganish rejimini tanlang
        </p>
      </header>

      <div className="space-y-3">
        {/* Smart Review */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onStartQuiz('smart');
          }}
          className="w-full bg-white rounded-3xl border-2 border-blue-100 hover:border-[#007AFF] p-4 text-left shadow-card transition-press flex items-start gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#007AFF] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#007AFF] group-hover:text-white transition-colors">
            <Brain className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-0.5">
              <h2 className="text-base font-bold text-[#1C1C1E]">
                Smart Review
              </h2>
              <span className="text-[11px] font-bold text-[#007AFF] bg-blue-50 px-2 py-0.5 rounded-full">
                Tavsiya etiladi
              </span>
            </div>
            <p className="text-xs text-[#8E8E93] leading-relaxed">
              Takrorlash vaqti kelgan ({dueCount} ta) va zaif savollarni ustuvor oʻrganish (20 ta savol).
            </p>
          </div>
        </button>

        {/* Quick Test */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onStartQuiz('quick');
          }}
          className="w-full bg-white rounded-3xl border border-[#E5E5EA] hover:border-amber-300 p-4 text-left shadow-card transition-press flex items-start gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-[#FF9500] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#FF9500] group-hover:text-white transition-colors">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-0.5">
              <h2 className="text-base font-bold text-[#1C1C1E]">
                Quick Test
              </h2>
              <span className="text-[11px] font-bold text-[#FF9500] bg-amber-50 px-2 py-0.5 rounded-full">
                10 ta savol
              </span>
            </div>
            <p className="text-xs text-[#8E8E93] leading-relaxed">
              Boʻsh vaqtingizda tezkor tekshiruv uchun tasodifiy 10 ta savol.
            </p>
          </div>
        </button>

        {/* All Questions */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onStartQuiz('all');
          }}
          className="w-full bg-white rounded-3xl border border-[#E5E5EA] hover:border-indigo-300 p-4 text-left shadow-card transition-press flex items-start gap-3.5 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-0.5">
              <h2 className="text-base font-bold text-[#1C1C1E]">
                All Questions
              </h2>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {totalQuestions} ta savol
              </span>
            </div>
            <p className="text-xs text-[#8E8E93] leading-relaxed">
              Onkologiya boʻyicha barcha savollar toʻplami boʻyicha toʻliq amaliyot.
            </p>
          </div>
        </button>

        {/* Mistakes Quiz */}
        <button
          disabled={mistakesCount === 0}
          onClick={() => {
            triggerHaptic('light');
            onStartQuiz('mistakes');
          }}
          className={`w-full bg-white rounded-3xl border border-[#E5E5EA] p-4 text-left shadow-card transition-press flex items-start gap-3.5 group ${
            mistakesCount === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-red-300'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#FF3B30] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#FF3B30] group-hover:text-white transition-colors">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-0.5">
              <h2 className="text-base font-bold text-[#1C1C1E]">
                Xatolar ustida ishlash
              </h2>
              <span className="text-[11px] font-bold text-[#FF3B30] bg-red-50 px-2 py-0.5 rounded-full">
                {mistakesCount} ta xato
              </span>
            </div>
            <p className="text-xs text-[#8E8E93] leading-relaxed">
              Faqat ilgari notoʻgʻri javob berilgan savollarni qayta topshirish.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
