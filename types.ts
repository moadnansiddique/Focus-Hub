
export type RigidityLevel = 'Soft' | 'Standard' | 'Locked';
export type PersonalityType = 'Supportive' | 'Savage';

export interface AppItem {
  id: string;
  name: string;
  icon: string;
  category: 'Social' | 'Entertainment' | 'Work' | 'Utility' | 'Other';
  isBlocked: boolean;
}

export enum ChallengeStep {
  INTENT = 'INTENT',
  MATH = 'MATH',
  PHYSICAL = 'PHYSICAL',
  NATURAL = 'NATURAL',
  COMPLETED = 'COMPLETED'
}

export interface ActivityRow {
  id: string;
  time: string;
  activity: string;
  category: 'Work' | 'Leisure' | 'Errand' | 'Distraction';
  durationMinutes: number;
}

export interface ActivityAnalysis {
  summary: string;
  timeWastedMinutes: number;
  timeSavedMinutes: number;
  recommendations: string[];
  productivityScore: number;
}

export interface WellbeingStats {
  interceptions: number;
  allowedSessions: number;
  totalTimeSavedMinutes: number;
  focusHistory: number[];
  streak: number;
}

export interface MathProblem {
  question: string;
  answer: string;
  explanation: string;
}

export interface NaturalPrompt {
  prompt: string;
  guidance: string;
}
