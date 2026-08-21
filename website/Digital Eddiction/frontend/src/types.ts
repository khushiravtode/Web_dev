export type IntentionCategory =
  | 'Study'
  | 'Work'
  | 'Creative'
  | 'Creative Work'
  | 'Personal Growth'
  | 'Entertainment'
  | 'Wellness'
  | 'Custom';

export type SessionStatus =
  | 'idle'
  | 'active'
  | 'paused'
  | 'drifting'
  | 'break'
  | 'completed';

export type DriftLevel = 'none' | 'low' | 'medium' | 'high';

export type ActivityCategory =
  | 'educational'
  | 'productive'
  | 'research'
  | 'communication'
  | 'entertainment'
  | 'social_media'
  | 'gaming'
  | 'shopping'
  | 'other';

export interface ActivityItem {
  id: string;
  appName: string;
  windowTitle: string;
  urlDomain: string;
  category: ActivityCategory;
  startTime: string;
  durationSeconds: number;
  isAligned: boolean;
  alignmentConfidence: number;
  driftLevel: DriftLevel;
  contextualReasoning: string;
  userOverride?: boolean;
  userOverrideReason?: string;
}

export interface SmartNudge {
  id: string;
  title: string;
  message: string;
  microStep?: string;
  suggestionAction: 'continue' | 'take_break' | 'refocus' | 'switch_task';
  timestamp: string;
  acknowledged: boolean;
  appName: string;
}

export type BrainBreakType =
  | 'breathing'
  | 'eye_reset'
  | 'stretch'
  | 'mindful_reset'
  | 'puzzle';

export interface BrainBreakSession {
  id: string;
  type: BrainBreakType;
  title: string;
  durationSeconds: number;
  completedAt: string;
  rating?: number;
  refreshedScore?: number;
}

export interface SessionState {
  id: string;
  intention: IntentionCategory;
  goalTopic: string;
  totalDurationMinutes: number;
  elapsedSeconds: number;
  status: SessionStatus;
  currentActivity: ActivityItem;
  activityHistory: ActivityItem[];
  currentDriftLevel: DriftLevel;
  activeNudge: SmartNudge | null;
  allowedContexts: string[];
  breakCount: number;
  startTime: string;
}

export interface UserProfile {
  name: string;
  email: string;
  major: string;
  institution: string;
  dailyTargetHours: number;
  driftSensitivity: 'gentle' | 'balanced' | 'strict';
  nudgeStyle: 'empathetic' | 'direct' | 'socratic';
  soundEnabled: boolean;
  preferredBreaks: BrainBreakType[];
  streakDays: number;
  totalIntentionalMinutes: number;
  totalDriftRecoveredCount: number;
  completedSessionsCount: number;
  joinedDate: string;
  customWhitelists: Array<{
    id: string;
    appName: string;
    allowedForIntention: IntentionCategory;
    note: string;
  }>;
}

export interface DailyWellnessMetric {
  date: string;
  dayLabel: string;
  intentionalMinutes: number;
  driftingMinutes: number;
  alignmentRate: number; // 0 - 100
  sessionsCount: number;
  breaksTaken: number;
  primaryIntention: IntentionCategory;
}

export interface PredefinedScenario {
  id: string;
  label: string;
  appName: string;
  windowTitle: string;
  urlDomain: string;
  forIntention: IntentionCategory;
  expectedAlignment: boolean;
  explanation: string;
}
