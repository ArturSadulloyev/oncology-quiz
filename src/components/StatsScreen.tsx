import React from 'react';
import { UserStats, resetLocalData } from '../lib/storage';
import { QuestionProgress } from '../types/quiz';
import { triggerHaptic } from '../lib/telegram';
import {
  BarChart2,
  CheckCircle2,
  XCircle,
  Award,
  Clock,
  Flame,
  RotateCcw,
  BookOpen,
  Trash2,
} from 'lucide-react';

interface StatsScreenProps {
  stats: UserStats;
  progress: Record<string, QuestionProgress>;
  totalQuestions: number;
  onResetData: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({
  stats,
  progress,
  totalQuestions,
  onResetData,
}) => {
  // Mastery level distribution
  const masteryLevels = [0, 1, 2, 3, 4, 5];
  const levelCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (const p of Object.values(progress)) {
    if (p.times_seen > 0) {
      const lvl = Math.min(5, Math.max(0, p.mastery_level));
      levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
    }
  }

  const handleReset = () => {
    triggerHaptic('light');
    if (confirm('Barcha progress va natijalar tarixini oʻchirib yuborishni xohlaysizmi?')) {
      resetLocalData();
      onResetData();
    }
  };

  return (
    <div className="flex flex-col min-h-full px-4 pt-5 pb-24">
      {/* Header */}
      <header className="mb-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#8E8E93]">
          Oʻzlashtirish Koʻrsatkichlari
        </span>
        <h1 className="text-2xl font-extrabold text-[#1C1C1E] tracking-tight">
          Statistika
        </h1>
        <p className="text-xs text-[#8E8E93] mt-0.5">
          Onkologiya testlari boʻyicha shaxsiy natijalar
        </p>
      </header>

      {/* Main Accuracy Card */}
      <div className="bg-white rounded-3xl border border-[#E5E5EA] p-5 shadow-card mb-4 text-center">
        <div className="text-5xl font-black text-[#007AFF] tracking-tight">
          {stats.accuracy}%
        </div>
        <div className="text-xs font-semibold text-[#8E8E93] mt-1 mb-4">
          Umumiy aniqlik darajasi
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E5E5EA]">
          <div className="bg-[#ECFDF3] rounded-2xl p-3 flex items-center justify-between">
            <div className="text-left">
              <div className="text-[11px] font-medium text-[#027A48]">Toʻgʻri</div>
              <div className="text-lg font-black text-[#027A48]">
                {stats.totalCorrect}
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
          </div>

          <div className="bg-[#FEF3F2] rounded-2xl p-3 flex items-center justify-between">
            <div className="text-left">
              <div className="text-[11px] font-medium text-[#B42318]">Notoʻgʻri</div>
              <div className="text-lg font-black text-[#B42318]">
                {stats.totalWrong}
              </div>
            </div>
            <XCircle className="w-5 h-5 text-[#FF3B30]" />
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        {/* Total Answered */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E5E5EA] shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E8E93]">Jami yechilgan</span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-[#007AFF]" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-[#1C1C1E]">
            {stats.totalAnswered}
          </div>
        </div>

        {/* Mastered */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E5E5EA] shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E8E93]">Mukammal</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Award className="w-3.5 h-3.5 text-[#34C759]" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-[#34C759]">
            {stats.masteredCount}
          </div>
        </div>

        {/* Due for review */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E5E5EA] shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E8E93]">Takrorlashga tayyor</span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-[#FF9500]" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-[#FF9500]">
            {stats.dueCount}
          </div>
        </div>

        {/* Current streak */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E5E5EA] shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E8E93]">Ketma-ket kunlar</span>
            <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-[#FF9500]" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-[#FF9500]">
            {stats.currentStreak} <span className="text-xs font-semibold text-[#8E8E93]">kun</span>
          </div>
        </div>
      </div>

      {/* Spaced Repetition Mastery Levels */}
      <div className="bg-white rounded-3xl border border-[#E5E5EA] p-4 shadow-card mb-6">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-[#8E8E93] mb-3 px-1">
          Oʻzlashtirish bosqichlari (Spaced Repetition)
        </h3>
        <div className="space-y-2">
          {masteryLevels.map((lvl) => {
            const count = levelCounts[lvl] || 0;
            const pct = totalQuestions > 0 ? (count / totalQuestions) * 100 : 0;
            const levelTitles = [
              '0-daraja (Qayta takrorlash: 10 daqiqa)',
              '1-daraja (Oraliq: 1 kun)',
              '2-daraja (Oraliq: 3 kun)',
              '3-daraja (Oraliq: 7 kun)',
              '4-daraja (Oraliq: 14 kun)',
              '5-daraja (Mukammal: 30 kun)',
            ];

            return (
              <div key={lvl} className="text-xs">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-[#1C1C1E]">
                    {levelTitles[lvl]}
                  </span>
                  <span className="font-bold text-[#8E8E93]">
                    {count} ta ({Math.round(pct)}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#F2F2F7] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      lvl >= 4 ? 'bg-[#34C759]' : lvl >= 2 ? 'bg-[#007AFF]' : 'bg-[#FF9500]'
                    }`}
                    style={{ width: `${Math.max(pct, count > 0 ? 3 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Progress Action */}
      <button
        onClick={handleReset}
        className="w-full py-3.5 bg-white border border-red-200 text-[#FF3B30] rounded-2xl font-bold text-xs shadow-sm transition-press flex items-center justify-center gap-2 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
        <span>Barcha progressni tozalash</span>
      </button>
    </div>
  );
};
