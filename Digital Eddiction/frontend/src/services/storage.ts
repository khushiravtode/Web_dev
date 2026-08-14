import { ActivityItem, IntentionCategory, SmartNudge, BrainBreakType, UserProfile, DailyWellnessMetric, BrainBreakSession } from '../types';
import { INITIAL_USER_PROFILE, MOCK_WELLNESS_HISTORY, MOCK_RECENT_BREAKS } from '../data/mockData';

const KEYS = {
  PROFILE: 'mindfulloop_user_profile',
  ACTIVE_SESSION: 'mindfulloop_active_session',
  SESSION_HISTORY: 'mindfulloop_session_history',
  BREAK_HISTORY: 'mindfulloop_break_history',
  WELLNESS_METRICS: 'mindfulloop_wellness_metrics',
  USER_OVERRIDES: 'mindfulloop_user_overrides',
};

// Storage helper functions
export const storageService = {
  getProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(KEYS.PROFILE);
      return stored ? JSON.parse(stored) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile', e);
    }
  },

  getWellnessMetrics(): DailyWellnessMetric[] {
    try {
      const stored = localStorage.getItem(KEYS.WELLNESS_METRICS);
      return stored ? JSON.parse(stored) : MOCK_WELLNESS_HISTORY;
    } catch {
      return MOCK_WELLNESS_HISTORY;
    }
  },

  saveWellnessMetrics(metrics: DailyWellnessMetric[]): void {
    try {
      localStorage.setItem(KEYS.WELLNESS_METRICS, JSON.stringify(metrics));
    } catch (e) {
      console.warn('Failed to save wellness metrics', e);
    }
  },

  getBreakHistory(): BrainBreakSession[] {
    try {
      const stored = localStorage.getItem(KEYS.BREAK_HISTORY);
      return stored ? JSON.parse(stored) : MOCK_RECENT_BREAKS;
    } catch {
      return MOCK_RECENT_BREAKS;
    }
  },

  addBreakSession(session: BrainBreakSession): void {
    const list = this.getBreakHistory();
    const updated = [session, ...list].slice(0, 20);
    try {
      localStorage.setItem(KEYS.BREAK_HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to add break session', e);
    }
  },

  saveUserOverride(appName: string, intention: IntentionCategory, isApproved: boolean, note: string): void {
    try {
      const stored = localStorage.getItem(KEYS.USER_OVERRIDES);
      const overrides = stored ? JSON.parse(stored) : [];
      overrides.unshift({
        id: 'ov-' + Date.now(),
        appName,
        intention,
        isApproved,
        note,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(KEYS.USER_OVERRIDES, JSON.stringify(overrides.slice(0, 50)));

      // Also append to profile whitelist if approved
      if (isApproved) {
        const profile = this.getProfile();
        const exists = profile.customWhitelists.some(
          (w) => w.appName.toLowerCase() === appName.toLowerCase() && w.allowedForIntention === intention
        );
        if (!exists) {
          profile.customWhitelists.push({
            id: 'wl-' + Date.now(),
            appName,
            allowedForIntention: intention,
            note: note || 'User-verified intentional activity',
          });
          this.saveProfile(profile);
        }
      }
    } catch (e) {
      console.warn('Failed to save override', e);
    }
  },
};
