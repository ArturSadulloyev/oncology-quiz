import { Question } from '../types/quiz';
import questionsRaw from './questions.json';

export const QUESTIONS_DATA: Question[] = questionsRaw as Question[];

export const TOTAL_QUESTIONS_COUNT = QUESTIONS_DATA.length;

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS_DATA.find((q) => q.id === id);
}
