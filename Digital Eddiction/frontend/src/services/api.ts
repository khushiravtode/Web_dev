import { ActivityItem, IntentionCategory, BrainBreakType } from '../types';
import { apiClient, ApiError } from './apiClient';

export { ApiError };

export interface AnalyzeActivityParams {
  intention: IntentionCategory;
  goalTopic: string;
  appName: string;
  windowTitle: string;
  urlDomain: string;
  durationSeconds: number;
  contextNotes?: string;
}

export interface ActivityAnalysisResult {
  isAligned: boolean;
  alignmentConfidence: number;
  driftLevel: 'none' | 'low' | 'medium' | 'high';
  category: string;
  contextualReasoning: string;
  smartNudge: {
    title: string;
    message: string;
    suggestionAction: 'continue' | 'take_break' | 'refocus' | 'switch_task';
    microStep?: string;
  } | null;
  suggestedBreakType: BrainBreakType | null;
}

export interface CreateSessionPayload {
  sessionId: string;
  intention: string;
  durationMinutes: number;
  sessionStartTime: string;
  goalTopic?: string;
  allowedExceptions?: string[];
}

export interface DashboardResponse {
  wellnessScore: number;
  wellnessDelta: number;
  screenTimeHours: number;
  screenTimeMinutes: number;
  intentionalUsagePercent: number;
  digitalDriftMinutes: number;
  focusStreakDays: number;
  insights: string[];
  currentSession?: any;
}

export interface UsageCategory {
  category: string;
  minutes: number;
  percentage: number;
  color: string;
}

export interface ProgressResponse {
  wellnessScore: { previous: number; current: number; delta: number };
  digitalDrift: { previousMinutes: number; currentMinutes: number; deltaPercent: number };
  focusSessions: { previous: number; current: number; deltaPercent: number };
  focusStreakDays: number;
  weeklyChart: Array<{
    day: string;
    wellnessScore: number;
    digitalDriftMinutes: number;
    focusTimeMinutes: number;
  }>;
  intentionalVsPassive: {
    intentionalPercent: number;
    passivePercent: number;
  };
  insights: string[];
  recommendation: string;
}

export interface BrainBreakCompletePayload {
  activity: string;
  durationSeconds: number;
  rating?: number;
}

export const apiService = {
  // 1. POST /api/auth/register
  async registerUser(userData: { name: string; email: string; password?: string; primaryGoal?: string }) {
    try {
      const data = await apiClient.post<{
        success: boolean;
        user: { id: string; name: string; email: string; role?: string; createdAt?: string };
        token?: string;
        message?: string;
      }>('/api/auth/register', userData);
      return data;
    } catch (err: any) {
      if (err instanceof ApiError && !err.isNetworkError) {
        throw err;
      }
      // Offline fallback
      return {
        success: true,
        user: {
          id: 'u_' + Date.now(),
          email: userData.email,
          name: userData.name,
        },
        token: `jwt_mock_${Date.now()}`,
      };
    }
  },

  // 2. POST /api/auth/login
  async loginUser(credentials: { email: string; password?: string; rememberMe?: boolean }) {
    try {
      const data = await apiClient.post<{
        success: boolean;
        user: { id: string; name: string; email: string; role?: string; createdAt?: string };
        token?: string;
        message?: string;
      }>('/api/auth/login', credentials);
      return data;
    } catch (err: any) {
      if (err instanceof ApiError && !err.isNetworkError) {
        throw err;
      }
      // Offline fallback
      return {
        success: true,
        user: {
          id: 'u_' + Date.now(),
          email: credentials.email,
          name: credentials.email.split('@')[0].replace(/[._]/g, ' '),
        },
        token: `jwt_mock_${Date.now()}`,
      };
    }
  },

  // 3. POST /api/sessions (Create focus session)
  async createSession(payload: CreateSessionPayload): Promise<{ success: boolean; session?: any }> {
    try {
      const data = await apiClient.post<{ success: boolean; session?: any }>('/api/sessions', payload);
      return data;
    } catch (err: any) {
      if (err instanceof ApiError && !err.isNetworkError) {
        throw err;
      }
      return { success: true, session: payload };
    }
  },

  // 4. GET /api/dashboard (Get wellness score, focus streak, stats)
  async getDashboardData(): Promise<DashboardResponse> {
    try {
      const data = await apiClient.get<DashboardResponse>('/api/dashboard');
      return data;
    } catch (err: any) {
      if (err instanceof ApiError && !err.isNetworkError) {
        throw err;
      }
      return {
        wellnessScore: 78,
        wellnessDelta: 6,
        screenTimeHours: 3,
        screenTimeMinutes: 24,
        intentionalUsagePercent: 62,
        digitalDriftMinutes: 18,
        focusStreakDays: 13,
        insights: [
          'Your longest focused period was 42 minutes.',
          'Digital Drift decreased 18% compared with yesterday.',
          'Your strongest focus period is between 7 PM and 9 PM.',
        ],
      };
    }
  },

  // 5. GET /api/usage (Get category breakdown)
  async getUsageData(): Promise<UsageCategory[]> {
    try {
      const data = await apiClient.get<UsageCategory[]>('/api/usage');
      return data;
    } catch (err: any) {
      if (err instanceof ApiError && !err.isNetworkError) {
        throw err;
      }
      return [
        { category: 'Study', minutes: 110, percentage: 54, color: '#059669' },
        { category: 'Work', minutes: 45, percentage: 22, color: '#0d9488' },
        { category: 'Social', minutes: 18, percentage: 9, color: '#f59e0b' },
        { category: 'Entertainment', minutes: 20, percentage: 10, color: '#8b5cf6' },
        { category: 'Other', minutes: 11, percentage: 5, color: '#71717a' },
      ];
    }
  },

  // 6. POST /api/activity (Record real-time activity)
  async recordActivity(activity: ActivityItem): Promise<{ success: boolean; activity?: any }> {
    try {
      const data = await apiClient.post<{ success: boolean; activity?: any }>('/api/activity', activity);
      return data;
    } catch (err: any) {
      if (err instanceof ApiError && !err.isNetworkError) {
        throw err;
      }
      return { success: true, activity };
    }
  },

  // 7. GET /api/insights (Get personalized habit insights)
  async getInsights(): Promise<string[]> {
    try {
      const data = await apiClient.get<string[] | { insights: string[] }>('/api/insights');
      if (Array.isArray(data)) return data;
      if (data && Array.isArray((data as any).insights)) return (data as any).insights;
      return [];
    } catch (err: any) {
      if (err instanceof ApiError && !err.isNetworkError) {
        throw err;
      }
      return [
        'Your longest focused period was 42 minutes.',
        'Digital Drift decreased 18% compared with yesterday.',
        'Your strongest focus period is between 7 PM and 9 PM.',
      ];
    }
  },

  // 8. GET /api/progress (Get weekly trend & habit data)
  async getProgress(): Promise<ProgressResponse> {
    try {
      const data = await apiClient.get<ProgressResponse>('/api/progress');
      return data;
    } catch (err: any) {
      if (err instanceof ApiError && !err.isNetworkError) {
        throw err;
      }
      return {
        wellnessScore: { previous: 72, current: 81, delta: 9 },
        digitalDrift: { previousMinutes: 35, currentMinutes: 20, deltaPercent: -43 },
        focusSessions: { previous: 4, current: 7, deltaPercent: 75 },
        focusStreakDays: 13,
        weeklyChart: [
          { day: 'Mon', wellnessScore: 74, digitalDriftMinutes: 32, focusTimeMinutes: 140 },
          { day: 'Tue', wellnessScore: 76, digitalDriftMinutes: 28, focusTimeMinutes: 165 },
          { day: 'Wed', wellnessScore: 78, digitalDriftMinutes: 25, focusTimeMinutes: 190 },
          { day: 'Thu', wellnessScore: 80, digitalDriftMinutes: 22, focusTimeMinutes: 210 },
          { day: 'Fri', wellnessScore: 79, digitalDriftMinutes: 24, focusTimeMinutes: 180 },
          { day: 'Sat', wellnessScore: 82, digitalDriftMinutes: 18, focusTimeMinutes: 150 },
          { day: 'Sun', wellnessScore: 81, digitalDriftMinutes: 20, focusTimeMinutes: 175 },
        ],
        intentionalVsPassive: {
          intentionalPercent: 78,
          passivePercent: 22,
        },
        insights: [
          'Your focus is strongest between 7 PM and 9 PM.',
          'Your Digital Drift decreased compared with last week.',
          'You complete longer sessions when you take a short break after 30–40 minutes.',
        ],
        recommendation:
          'Tomorrow, try a 30-minute focused Study session followed by a 2-minute Brain Break.',
      };
    }
  },

  // 9. POST /api/activity/intentional (Mark activity intentional)
  async markActivityIntentional(activityId: string, isAligned = true, reason?: string): Promise<{ success: boolean }> {
    try {
      const data = await apiClient.post<{ success: boolean }>('/api/activity/intentional', {
        activityId,
        isAligned,
        reason,
      });
      return data;
    } catch (err: any) {
      if (err instanceof ApiError && !err.isNetworkError) {
        throw err;
      }
      return { success: true };
    }
  },

  // 10. POST /api/brain-break/complete (Record brain break completion)
  async completeBrainBreak(payload: BrainBreakCompletePayload): Promise<{ success: boolean; refreshedScore?: number }> {
    try {
      const data = await apiClient.post<{ success: boolean; refreshedScore?: number }>(
        '/api/brain-break/complete',
        payload
      );
      return data;
    } catch (err: any) {
      if (err instanceof ApiError && !err.isNetworkError) {
        throw err;
      }
      return { success: true, refreshedScore: 94 };
    }
  },

  // AI Contextual Analysis (POST /api/analyze-activity)
  async analyzeActivity(params: AnalyzeActivityParams): Promise<ActivityAnalysisResult> {
    try {
      const data = await apiClient.post<ActivityAnalysisResult>('/api/analyze-activity', params);
      if (data && typeof data.isAligned === 'boolean') {
        return data;
      }
    } catch {
      // Backend activity analysis fallback triggered
    }

    return this.fallbackAnalysis(params);
  },

  // Fallback intelligent heuristics
  fallbackAnalysis(params: AnalyzeActivityParams): ActivityAnalysisResult {
    const { intention, goalTopic, appName, windowTitle, urlDomain, durationSeconds } = params;
    const text = `${appName} ${windowTitle} ${urlDomain} ${goalTopic}`.toLowerCase();

    const isEducational =
      /tutorial|lecture|course|math|physics|biology|chemistry|code|github|docs|stack|notion|canvas|blackboard|coursera|khan|wikipedia|paper|pdf|research|chegg|quizlet|geeksforgeeks|figma|overleaf|arxiv/i.test(
        text
      );

    const isEntertainment =
      /reels|shorts|tiktok|viral|funny|game|twitch|netflix|anime|cart|checkout|shoes|discount|celebrity|gossip|speedrun|streamer|clash|steam/i.test(
        text
      );

    let isAligned = true;
    let driftLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
    let reasoning = `Your active application (${appName}) matches your current ${intention} session.`;
    let nudge: ActivityAnalysisResult['smartNudge'] = null;

    if (intention === 'Study' || intention === 'Work') {
      if (isEntertainment) {
        isAligned = false;
        driftLevel = durationSeconds > 120 ? 'high' : 'medium';
        reasoning = `MindfulLoop detected an algorithmic entertainment loop on ${appName}. While ${appName} can be used for learning, current content appears recreational.`;
        nudge = {
          title: 'Gentle Focus Check-in',
          message: `You started this session to ${intention.toLowerCase()} on "${goalTopic || 'your goals'}". Notice if this tab is giving you genuine value or pulling you into auto-pilot.`,
          suggestionAction: 'refocus',
          microStep: 'Take 2 calm breaths, close this tab, and open your main study notes.',
        };
      } else if (isEducational) {
        isAligned = true;
        driftLevel = 'none';
        reasoning = `Even though ${appName} is often recreational, your active content ("${windowTitle.slice(0, 45)}...") is directly educational and aligned with "${goalTopic || intention}".`;
      }
    } else if (intention === 'Creative Work' || (intention as string) === 'Creative') {
      if (isEntertainment && !text.includes('inspiration') && !text.includes('design')) {
        isAligned = false;
        driftLevel = 'low';
        reasoning = `Recreational feed detected during Creative Work session.`;
      } else {
        isAligned = true;
        driftLevel = 'none';
        reasoning = `Creative research & visual ideation detected on ${appName}.`;
      }
    } else if (intention === 'Entertainment') {
      isAligned = true;
      driftLevel = 'none';
      reasoning = `You intentionally set this time for relaxation and entertainment. Enjoy your intentional downtime!`;
    }

    return {
      isAligned,
      alignmentConfidence: 0.92,
      driftLevel,
      category: isEntertainment ? 'entertainment' : isEducational ? 'educational' : 'productive',
      contextualReasoning: reasoning,
      smartNudge: nudge,
      suggestedBreakType: driftLevel === 'high' ? 'breathing' : 'eye_reset',
    };
  },

  // Generate personalized Smart Nudge (POST /api/generate-nudge)
  async generateSmartNudge(
    intention: IntentionCategory,
    goalTopic: string,
    appName: string,
    driftReason: string,
    nudgeStyle: 'empathetic' | 'direct' | 'socratic' = 'empathetic'
  ): Promise<{ title: string; message: string; microStep: string }> {
    try {
      const data = await apiClient.post<{ title: string; message: string; microStep: string }>('/api/generate-nudge', {
        intention,
        goalTopic,
        appName,
        driftReason,
        nudgeStyle,
      });
      if (data && data.title) {
        return data;
      }
    } catch {
      // ignore
    }

    if (nudgeStyle === 'socratic') {
      return {
        title: 'Mindful Inquiry',
        message: `Is spending time on ${appName} right now bringing you closer to finishing "${goalTopic || intention}"?`,
        microStep: 'Pause for 10 seconds. Ask yourself: "What is my next single micro-action?"',
      };
    } else if (nudgeStyle === 'direct') {
      return {
        title: 'Intentional Boundary',
        message: `You are drifting onto ${appName} during your ${intention} session.`,
        microStep: 'Switch back to your active task tab now.',
      };
    }

    return {
      title: 'Gentle Transition Reminder',
      message: `It is completely natural for focus to wander when studying "${goalTopic || intention}". Give yourself grace and re-align gently.`,
      microStep: 'Drop your shoulders, inhale for 4 seconds, and re-open your primary work document.',
    };
  },

  // Generate weekly AI insights (POST /api/generate-insights)
  async generateWeeklyInsights(
    sessionSummary: any,
    userProfile: any
  ): Promise<{
    overallHealthScore: number;
    keyObservation: string;
    actionableHabits: string[];
    weeklyAffirmation: string;
  }> {
    try {
      const data = await apiClient.post<{
        overallHealthScore: number;
        keyObservation: string;
        actionableHabits: string[];
        weeklyAffirmation: string;
      }>('/api/generate-insights', { sessionSummary, userProfile });
      if (data && data.overallHealthScore) {
        return data;
      }
    } catch {
      // ignore
    }

    return {
      overallHealthScore: 86,
      keyObservation: 'High intentional alignment during morning blocks; occasional autoplay drift in late afternoons.',
      actionableHabits: [
        'Place a 20-minute cap on video research before transitioning to synthesis.',
        'Use the 20-20-20 eye strain reset between consecutive 45-minute study intervals.',
        'Set specific granular intention topics rather than broad "Study" to increase cognitive resistance to distraction.',
      ],
      weeklyAffirmation: 'Technology is a tool for your curiosity, not a master of your attention.',
    };
  },
};

// Export standalone named functions for compatibility
export const loginUser = (creds: any) => apiService.loginUser(creds);
export const registerUser = (data: any) => apiService.registerUser(data);
export const createSession = (data: any) => apiService.createSession(data);
export const getDashboardData = () => apiService.getDashboardData();
export const getUsageData = () => apiService.getUsageData();
export const getInsights = () => apiService.getInsights();
export const getProgress = () => apiService.getProgress();
export const sendActivity = (act: any) => apiService.recordActivity(act);
export const markActivityIntentional = (id: string, isAligned?: boolean, reason?: string) =>
  apiService.markActivityIntentional(id, isAligned, reason);
export const completeBrainBreak = (payload: BrainBreakCompletePayload) => apiService.completeBrainBreak(payload);

export default apiService;
