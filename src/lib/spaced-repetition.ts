import { Question, QuestionProgress } from '../types/quiz';

/**
 * Spaced Repetition System Intervals (in milliseconds)
 * Level 0: 10 minutes after a wrong answer
 * Level 1: 1 day
 * Level 2: 3 days
 * Level 3: 7 days
 * Level 4: 14 days
 * Level 5: 30 days
 */
export const INTERVALS_MS = [
  10 * 60 * 1000,          // Level 0: 10 minutes
  1 * 24 * 60 * 60 * 1000, // Level 1: 1 day
  3 * 24 * 60 * 60 * 1000, // Level 2: 3 days
  7 * 24 * 60 * 60 * 1000, // Level 3: 7 days
  14 * 24 * 60 * 60 * 1000,// Level 4: 14 days
  30 * 24 * 60 * 60 * 1000 // Level 5: 30 days
];

/**
 * Calculate the updated progress for a question after an answer attempt.
 * Rules:
 * - Correct answer increases mastery level by 1, up to 5.
 * - Wrong answer decreases mastery level by 1, minimum 0.
 * - Wrong answers become due again soon (Level 0 interval: 10 minutes).
 */
export function calculateNextProgress(
  current: QuestionProgress | undefined,
  questionId: string,
  isCorrect: boolean,
  now = Date.now()
): QuestionProgress {
  const timesSeen = (current?.times_seen ?? 0) + 1;
  const timesCorrect = (current?.times_correct ?? 0) + (isCorrect ? 1 : 0);
  const timesWrong = (current?.times_wrong ?? 0) + (isCorrect ? 0 : 1);

  let newMastery: number;
  let nextReviewAt: number;

  if (isCorrect) {
    const currentLevel = current?.mastery_level ?? 0;
    newMastery = Math.min(5, currentLevel + 1);
    const interval = INTERVALS_MS[newMastery] ?? INTERVALS_MS[5];
    nextReviewAt = now + interval;
  } else {
    const currentLevel = current?.mastery_level ?? 1;
    newMastery = Math.max(0, currentLevel - 1);
    // Wrong answers become due soon (10 min)
    nextReviewAt = now + INTERVALS_MS[0];
  }

  return {
    question_id: questionId,
    mastery_level: newMastery,
    times_seen: timesSeen,
    times_correct: timesCorrect,
    times_wrong: timesWrong,
    next_review_at: nextReviewAt,
    updated_at: now,
  };
}

/**
 * Prioritize questions for Smart Review:
 * 1. Questions that are due for review (next_review_at <= now)
 * 2. Weak questions (seen, mastery_level < 2 or times_wrong > 0)
 * 3. New questions (times_seen === 0)
 */
export function buildSmartReviewQueue(
  allQuestions: Question[],
  progressMap: Record<string, QuestionProgress>,
  sessionSize = 20,
  now = Date.now()
): Question[] {
  const due: Question[] = [];
  const weak: Question[] = [];
  const fresh: Question[] = [];
  const mastered: Question[] = [];

  for (const q of allQuestions) {
    const p = progressMap[q.id];
    if (!p || p.times_seen === 0) {
      fresh.push(q);
    } else if (p.next_review_at <= now) {
      due.push(q);
    } else if (p.mastery_level < 2 || p.times_wrong > p.times_correct) {
      weak.push(q);
    } else {
      mastered.push(q);
    }
  }

  // Sort due by oldest overdue first
  due.sort((a, b) => {
    const timeA = progressMap[a.id]?.next_review_at ?? 0;
    const timeB = progressMap[b.id]?.next_review_at ?? 0;
    return timeA - timeB;
  });

  // Sort weak by lowest mastery first
  weak.sort((a, b) => {
    const pA = progressMap[a.id];
    const pB = progressMap[b.id];
    return (pA?.mastery_level ?? 0) - (pB?.mastery_level ?? 0);
  });

  // Combine queues: due first, then weak, then fresh
  const combined = [...due, ...weak, ...fresh];

  // If still under session size, backfill with already mastered to reach session size if needed
  if (combined.length < sessionSize && mastered.length > 0) {
    combined.push(...mastered);
  }

  return combined.slice(0, sessionSize);
}

/**
 * Fisher-Yates shuffle helper
 */
export function shuffleArray<T>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
