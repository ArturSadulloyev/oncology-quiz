import React, { useMemo } from 'react';
import { AnswerRecord, Question } from '../types/quiz';
import { triggerHaptic } from '../lib/telegram';
import { RotateCcw, CheckCircle2, XCircle, Calendar, Play } from 'lucide-react';

interface HistoryScreenProps {
  history: AnswerRecord[];
  getQuestion: (id: string) => Question | undefined;
  onPracticeSingle: (question: Question) => void;
}

interface GroupedHistory {
  dateLabel: string;
  items: {
    record: AnswerRecord;
    question?: Question;
  }[];
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  getQuestion,
  onPracticeSingle,
}) => {
  const groupedHistory = useMemo<GroupedHistory[]>(() => {
    const groups: Record<string, { record: AnswerRecord; question?: Question }[]> = {};

    const todayStr = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    for (const record of history) {
      const recDate = new Date(record.answered_at);
      const recDateStr = recDate.toDateString();

      let label = recDate.toLocaleDateString('uz-UZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      if (recDateStr === todayStr) {
        label = 'Bugun';
      } else if (recDateStr === yesterdayStr) {
        label = 'Kecha';
      }

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push({
        record,
        question: getQuestion(record.question_id),
      });
    }

    return Object.entries(groups).map(([dateLabel, items]) => ({
      dateLabel,
      items,
    }));
  }, [history, getQuestion]);

  return (
    <div className="flex flex-col min-h-full px-4 pt-5 pb-24">
      {/* Header */}
      <header className="mb-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#8E8E93]">
          Javoblar Tarixi
        </span>
        <h1 className="text-2xl font-extrabold text-[#1C1C1E] tracking-tight">
          Tarix
        </h1>
        <p className="text-xs text-[#8E8E93] mt-0.5">
          Avval yechilgan barcha savollar va natijalar
        </p>
      </header>

      {history.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-[#E5E5EA] p-8 text-center shadow-card flex flex-col items-center my-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#007AFF] flex items-center justify-center mb-3">
            <RotateCcw className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-[#1C1C1E]">
            Hozircha tarix mavjud emas
          </h2>
          <p className="text-xs text-[#8E8E93] mt-1 max-w-xs leading-relaxed">
            Mashqni boshlaganingizdan soʻng bu yerda barcha ishlangan savollaringiz va xatolaringiz saqlanadi.
          </p>
        </div>
      ) : (
        /* History Timeline */
        <div className="space-y-6">
          {groupedHistory.map((group) => (
            <div key={group.dateLabel} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Calendar className="w-3.5 h-3.5 text-[#8E8E93]" />
                <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">
                  {group.dateLabel}
                </span>
                <span className="text-[11px] text-[#8E8E93] font-medium">
                  ({group.items.length} ta javob)
                </span>
              </div>

              <div className="space-y-2.5">
                {group.items.map(({ record, question }) => {
                  if (!question) return null;

                  const timeStr = new Date(record.answered_at).toLocaleTimeString('uz-UZ', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  const selectedText =
                    question[`option_${record.selected_option}` as keyof Question] || '';
                  const correctText =
                    question[`option_${question.correct_option}` as keyof Question] || '';

                  return (
                    <div
                      key={record.id}
                      className="bg-white rounded-2xl border border-[#E5E5EA] p-4 shadow-card space-y-3"
                    >
                      {/* Top meta */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {record.is_correct ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#027A48] bg-[#ECFDF3] px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
                              Toʻgʻri
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B42318] bg-[#FEF3F2] px-2.5 py-0.5 rounded-full">
                              <XCircle className="w-3.5 h-3.5 text-[#FF3B30]" />
                              Notoʻgʻri
                            </span>
                          )}
                          <span className="text-[11px] text-[#8E8E93]">{timeStr}</span>
                        </div>

                        {/* Practice this question again button */}
                        <button
                          onClick={() => {
                            triggerHaptic('light');
                            onPracticeSingle(question);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#007AFF] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-xl transition-press"
                        >
                          <Play className="w-3 h-3 fill-[#007AFF]" />
                          <span>Qayta ishlash</span>
                        </button>
                      </div>

                      {/* Question text */}
                      <div className="text-xs sm:text-sm font-bold text-[#1C1C1E] leading-snug">
                        {question.question}
                      </div>

                      {/* Answers detail */}
                      <div className="text-xs space-y-1.5 pt-1 border-t border-[#F2F2F7]">
                        <div className="flex items-start gap-1.5">
                          <span className="text-[#8E8E93] min-w-[75px] shrink-0">Sizning javob:</span>
                          <span
                            className={`font-semibold ${
                              record.is_correct ? 'text-[#027A48]' : 'text-[#B42318]'
                            }`}
                          >
                            {selectedText as string}
                          </span>
                        </div>
                        {!record.is_correct && (
                          <div className="flex items-start gap-1.5">
                            <span className="text-[#8E8E93] min-w-[75px] shrink-0">Toʻgʻri javob:</span>
                            <span className="font-semibold text-[#027A48]">
                              {correctText as string}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
