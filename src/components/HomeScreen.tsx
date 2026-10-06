import React from 'react';
import { UserStats } from '../lib/storage';
import { QuizMode, NavTab } from '../types/quiz';
import { triggerHaptic } from '../lib/telegram';
import {
  Flame,
  Brain,
  Zap,
  BookOpen,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface HomeScreenProps {
  stats: UserStats;
  totalQuestions: number;
  userName?: string;
  onStartQuiz: (mode: QuizMode) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  totalQuestions,
  userName = 'Shifokor',
  onStartQuiz,
  onNavigateTab,
}) => {
  return (
    <div className="flex flex-col min-h-full px-4 pt-5 pb-24">
      {/* Top Header */}
      <header className="flex items-center justify-between mb-5">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#8E8E93]">
            Tibbiy Imtihon Amaliyoti
          </span>
          <h1 className="text-2xl font-extrabold text-[#1C1C1E] tracking-tight">
            Oncology Quiz
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-[#FFFFFF] px-3 py-1.5 rounded-full border border-[#E5E5EA] shadow-sm">
          <Flame className="w-4 h-4 text-[#FF9500] fill-[#FF9500]" />
          <span className="text-xs font-bold text-[#1C1C1E]">
            {stats.currentStreak} kun
          </span>
        </div>
      </header>

      {/* Greeting Banner */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E5EA] shadow-card mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xs text-[#8E8E93]">Xush kelibsiz,</div>
            <div className="text-sm font-bold text-[#1C1C1E]">{userName}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[#8E8E93]">Savollar bazasi</div>
          <div className="text-sm font-bold text-[#007AFF]">{totalQuestions} ta</div>
        </div>
      </div>

      {/* 4 Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        {/* Today's Reviews */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E5E5EA] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E8E93]">Bugungi koʻrish</span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
              <RotateCcw className="w-3.5 h-3.5 text-[#007AFF]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#1C1C1E]">{stats.todayReviewsCount}</span>
            <span className="text-xs text-[#8E8E93] ml-1">savol</span>
          </div>
        </div>

        {/* Mistakes */}
        <div
          onClick={() => {
            triggerHaptic('light');
            onNavigateTab('mistakes');
          }}
          className="bg-white p-3.5 rounded-2xl border border-[#E5E5EA] shadow-card flex flex-col justify-between cursor-pointer transition-press"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E8E93]">Xatolar</span>
            <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF3B30]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#FF3B30]">{stats.mistakesCount}</span>
            <span className="text-xs text-[#8E8E93] ml-1">ta faol</span>
          </div>
        </div>

        {/* New Questions */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E5E5EA] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E8E93]">Yangi savollar</span>
            <div className="w-6 h-6 rounded-lg bg-purple-50 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#AF52DE]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#1C1C1E]">{stats.newCount}</span>
            <span className="text-xs text-[#8E8E93] ml-1">oʻrganilmagan</span>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#E5E5EA] shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E8E93]">Kunlik streak</span>
            <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-[#FF9500]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#FF9500]">{stats.currentStreak}</span>
            <span className="text-xs text-[#8E8E93] ml-1">kun ketma-ket</span>
          </div>
        </div>
      </div>

      {/* Main CTA: Start Smart Review */}
      <div className="mb-5">
        <button
          onClick={() => {
            triggerHaptic('light');
            onStartQuiz('smart');
          }}
          className="w-full bg-gradient-to-r from-[#007AFF] to-[#0051D5] hover:brightness-105 active:brightness-95 text-white p-5 rounded-3xl shadow-floating flex flex-col justify-between text-left transition-press relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between w-full mb-3">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white tracking-wide">
              <Brain className="w-3.5 h-3.5" />
              <span>SPACED REPETITION</span>
            </div>
            <span className="text-xs bg-white/25 px-2 py-0.5 rounded-full font-medium">
              20 ta savol
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white mb-1">
              Start Smart Review
            </h2>
            <p className="text-xs text-blue-100 font-normal leading-relaxed">
              Takrorlash vaqti kelgan va zaif savollarni avtomatik saralash orqali bilimlarni mustahkamlang
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
            <span>Mashqni hoziroq boshlash</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Secondary Actions Section */}
      <div className="mb-4">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-[#8E8E93] mb-2.5 px-1">
          Boshqa rejimlar va boʻlimlar
        </h3>
        <div className="bg-white rounded-2xl border border-[#E5E5EA] divide-y divide-[#E5E5EA] shadow-card overflow-hidden">
          {/* Quick Test */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onStartQuiz('quick');
            }}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F2F2F7]/50 transition-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#FF9500] flex items-center justify-center">
                <Zap className="w-5 h-5 fill-[#FF9500]" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#1C1C1E]">Quick Test</div>
                <div className="text-xs text-[#8E8E93]">Tasodifiy 10 ta savol bilan tezkor sinov</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#C7C7CC]" />
          </button>

          {/* All Questions */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onStartQuiz('all');
            }}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F2F2F7]/50 transition-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#007AFF] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#1C1C1E]">All Questions</div>
                <div className="text-xs text-[#8E8E93]">Barcha 498 ta onkologiya savollari</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#C7C7CC]" />
          </button>

          {/* Mistakes practice */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onNavigateTab('mistakes');
            }}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F2F2F7]/50 transition-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#FF3B30] flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#1C1C1E]">Mistakes (Xatolar)</div>
                <div className="text-xs text-[#8E8E93]">
                  {stats.mistakesCount > 0
                    ? `${stats.mistakesCount} ta xato qilingan savolni takrorlash`
                    : "Hozircha xatolar mavjud emas"}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#C7C7CC]" />
          </button>

          {/* History */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onNavigateTab('history');
            }}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F2F2F7]/50 transition-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#34C759] flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#1C1C1E]">History (Tarix)</div>
                <div className="text-xs text-[#8E8E93]">Jami ishlangan {stats.totalAnswered} ta javob</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#C7C7CC]" />
          </button>

          {/* Statistics */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onNavigateTab('stats');
            }}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F2F2F7]/50 transition-press"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#AF52DE] flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#1C1C1E]">Statistics (Statistika)</div>
                <div className="text-xs text-[#8E8E93]">Aniqlik darajasi: {stats.accuracy}%</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#C7C7CC]" />
          </button>
        </div>
      </div>
    </div>
  );
};
