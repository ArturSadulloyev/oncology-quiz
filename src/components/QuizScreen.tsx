import React, { useState, useEffect, useMemo } from 'react';
import { Question, OptionKey, QuizMode } from '../types/quiz';
import { shuffleArray } from '../lib/spaced-repetition';
import { triggerHaptic } from '../lib/telegram';
import {
  X,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Check,
  Sparkles,
} from 'lucide-react';

interface QuizScreenProps {
  questions: Question[];
  mode: QuizMode;
  onAnswer: (questionId: string, selected: OptionKey, isCorrect: boolean) => void;
  onFinish: () => void;
  onExit: () => void;
}

interface DisplayChoice {
  key: OptionKey;
  text: string;
}

const DISPLAY_LETTERS = ['A', 'B', 'C', 'D'];

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  mode,
  onAnswer,
  onFinish,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<OptionKey | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [sessionResults, setSessionResults] = useState<{
    correctCount: number;
    wrongCount: number;
  }>({ correctCount: 0, wrongCount: 0 });
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Randomize answer order per question without mutating correct answer key
  const randomizedChoices: DisplayChoice[] = useMemo(() => {
    if (!currentQuestion) return [];
    const choices: DisplayChoice[] = [
      { key: 'a', text: currentQuestion.option_a },
      { key: 'b', text: currentQuestion.option_b },
      { key: 'c', text: currentQuestion.option_c },
      { key: 'd', text: currentQuestion.option_d },
    ];
    return shuffleArray(choices);
  }, [currentQuestion?.id]);

  const handleSelectOption = (choiceKey: OptionKey) => {
    // Prevent double submission or selecting after already answered
    if (isAnswerSubmitted || selectedOption !== null) return;

    setSelectedOption(choiceKey);
    setIsAnswerSubmitted(true);

    const isCorrect = choiceKey === currentQuestion.correct_option;
    if (isCorrect) {
      triggerHaptic('success');
      setSessionResults((prev) => ({ ...prev, correctCount: prev.correctCount + 1 }));
    } else {
      triggerHaptic('error');
      setSessionResults((prev) => ({ ...prev, wrongCount: prev.wrongCount + 1 }));
    }

    onAnswer(currentQuestion.id, choiceKey, isCorrect);
  };

  const handleNextQuestion = () => {
    triggerHaptic('light');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsCompleted(true);
    }
  };

  const getModeTitle = (m: QuizMode) => {
    switch (m) {
      case 'smart':
        return 'Smart Review';
      case 'quick':
        return 'Quick Test';
      case 'all':
        return 'Barcha savollar';
      case 'mistakes':
        return 'Xatolar ustida ishlash';
      case 'single':
        return 'Qayta ishlash';
      default:
        return 'Quiz';
    }
  };

  // If completed, show session summary
  if (isCompleted || !currentQuestion) {
    const total = sessionResults.correctCount + sessionResults.wrongCount;
    const accuracy = total > 0 ? Math.round((sessionResults.correctCount / total) * 100) : 0;

    return (
      <div className="flex flex-col min-h-screen px-4 pt-8 pb-10 justify-between">
        <div className="flex flex-col items-center text-center mt-6">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 shadow-card">
            <Trophy className="w-10 h-10 text-[#007AFF]" />
          </div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#8E8E93] mb-1">
            Mashq yakunlandi
          </span>
          <h2 className="text-2xl font-black text-[#1C1C1E] tracking-tight">
            Natijalar
          </h2>
          <p className="text-xs text-[#8E8E93] mt-1 max-w-xs">
            {accuracy >= 80
              ? "Ajoyib natija! Onkologiya bilimlaringiz yuqori darajada."
              : accuracy >= 50
              ? "Yaxshi natija! Zaif savollarni yana bir bor takrorlashni tavsiya qilamiz."
              : "Xatolar ustida ishlab, testni qayta topshirishni unutmang."}
          </p>

          {/* Stats summary card */}
          <div className="w-full bg-white rounded-3xl border border-[#E5E5EA] p-5 shadow-card mt-6">
            <div className="text-4xl font-black text-[#1C1C1E] mb-1">
              {accuracy}%
            </div>
            <div className="text-xs font-semibold text-[#8E8E93] mb-5">
              Umumiy aniqlik
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E5E5EA]">
              <div className="bg-[#ECFDF3] rounded-2xl p-3 flex flex-col items-center">
                <span className="text-xs font-medium text-[#027A48]">Toʻgʻri</span>
                <span className="text-xl font-black text-[#027A48]">
                  {sessionResults.correctCount}
                </span>
              </div>
              <div className="bg-[#FEF3F2] rounded-2xl p-3 flex flex-col items-center">
                <span className="text-xs font-medium text-[#B42318]">Notoʻgʻri</span>
                <span className="text-xl font-black text-[#B42318]">
                  {sessionResults.wrongCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 mt-8">
          <button
            onClick={() => {
              triggerHaptic('light');
              onFinish();
            }}
            className="w-full py-4 bg-[#007AFF] text-white rounded-2xl font-bold text-sm shadow-button transition-press flex items-center justify-center gap-2"
          >
            <span>Bosh sahifaga qaytish</span>
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;
  const isCorrectChoice = selectedOption === currentQuestion.correct_option;

  // Find the full text of the correct option for display when wrong
  const correctOptionText =
    currentQuestion[`option_${currentQuestion.correct_option}` as keyof Question] || '';

  return (
    <div className="flex flex-col min-h-screen px-4 pt-4 pb-8 justify-between">
      {/* Top Bar with Mode, Progress, and Exit */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wide">
              {getModeTitle(mode)}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#C7C7CC]" />
            <span className="text-xs font-semibold text-[#007AFF]">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              if (confirm('Mashqni toʻxtatib bosh sahifaga qaytasizmi?')) {
                onExit();
              }
            }}
            className="w-8 h-8 rounded-full bg-white border border-[#E5E5EA] flex items-center justify-center text-[#8E8E93] hover:text-[#1C1C1E] transition-press shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#E5E5EA] rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-[#007AFF] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl border border-[#E5E5EA] p-5 shadow-card mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
              Savol #{currentIndex + 1}
            </span>
            {currentQuestion.topic && (
              <span className="text-[10px] bg-[#F2F2F7] text-[#8E8E93] font-medium px-2 py-0.5 rounded-full">
                {currentQuestion.topic}
              </span>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#1C1C1E] leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-2.5">
          {randomizedChoices.map((choice, idx) => {
            const letter = DISPLAY_LETTERS[idx];
            const isSelected = selectedOption === choice.key;
            const isCorrect = choice.key === currentQuestion.correct_option;

            let buttonStyle = 'bg-white border-[#E5E5EA] text-[#1C1C1E] hover:border-blue-200';
            let badgeStyle = 'bg-[#F2F2F7] text-[#1C1C1E]';

            if (isAnswerSubmitted) {
              if (isCorrect) {
                // Correct answer is always green
                buttonStyle = 'bg-[#ECFDF3] border-[#34C759] text-[#027A48] shadow-sm';
                badgeStyle = 'bg-[#34C759] text-white';
              } else if (isSelected && !isCorrect) {
                // Selected wrong answer is red
                buttonStyle = 'bg-[#FEF3F2] border-[#FF3B30] text-[#B42318] shadow-sm';
                badgeStyle = 'bg-[#FF3B30] text-white';
              } else {
                // Other options are dimmed
                buttonStyle = 'bg-white/60 border-[#E5E5EA] text-[#8E8E93] opacity-60';
                badgeStyle = 'bg-[#F2F2F7] text-[#8E8E93]';
              }
            }

            return (
              <button
                key={choice.key}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(choice.key)}
                className={`w-full min-h-[58px] p-3.5 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${buttonStyle} ${
                  !isAnswerSubmitted ? 'transition-press active:scale-[0.985]' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${badgeStyle}`}
                >
                  {letter}
                </div>
                <div className="flex-1 text-sm font-medium leading-relaxed pt-0.5">
                  {choice.text}
                </div>
                {isAnswerSubmitted && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-[#34C759] shrink-0 mt-0.5" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-[#FF3B30] shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Feedback Banner and Next Button */}
      {isAnswerSubmitted && (
        <div className="mt-5 pt-3 border-t border-[#E5E5EA] space-y-3 animate-fade-in">
          {/* Result Banner */}
          <div
            className={`p-3.5 rounded-2xl border flex flex-col gap-1 ${
              isCorrectChoice
                ? 'bg-[#ECFDF3] border-[#34C759]/40 text-[#027A48]'
                : 'bg-[#FEF3F2] border-[#FF3B30]/40 text-[#B42318]'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-sm">
              {isCorrectChoice ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>✓ Toʻgʻri</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4 stroke-[3]" />
                  <span>✕ Notoʻgʻri</span>
                </>
              )}
            </div>
            {!isCorrectChoice && (
              <div className="text-xs text-[#B42318]/90 font-medium leading-relaxed mt-0.5">
                <span className="font-bold">Toʻgʻri javob: </span>
                {correctOptionText as string}
              </div>
            )}
          </div>

          {/* Next Question CTA */}
          <button
            onClick={handleNextQuestion}
            className="w-full py-4 bg-[#007AFF] hover:bg-[#0066D6] text-white rounded-2xl font-bold text-sm shadow-button transition-press flex items-center justify-center gap-2"
          >
            <span>
              {currentIndex < questions.length - 1 ? 'Keyingi savol →' : 'Natijalarni koʻrish →'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
