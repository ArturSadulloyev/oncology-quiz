'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { QUESTIONS_DATA, TOTAL_QUESTIONS_COUNT, getQuestionById } from '../data/questions';
import {
  Question,
  OptionKey,
  QuizMode,
  NavTab,
  QuestionProgress,
  AnswerRecord,
} from '../types/quiz';
import {
  loadLocalProgress,
  loadLocalHistory,
  recordLocalAnswer,
  calculateStats,
  getMistakeQuestionIds,
  UserStats,
} from '../lib/storage';
import { buildSmartReviewQueue, shuffleArray } from '../lib/spaced-repetition';
import {
  isTelegramWebApp,
  getTelegramWebApp,
  getTelegramUserForDevelopment,
  initTelegramApp,
  setupTelegramBackButton,
  TelegramUser,
} from '../lib/telegram';

import { HomeScreen } from '../components/HomeScreen';
import { QuizScreen } from '../components/QuizScreen';
import { MistakesScreen } from '../components/MistakesScreen';
import { HistoryScreen } from '../components/HistoryScreen';
import { StatsScreen } from '../components/StatsScreen';
import { PracticeScreen } from '../components/PracticeScreen';
import { BottomNav } from '../components/BottomNav';
import { DevEnvironmentBadge } from '../components/DevEnvironmentBadge';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [progress, setProgress] = useState<Record<string, QuestionProgress>>({});
  const [history, setHistory] = useState<AnswerRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Active quiz session state
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuizMode, setCurrentQuizMode] = useState<QuizMode>('smart');
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<Question[]>([]);

  // Telegram context state
  const [isTelegram, setIsTelegram] = useState(false);
  const [tgUser, setTgUser] = useState<TelegramUser>(getTelegramUserForDevelopment());

  // Initialize client state and Telegram WebApp
  useEffect(() => {
    initTelegramApp();
    const inTg = isTelegramWebApp();
    setIsTelegram(inTg);

    if (inTg) {
      const tg = getTelegramWebApp();
      if (tg?.initDataUnsafe?.user) {
        setTgUser(tg.initDataUnsafe.user);
      }
    }

    const savedProgress = loadLocalProgress();
    const savedHistory = loadLocalHistory();
    setProgress(savedProgress);
    setHistory(savedHistory);
    setIsLoaded(true);
  }, []);

  const stats: UserStats = useMemo(() => {
    return calculateStats(QUESTIONS_DATA, progress, history);
  }, [progress, history]);

  const mistakeQuestions: Question[] = useMemo(() => {
    const ids = getMistakeQuestionIds(progress, history);
    return ids.map((id) => getQuestionById(id)).filter((q): q is Question => Boolean(q));
  }, [progress, history]);

  // Start a quiz session
  const startQuiz = useCallback(
    (mode: QuizMode, specificQuestions?: Question[]) => {
      let questionsToPractice: Question[] = [];

      if (specificQuestions && specificQuestions.length > 0) {
        questionsToPractice = specificQuestions;
      } else {
        switch (mode) {
          case 'smart':
            questionsToPractice = buildSmartReviewQueue(QUESTIONS_DATA, progress, 20);
            break;
          case 'quick':
            questionsToPractice = shuffleArray(QUESTIONS_DATA).slice(0, 10);
            break;
          case 'all':
            questionsToPractice = [...QUESTIONS_DATA];
            break;
          case 'mistakes':
            questionsToPractice = shuffleArray(mistakeQuestions);
            break;
          default:
            questionsToPractice = shuffleArray(QUESTIONS_DATA).slice(0, 10);
            break;
        }
      }

      if (questionsToPractice.length === 0) {
        alert("Mashq uchun savollar topilmadi.");
        return;
      }

      setCurrentQuizMode(mode);
      setCurrentQuizQuestions(questionsToPractice);
      setIsQuizActive(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [progress, mistakeQuestions]
  );

  // Handle single question practice
  const handlePracticeSingle = (question: Question) => {
    startQuiz('single', [question]);
  };

  // Handle answering question in quiz
  const handleAnswerQuestion = (
    questionId: string,
    selectedOption: OptionKey,
    isCorrect: boolean
  ) => {
    const { progress: updatedProg, history: updatedHist } = recordLocalAnswer(
      questionId,
      selectedOption,
      isCorrect
    );
    setProgress({ ...updatedProg });
    setHistory([...updatedHist]);
  };

  const handleFinishQuiz = useCallback(() => {
    setIsQuizActive(false);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleExitQuiz = useCallback(() => {
    setIsQuizActive(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Sync Telegram native Back Button during active quiz
  useEffect(() => {
    if (isQuizActive) {
      const teardown = setupTelegramBackButton(() => {
        handleExitQuiz();
      });
      return teardown;
    }
  }, [isQuizActive, handleExitQuiz]);

  const handleResetData = () => {
    setProgress({});
    setHistory([]);
  };

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen p-6 text-center">
        <div className="w-8 h-8 border-3 border-[#007AFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative bg-[#F2F2F7]">
      {/* Dev / Debug Environment Indicator */}
      <DevEnvironmentBadge user={tgUser} isTelegram={isTelegram} />

      {/* Active Quiz Screen */}
      {isQuizActive && currentQuizQuestions.length > 0 ? (
        <QuizScreen
          questions={currentQuizQuestions}
          mode={currentQuizMode}
          onAnswer={handleAnswerQuestion}
          onFinish={handleFinishQuiz}
          onExit={handleExitQuiz}
        />
      ) : (
        <>
          <main className="flex-1">
            {activeTab === 'home' && (
              <HomeScreen
                stats={stats}
                totalQuestions={TOTAL_QUESTIONS_COUNT}
                userName={tgUser.first_name}
                onStartQuiz={startQuiz}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'practice' && (
              <PracticeScreen
                onStartQuiz={startQuiz}
                mistakesCount={stats.mistakesCount}
                dueCount={stats.dueCount}
                totalQuestions={TOTAL_QUESTIONS_COUNT}
              />
            )}

            {activeTab === 'mistakes' && (
              <MistakesScreen
                mistakeQuestions={mistakeQuestions}
                progress={progress}
                onStartMistakesQuiz={() => startQuiz('mistakes')}
                onPracticeSingle={handlePracticeSingle}
                onStartSmartReview={() => startQuiz('smart')}
              />
            )}

            {activeTab === 'history' && (
              <HistoryScreen
                history={history}
                getQuestion={getQuestionById}
                onPracticeSingle={handlePracticeSingle}
              />
            )}

            {activeTab === 'stats' && (
              <StatsScreen
                stats={stats}
                progress={progress}
                totalQuestions={TOTAL_QUESTIONS_COUNT}
                onResetData={handleResetData}
              />
            )}
          </main>

          {/* Persistent Bottom Navigation */}
          <BottomNav
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            mistakesBadgeCount={stats.mistakesCount}
          />
        </>
      )}
    </div>
  );
}
