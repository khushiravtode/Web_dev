import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  IntentionCategory,
  SessionState,
  ActivityItem,
  SmartNudge,
  BrainBreakType,
  UserProfile,
  DailyWellnessMetric,
  PredefinedScenario,
} from '../types';
import { storageService } from '../services/storage';
import { apiService } from '../services/api';
import { PREDEFINED_SCENARIOS } from '../data/mockData';
import { sound } from '../utils/sound';

interface SessionContextType {
  userProfile: UserProfile;
  updateProfile: (partial: Partial<UserProfile>) => void;
  activeSession: SessionState | null;
  startSession: (
    intention: IntentionCategory,
    goalTopic: string,
    durationMinutes: number,
    allowedContexts?: string[]
  ) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  extendSession: (minutes: number) => void;
  simulateActivity: (scenarioOrData: PredefinedScenario | Partial<ActivityItem>) => Promise<void>;
  overrideClassification: (activityId: string, isAligned: boolean, reason: string) => void;
  dismissNudge: () => void;
  recordBrainBreak: (type: BrainBreakType, durationSeconds: number, rating?: number) => void;
  wellnessMetrics: DailyWellnessMetric[];
  isAutoSimulating: boolean;
  setIsAutoSimulating: (val: boolean) => void;
  lastAnalysisReasoning: string;
  isAnalyzing: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const DEFAULT_ACTIVITY: ActivityItem = {
  id: 'act-init',
  appName: 'Notion',
  windowTitle: 'CS 189: Machine Learning Lecture Notes & Homework 4',
  urlDomain: 'notion.so/workspace/cs189',
  category: 'productive',
  startTime: new Date().toISOString(),
  durationSeconds: 120,
  isAligned: true,
  alignmentConfidence: 0.96,
  driftLevel: 'none',
  contextualReasoning: 'Active document matches your Study intention on CS 189 coursework.',
};

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [wellnessMetrics, setWellnessMetrics] = useState<DailyWellnessMetric[]>(() =>
    storageService.getWellnessMetrics()
  );
  const [activeSession, setActiveSession] = useState<SessionState | null>(() => {
    // Default to an active mock session so landing immediately has state
    return {
      id: 'sess-active-1',
      intention: 'Study',
      goalTopic: 'Linear Algebra & Optimization Algorithms',
      totalDurationMinutes: 45,
      elapsedSeconds: 840, // 14 mins in
      status: 'active',
      currentActivity: DEFAULT_ACTIVITY,
      activityHistory: [
        {
          id: 'act-prev-0',
          appName: 'Chrome',
          windowTitle: '3Blue1Brown: Essence of Linear Algebra (YouTube)',
          urlDomain: 'youtube.com/watch?v=fNk_zzaMoSs',
          category: 'productive',
          startTime: new Date(Date.now() - 360000).toISOString(),
          durationSeconds: 240,
          isAligned: true,
          alignmentConfidence: 0.94,
          driftLevel: 'none',
          contextualReasoning: 'Educational video on matrix transformations directly relevant to study intention.',
        },
        {
          id: 'act-prev-1',
          appName: 'VS Code',
          windowTitle: 'matrix_ops.py — algos-hw3 — Visual Studio Code',
          urlDomain: 'code.local',
          category: 'productive',
          startTime: new Date(Date.now() - 600000).toISOString(),
          durationSeconds: 600,
          isAligned: true,
          alignmentConfidence: 0.98,
          driftLevel: 'none',
          contextualReasoning: 'Python programming script aligned with optimization algorithms.',
        },
      ],
      currentDriftLevel: 'none',
      activeNudge: null,
      allowedContexts: ['YouTube (Lecture channels)', 'StackOverflow', 'Notion', 'VS Code'],
      breakCount: 1,
      startTime: new Date(Date.now() - 840000).toISOString(),
    };
  });

  const [isAutoSimulating, setIsAutoSimulating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysisReasoning, setLastAnalysisReasoning] = useState(
    'MindfulLoop continuously validates activity context against your active intention.'
  );

  const updateProfile = (partial: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...partial };
      storageService.saveProfile(updated);
      return updated;
    });
  };

  // Main session timer loop
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'active') return;

    const interval = setInterval(() => {
      setActiveSession((prev) => {
        if (!prev || prev.status !== 'active') return prev;

        const newElapsed = prev.elapsedSeconds + 1;
        const totalSecs = prev.totalDurationMinutes * 60;

        // Update current activity duration
        const updatedCurrent = {
          ...prev.currentActivity,
          durationSeconds: prev.currentActivity.durationSeconds + 1,
        };

        if (newElapsed >= totalSecs) {
          if (userProfile.soundEnabled) {
            sound.playCompletionCelebration();
          }
          return {
            ...prev,
            elapsedSeconds: totalSecs,
            status: 'completed',
            currentActivity: updatedCurrent,
          };
        }

        return {
          ...prev,
          elapsedSeconds: newElapsed,
          currentActivity: updatedCurrent,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession?.status, userProfile.soundEnabled]);

  // Optional background simulator to cycle realistic student activities
  useEffect(() => {
    if (!isAutoSimulating || !activeSession || activeSession.status !== 'active') return;

    let scenarioIndex = 0;
    const simInterval = setInterval(() => {
      const scenario = PREDEFINED_SCENARIOS[scenarioIndex % PREDEFINED_SCENARIOS.length];
      scenarioIndex++;
      simulateActivity(scenario);
    }, 18000);

    return () => clearInterval(simInterval);
  }, [isAutoSimulating, activeSession?.status]);

  const startSession = (
    intention: IntentionCategory,
    goalTopic: string,
    durationMinutes: number,
    allowedContexts: string[] = []
  ) => {
    const newSession: SessionState = {
      id: 'sess-' + Date.now(),
      intention,
      goalTopic: goalTopic.trim() || `${intention} Session`,
      totalDurationMinutes: durationMinutes,
      elapsedSeconds: 0,
      status: 'active',
      currentActivity: {
        id: 'act-' + Date.now(),
        appName: 'Browser / Workspace',
        windowTitle: `Starting: ${goalTopic || intention}`,
        urlDomain: 'workspace.local',
        category: 'productive',
        startTime: new Date().toISOString(),
        durationSeconds: 0,
        isAligned: true,
        alignmentConfidence: 0.95,
        driftLevel: 'none',
        contextualReasoning: `Session initialized for ${intention}: "${goalTopic}". All activities will be contextualized against this focus goal.`,
      },
      activityHistory: [],
      currentDriftLevel: 'none',
      activeNudge: null,
      allowedContexts: allowedContexts.length > 0 ? allowedContexts : ['General Research', 'Educational Media'],
      breakCount: 0,
      startTime: new Date().toISOString(),
    };

    setActiveSession(newSession);
    setLastAnalysisReasoning(`Intention locked: ${intention} on "${goalTopic || 'Target Goal'}".`);

    // Synchronize with POST /api/sessions
    apiService.createSession({
      sessionId: newSession.id,
      intention,
      durationMinutes,
      sessionStartTime: newSession.startTime,
      goalTopic,
      allowedExceptions: newSession.allowedContexts,
    }).catch(() => {});
  };

  const pauseSession = () => {
    setActiveSession((prev) => (prev ? { ...prev, status: 'paused' } : null));
  };

  const resumeSession = () => {
    setActiveSession((prev) => (prev ? { ...prev, status: 'active' } : null));
  };

  const extendSession = (minutes: number) => {
    setActiveSession((prev) =>
      prev
        ? {
            ...prev,
            totalDurationMinutes: prev.totalDurationMinutes + minutes,
            status: 'active',
          }
        : null
    );
  };

  const endSession = () => {
    if (!activeSession) return;
    // Log to daily metric
    const intentionalMins = Math.round(activeSession.elapsedSeconds / 60);
    setWellnessMetrics((prev) => {
      const today = prev[prev.length - 1];
      if (!today) return prev;
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...today,
        intentionalMinutes: today.intentionalMinutes + intentionalMins,
        sessionsCount: today.sessionsCount + 1,
      };
      storageService.saveWellnessMetrics(updated);
      return updated;
    });

    updateProfile({
      totalIntentionalMinutes: userProfile.totalIntentionalMinutes + intentionalMins,
      completedSessionsCount: userProfile.completedSessionsCount + 1,
    });

    setActiveSession((prev) => (prev ? { ...prev, status: 'completed' } : null));
  };

  const simulateActivity = async (scenarioOrData: PredefinedScenario | Partial<ActivityItem>) => {
    if (!activeSession) return;

    setIsAnalyzing(true);

    const appName = scenarioOrData.appName || 'Unknown App';
    const windowTitle = scenarioOrData.windowTitle || 'Current Tab';
    const urlDomain = scenarioOrData.urlDomain || 'web.local';

    // Check user whitelists
    const isWhitelisted = userProfile.customWhitelists.some(
      (w) =>
        w.appName.toLowerCase() === appName.toLowerCase() &&
        w.allowedForIntention === activeSession.intention
    );

    const analysis = await apiService.analyzeActivity({
      intention: activeSession.intention,
      goalTopic: activeSession.goalTopic,
      appName,
      windowTitle,
      urlDomain,
      durationSeconds: 90,
      contextNotes: isWhitelisted ? 'User marked this app as whitelisted for study.' : '',
    });

    setIsAnalyzing(false);

    const effectiveIsAligned = isWhitelisted ? true : analysis.isAligned;
    const effectiveDriftLevel = isWhitelisted ? 'none' : analysis.driftLevel;
    const reasoning = isWhitelisted
      ? `${appName} is in your verified intentional whitelist for ${activeSession.intention}.`
      : analysis.contextualReasoning;

    setLastAnalysisReasoning(reasoning);

    const newActivity: ActivityItem = {
      id: 'act-' + Date.now(),
      appName,
      windowTitle,
      urlDomain,
      category: analysis.category as any,
      startTime: new Date().toISOString(),
      durationSeconds: 15,
      isAligned: effectiveIsAligned,
      alignmentConfidence: analysis.alignmentConfidence,
      driftLevel: effectiveDriftLevel,
      contextualReasoning: reasoning,
    };

    // Forward activity telemetry to POST /api/activity
    apiService.recordActivity(newActivity).catch(() => {});

    let nudge: SmartNudge | null = null;
    if (!effectiveIsAligned && analysis.smartNudge) {
      nudge = {
        id: 'nudge-' + Date.now(),
        title: analysis.smartNudge.title,
        message: analysis.smartNudge.message,
        microStep: analysis.smartNudge.microStep,
        suggestionAction: analysis.smartNudge.suggestionAction,
        timestamp: new Date().toISOString(),
        acknowledged: false,
        appName,
      };

      if (userProfile.soundEnabled) {
        sound.playGentleNudge();
      }
    }

    setActiveSession((prev) => {
      if (!prev) return null;
      const history = [prev.currentActivity, ...prev.activityHistory].slice(0, 30);
      return {
        ...prev,
        currentActivity: newActivity,
        activityHistory: history,
        currentDriftLevel: effectiveDriftLevel,
        activeNudge: nudge || prev.activeNudge,
      };
    });
  };

  const overrideClassification = (activityId: string, isAligned: boolean, reason: string) => {
    if (!activeSession) return;

    // Call REST endpoint POST /api/activity/intentional
    apiService.markActivityIntentional(activityId, isAligned, reason).catch(() => {});

    storageService.saveUserOverride(
      activeSession.currentActivity.appName,
      activeSession.intention,
      isAligned,
      reason
    );

    setActiveSession((prev) => {
      if (!prev) return null;
      const updatedCurrent =
        prev.currentActivity.id === activityId
          ? {
              ...prev.currentActivity,
              isAligned,
              driftLevel: (isAligned ? 'none' : 'medium') as any,
              userOverride: true,
              userOverrideReason: reason,
              contextualReasoning: `User Override: ${reason}`,
            }
          : prev.currentActivity;

      const updatedHistory = prev.activityHistory.map((act) =>
        act.id === activityId
          ? {
              ...act,
              isAligned,
              driftLevel: (isAligned ? 'none' : 'medium') as any,
              userOverride: true,
              userOverrideReason: reason,
              contextualReasoning: `User Override: ${reason}`,
            }
          : act
      );

      return {
        ...prev,
        currentActivity: updatedCurrent,
        activityHistory: updatedHistory,
        currentDriftLevel: isAligned ? 'none' : prev.currentDriftLevel,
        activeNudge: isAligned ? null : prev.activeNudge,
      };
    });

    setLastAnalysisReasoning(`Classification updated. MindfulLoop learned: "${reason}".`);
  };

  const dismissNudge = () => {
    setActiveSession((prev) => (prev ? { ...prev, activeNudge: null, currentDriftLevel: 'none' } : null));
    updateProfile({
      totalDriftRecoveredCount: userProfile.totalDriftRecoveredCount + 1,
    });
  };

  const recordBrainBreak = (type: BrainBreakType, durationSeconds: number, rating = 5) => {
    const titles: Record<BrainBreakType, string> = {
      breathing: '4-7-8 Parasympathetic Calm Loop',
      eye_reset: '20-20-20 Ciliary Muscle Relief',
      stretch: 'Desk Trapezius & Spine Decompression',
      mindful_reset: 'Cognitive Reset & Micro-Journal',
      puzzle: 'Zen Dopamine Baseline Alignment',
    };

    const newBreak = {
      id: 'bb-' + Date.now(),
      type,
      title: titles[type],
      durationSeconds,
      completedAt: 'Just now',
      rating,
      refreshedScore: 90 + Math.floor(Math.random() * 10),
    };

    storageService.addBreakSession(newBreak);

    setActiveSession((prev) =>
      prev
        ? {
            ...prev,
            breakCount: prev.breakCount + 1,
            currentDriftLevel: 'none',
            activeNudge: null,
          }
        : null
    );

    if (userProfile.soundEnabled) {
      sound.playCompletionCelebration();
    }
  };

  return (
    <SessionContext.Provider
      value={{
        userProfile,
        updateProfile,
        activeSession,
        startSession,
        pauseSession,
        resumeSession,
        endSession,
        extendSession,
        simulateActivity,
        overrideClassification,
        dismissNudge,
        recordBrainBreak,
        wellnessMetrics,
        isAutoSimulating,
        setIsAutoSimulating,
        lastAnalysisReasoning,
        isAnalyzing,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
