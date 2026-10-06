import { AnswerRecord, Question, QuestionProgress } from '../types/quiz';
import { calculateNextProgress } from './spaced-repetition';

const PROGRESS_STORAGE_KEY = 'oncology_quiz_progress_v1';
const HISTORY_STORAGE_KEY = 'oncology_quiz_history_v1';
const STREAK_STORAGE_KEY = 'oncology_quiz_streak_v1';

export interface UserStats {
  totalAnswered: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
  masteredCount: number;
  dueCount: number;
  mistakesCount: number;
  newCount: number;
  currentStreak: number;
  todayReviewsCount: number;
}

export function loadLocalProgress(): Record<string, QuestionProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to load local progress:', e);
    return {};
  }
}

export function saveLocalProgress(progress: Record<string, QuestionProgress>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save local progress:', e);
  }
}

export function loadLocalHistory(): AnswerRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load local history:', e);
    return [];
  }
}

export function saveLocalHistory(history: AnswerRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save local history:', e);
  }
}

export function recordLocalAnswer(
  questionId: string,
  selectedOption: 'a' | 'b' | 'c' | 'd',
  isCorrect: boolean
): { progress: Record<string, QuestionProgress>; history: AnswerRecord[] } {
  const now = Date.now();
  const currentProgress = loadLocalProgress();
  const updatedProg = calculateNextProgress(currentProgress[questionId], questionId, isCorrect, now);
  currentProgress[questionId] = updatedProg;
  saveLocalProgress(currentProgress);

  const currentHistory = loadLocalHistory();
  const newRecord: AnswerRecord = {
    id: `ans_${now}_${Math.random().toString(36).substring(2, 7)}`,
    question_id: questionId,
    selected_option: selectedOption,
    is_correct: isCorrect,
    answered_at: now,
  };
  const updatedHistory = [newRecord, ...currentHistory];
  saveLocalHistory(updatedHistory);

  updateStreak(now);

  return { progress: currentProgress, history: updatedHistory };
}

export function getMistakeQuestionIds(
  progress: Record<string, QuestionProgress>,
  history: AnswerRecord[]
): string[] {
  // Questions that have times_wrong > 0 and haven't reached high mastery yet
  const ids = new Set<string>();
  for (const [id, p] of Object.entries(progress)) {
    if (p.times_wrong > 0 && p.mastery_level < 3) {
      ids.add(id);
    }
  }
  // Also check recent wrong answers
  for (const h of history) {
    if (!h.is_correct && !ids.has(h.question_id)) {
      ids.add(h.question_id);
    }
  }
  return Array.from(ids);
}

export function calculateStats(
  allQuestions: Question[],
  progress: Record<string, QuestionProgress>,
  history: AnswerRecord[]
): UserStats {
  const totalAnswered = history.length;
  const totalCorrect = history.filter((h) => h.is_correct).length;
  const totalWrong = totalAnswered - totalCorrect;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const now = Date.now();
  let masteredCount = 0;
  let dueCount = 0;
  let seenCount = 0;

  for (const q of allQuestions) {
    const p = progress[q.id];
    if (p && p.times_seen > 0) {
      seenCount++;
      if (p.mastery_level >= 3) {
        masteredCount++;
      }
      if (p.next_review_at <= now) {
        dueCount++;
      }
    }
  }

  const newCount = Math.max(0, allQuestions.length - seenCount);
  const mistakes = getMistakeQuestionIds(progress, history);

  // Today's reviews count
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayTimestamp = startOfToday.getTime();
  const todayReviewsCount = history.filter((h) => h.answered_at >= todayTimestamp).length;

  const currentStreak = getStreak();

  return {
    totalAnswered,
    totalCorrect,
    totalWrong,
    accuracy,
    masteredCount,
    dueCount,
    mistakesCount: mistakes.length,
    newCount,
    currentStreak,
    todayReviewsCount,
  };
}

function updateStreak(now: number): void {
  if (typeof window === 'undefined') return;
  try {
    const todayStr = new Date(now).toISOString().slice(0, 10);
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    const data: { lastDate?: string; count: number } = raw ? JSON.parse(raw) : { count: 1 };

    if (!data.lastDate) {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify({ lastDate: todayStr, count: 1 }));
      return;
    }

    if (data.lastDate === todayStr) {
      return; // Already counted today
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (data.lastDate === yesterdayStr) {
      data.count += 1;
    } else {
      data.count = 1;
    }
    data.lastDate = todayStr;
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to update streak:', e);
  }
}

export function getStreak(): number {
  if (typeof window === 'undefined') return 1;
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (!raw) return 1;
    const data: { lastDate?: string; count: number } = JSON.parse(raw);
    return data.count || 1;
  } catch {
    return 1;
  }
}

export function resetLocalData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PROGRESS_STORAGE_KEY);
  localStorage.removeItem(HISTORY_STORAGE_KEY);
  localStorage.removeItem(STREAK_STORAGE_KEY);
}
