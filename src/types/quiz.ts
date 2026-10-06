export type OptionKey = 'a' | 'b' | 'c' | 'd';

export interface Question {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: OptionKey;
  topic?: string;
  source_block?: number;
}

export interface QuestionProgress {
  question_id: string;
  mastery_level: number; // 0 to 5
  times_seen: number;
  times_correct: number;
  times_wrong: number;
  next_review_at: number; // ms timestamp
  updated_at: number;
}

export interface AnswerRecord {
  id: string;
  question_id: string;
  selected_option: OptionKey;
  is_correct: boolean;
  answered_at: number;
}

export type QuizMode = 'smart' | 'quick' | 'all' | 'mistakes' | 'single';

export type NavTab = 'home' | 'practice' | 'mistakes' | 'history' | 'stats';

export interface DisplayOption {
  key: OptionKey;
  text: string;
  originalLabel: string; // 'A', 'B', 'C', 'D'
}
