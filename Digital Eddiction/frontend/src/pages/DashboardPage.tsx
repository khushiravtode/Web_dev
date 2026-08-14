import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { apiService } from '../services/api';
import { SmartNudgeModal } from '../components/SmartNudgeModal';
import { ContextCorrectionModal } from '../components/ContextCorrectionModal';
import { ActivitySimulator } from '../components/ActivitySimulator';
import {
  Compass,
  Play,
  Pause,
  Clock,
  Sparkles,
  Coffee,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Zap,
  RotateCcw,
  Plus,
  ArrowRight,
  BarChart3,
  Flame,
  Check,
  Eye,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeSession,
    userProfile,
    pauseSession,
    resumeSession,
    extendSession,
    endSession,
    dismissNudge,
    updateProfile,
    isAnalyzing,
  } = useSession();

  // Local state for modals & user overrides
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState<boolean>(false);
  const [showReviewDetail, setShowReviewDetail] = useState<boolean>(false);
  const [driftOverridden, setDriftOverridden] = useState<boolean>(false);
  const [brainBreakDone, setBrainBreakDone] = useState<boolean>(() => {
    try {
      return localStorage.getItem('brainBreakCompleted') === 'true';
    } catch {
      return false;
    }
  });

  // Read stored intention & duration values from localStorage
  const storedIntention = useMemo(() => {
    try {
      return localStorage.getItem('mindfulloop_intention') || activeSession?.intention || 'Study';
    } catch {
      return activeSession?.intention || 'Study';
    }
  }, [activeSession]);

  const storedDuration = useMemo(() => {
    try {
      const d = localStorage.getItem('mindfulloop_duration');
      return d ? parseInt(d, 10) : activeSession?.totalDurationMinutes || 30;
    } catch {
      return activeSession?.totalDurationMinutes || 30;
    }
  }, [activeSession]);

  // Dashboard & Usage state from REST API
  const [dashboardData, setDashboardData] = useState<{
    wellnessScore: number;
    wellnessDelta: number;
    screenTimeHours: number;
    screenTimeMinutes: number;
    intentionalUsagePercent: number;
    digitalDriftMinutes: number;
    focusStreakDays: number;
    insights: string[];
  }>({
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
  });

  const [usageData, setUsageData] = useState<Array<{ name: string; minutes: number; percentage: number; color: string; fill: string }>>([
    { name: 'Study', minutes: 110, percentage: 54, color: 'bg-emerald-600', fill: '#059669' },
    { name: 'Work', minutes: 45, percentage: 22, color: 'bg-teal-600', fill: '#0d9488' },
    { name: 'Social', minutes: 18, percentage: 9, color: 'bg-amber-500', fill: '#f59e0b' },
    { name: 'Entertainment', minutes: 20, percentage: 10, color: 'bg-purple-600', fill: '#9333ea' },
    { name: 'Other', minutes: 11, percentage: 5, color: 'bg-zinc-400', fill: '#a1a1aa' },
  ]);

  // Load real REST API endpoints: GET /api/dashboard and GET /api/usage
  useEffect(() => {
    let isMounted = true;
    const fetchApiData = async () => {
      try {
        const [dashRes, usageRes] = await Promise.all([
          apiService.getDashboardData(),
          apiService.getUsageData(),
        ]);

        if (isMounted) {
          if (dashRes) {
            setDashboardData((prev) => ({
              ...prev,
              wellnessScore: dashRes.wellnessScore ?? prev.wellnessScore,
              wellnessDelta: dashRes.wellnessDelta ?? prev.wellnessDelta,
              screenTimeHours: dashRes.screenTimeHours ?? prev.screenTimeHours,
              screenTimeMinutes: dashRes.screenTimeMinutes ?? prev.screenTimeMinutes,
              intentionalUsagePercent: dashRes.intentionalUsagePercent ?? prev.intentionalUsagePercent,
              digitalDriftMinutes: dashRes.digitalDriftMinutes ?? prev.digitalDriftMinutes,
              focusStreakDays: dashRes.focusStreakDays ?? prev.focusStreakDays,
              insights: dashRes.insights || prev.insights,
            }));
          }

          if (usageRes && Array.isArray(usageRes) && usageRes.length > 0) {
            const colorClassMap: Record<string, string> = {
              Study: 'bg-emerald-600',
              Work: 'bg-teal-600',
              Social: 'bg-amber-500',
              Entertainment: 'bg-purple-600',
              Other: 'bg-zinc-400',
            };

            const formattedUsage = usageRes.map((u) => ({
              name: u.category,
              minutes: u.minutes,
              percentage: u.percentage,
              color: colorClassMap[u.category] || 'bg-emerald-600',
              fill: u.color || '#059669',
            }));
            setUsageData(formattedUsage);
          }
        }
      } catch (err) {
        console.warn('Dashboard REST API fetch fallback', err);
      }
    };

    fetchApiData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Usage chart breakdown data
  const usageCategories = usageData;

  // Dynamic Greeting based on time of day (defaults to Good evening as requested)
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const userName = userProfile?.name || 'Alex';

  // Digital Drift stats
  const driftMinutes = driftOverridden ? 0 : 8;
  const intentionalMinutes = driftOverridden ? 30 : 22;

  // Check if session duration exceeded to trigger smart nudge
  const elapsedMinutes = activeSession ? Math.floor(activeSession.elapsedSeconds / 60) : 0;
  const isDurationExceeded = elapsedMinutes >= storedDuration;
  const overtimeMinutes = Math.max(0, elapsedMinutes - storedDuration);

  const emojiMap: Record<string, string> = {
    Study: '📚',
    Work: '💻',
    Creative: '🎨',
    'Creative Work': '🎨',
    'Personal Growth': '🌿',
    Entertainment: '🎮',
    Wellness: '🧘',
  };

  const currentEmoji = emojiMap[storedIntention] || '📚';

  // Handle "I'm Using This for Study" / Goal Override
  const handleMarkAsIntentional = () => {
    setDriftOverridden(true);
    dismissNudge();
    if (activeSession?.currentActivity?.id) {
      apiService.markActivityIntentional(
        activeSession.currentActivity.id,
        true,
        `User confirmed activity aligns with ${storedIntention}`
      ).catch(() => {});
    }
  };

  const isPaused = activeSession?.status === 'paused';
  const isCompleted = activeSession?.status === 'completed';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* ========================================================
          HEADER: "Good evening, [User Name] 👋"
          ======================================================== */}
      <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            {greeting}, {userName} 👋
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-800 bg-zinc-100/90 px-3 py-1 rounded-full border border-zinc-200">
              <span>Current intention:</span>
              <span className="text-emerald-800">
                {currentEmoji} {storedIntention} • {storedDuration} min
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-medium text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Session status: Focused Session Active</span>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/intention"
            id="btn-start-new-session"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-emerald-800 transition active:scale-[0.99]"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Start New Session</span>
          </Link>

          <Link
            to="/brain-break"
            id="btn-take-brain-break"
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-teal-900 border border-teal-200/80 hover:bg-teal-100 transition"
          >
            <Coffee className="h-3.5 w-3.5 text-teal-700" />
            <span>Take Brain Break</span>
          </Link>

          <Link
            to="/progress"
            id="btn-view-progress"
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-700 hover:bg-zinc-100 transition"
          >
            <BarChart3 className="h-3.5 w-3.5 text-zinc-500" />
            <span>View Progress</span>
          </Link>
        </div>
      </div>

      {/* Brain Break Completed Notification Banner */}
      {brainBreakDone && (
        <div className="rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 shadow-2xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-2xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-emerald-950 flex items-center gap-2">
                <span>Brain Break Completed!</span>
                <span className="rounded-full bg-emerald-200/80 px-2 py-0.5 text-[10px] font-extrabold text-emerald-900">
                  Attention Reset ✓
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-800/90">
                Cognitive fatigue downshifted. Your mind is refreshed and ready to continue your intentional session.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setBrainBreakDone(false);
              localStorage.removeItem('brainBreakCompleted');
            }}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-300/80 bg-white hover:bg-emerald-50 transition cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================
          TOP SECTION: Wellness Score + 4 Stat Cards
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MAIN WELLNESS SCORE CARD (col-span-4) */}
        <div className="lg:col-span-4 rounded-3xl border border-emerald-200/90 bg-gradient-to-br from-emerald-900 via-emerald-950 to-teal-950 p-6 sm:p-7 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Wellness Index
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Digital Wellness Score
            </h2>
          </div>

          <div className="relative z-10 my-4 flex items-baseline gap-2">
            <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono">
              {dashboardData.wellnessScore}
            </span>
            <span className="text-xl font-medium text-emerald-200/80">/ 100</span>
          </div>

          <div className="relative z-10 pt-3 border-t border-emerald-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <TrendingUp className="h-4 w-4" />
              <span>+{dashboardData.wellnessDelta} compared with yesterday</span>
            </div>
            <span className="text-emerald-200/60 font-medium">Optimal balance</span>
          </div>
        </div>

        {/* 4 STAT CARDS (col-span-8: 2x2 grid) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          {/* Stat 1: Screen Time */}
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Screen Time</span>
              <Clock className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-mono">
                {dashboardData.screenTimeHours}h {dashboardData.screenTimeMinutes}m
              </span>
            </div>
            <div className="text-[11px] text-zinc-500 font-medium">
              Daily accumulated
            </div>
          </div>

          {/* Stat 2: Intentional Usage */}
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Intentional Usage</span>
              <Zap className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-mono">
                {dashboardData.intentionalUsagePercent}%
              </span>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">
              Above target baseline
            </div>
          </div>

          {/* Stat 3: Digital Drift */}
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Digital Drift</span>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-800 font-mono">
                {driftOverridden ? 0 : dashboardData.digitalDriftMinutes} min
              </span>
            </div>
            <div className="text-[11px] text-amber-700 font-medium">
              -18% from yesterday
            </div>
          </div>

          {/* Stat 4: Focus Streak */}
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-teal-700">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Focus Streak</span>
              <Flame className="h-4 w-4 text-teal-600" />
            </div>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-teal-900 font-mono">
                {dashboardData.focusStreakDays} days
              </span>
            </div>
            <div className="text-[11px] text-teal-700 font-medium">
              Consistent daily goals
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          MIDDLE SECTION: Usage Chart & Intent vs Actual
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* USAGE CHART: Bar & Proportion Visualizer (col-span-7) */}
        <div className="lg:col-span-7 rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
                Category Distribution
              </span>
              <h3 className="text-lg font-bold text-zinc-900">
                Today's Usage Breakdown
              </h3>
            </div>
            <span className="text-xs text-zinc-400 font-mono">3h 24m Total</span>
          </div>

          {/* Combined Multi-segment Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-4 w-full rounded-full bg-zinc-100 overflow-hidden flex shadow-inner">
              {usageCategories.map((cat) => (
                <div
                  key={cat.name}
                  style={{ width: `${cat.percentage}%` }}
                  className={`${cat.color} h-full transition-all hover:opacity-90`}
                  title={`${cat.name}: ${cat.minutes}m (${cat.percentage}%)`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>0%</span>
              <span>100% Intentional Distribution</span>
            </div>
          </div>

          {/* Category Detail Rows */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {usageCategories.map((cat) => (
              <div
                key={cat.name}
                className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3 space-y-1"
              >
                <div className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${cat.color}`} />
                  <span className="text-xs font-bold text-zinc-800">{cat.name}</span>
                </div>
                <div className="text-base font-extrabold text-zinc-900 font-mono">
                  {cat.minutes}m
                </div>
                <div className="text-[11px] text-zinc-500 font-medium">
                  {cat.percentage}% of screen
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INTENT VS ACTUAL SECTION (col-span-5) */}
        <div className="lg:col-span-5 rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
              Session Telemetry
            </span>
            <h3 className="text-lg font-bold text-zinc-900">
              Intent vs Actual Activity
            </h3>
          </div>

          {/* Dual Comparison Blocks */}
          <div className="space-y-3.5">
            {/* 1. INTENTION */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900 uppercase tracking-wider">
                <span>INTENTION</span>
                <span className="font-mono text-emerald-800">{storedDuration} min</span>
              </div>
              <div className="text-base font-extrabold text-emerald-950 flex items-center gap-2">
                <span>{currentEmoji}</span>
                <span>{storedIntention} — {storedDuration} min</span>
              </div>
              <p className="text-[11px] text-emerald-800/80">
                Target established before session tracking began
              </p>
            </div>

            {/* 2. ACTUAL ACTIVITY */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700 uppercase tracking-wider">
                <span>ACTUAL ACTIVITY</span>
                <span className="font-mono text-zinc-600">30 min total</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-900">
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{storedIntention}-related</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-900">{intentionalMinutes} min</span>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-zinc-900">
                  <span className="flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    <span>Other activity</span>
                  </span>
                  <span className="font-mono font-bold text-amber-900">{driftMinutes} min</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>Telemetry provides context, never shame or moral labeling.</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          DIGITAL DRIFT CARD (If drift exists)
          ======================================================== */}
      {driftMinutes > 0 && (
        <div
          id="digital-drift-card"
          className="rounded-3xl border border-amber-200/90 bg-gradient-to-br from-amber-50/90 to-amber-100/50 p-6 sm:p-7 shadow-xs space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 border border-amber-300/80 shadow-2xs shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                  Potential Digital Drift
                </h3>
                <p className="text-xs sm:text-sm text-amber-950 font-normal leading-relaxed max-w-3xl">
                  Your current intention is <strong>{storedIntention}</strong>, but{' '}
                  <strong>{driftMinutes} minutes</strong> of recent activity may not match your
                  selected intention.
                </p>
              </div>
            </div>

            {/* Action Buttons: Review Activity & I'm Using This for Study */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 sm:pt-0">
              <button
                type="button"
                id="btn-review-activity"
                onClick={() => setShowReviewDetail(!showReviewDetail)}
                className="rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-800 hover:bg-amber-50/80 transition cursor-pointer"
              >
                {showReviewDetail ? 'Hide Details' : 'Review Activity'}
              </button>

              <button
                type="button"
                id="btn-using-for-goal"
                onClick={handleMarkAsIntentional}
                className="rounded-xl bg-emerald-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-emerald-800 transition active:scale-[0.99] cursor-pointer"
              >
                I'm Using This for {storedIntention}
              </button>
            </div>
          </div>

          {/* Expandable Review Details */}
          {showReviewDetail && (
            <div className="mt-4 pt-4 border-t border-amber-200/80 space-y-3 animate-in fade-in">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Unclassified Tab Stream
              </span>
              <div className="rounded-2xl bg-white/90 border border-amber-200 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-700">
                  <span className="font-semibold">Chrome — YouTube: Tech News & Setup</span>
                  <span className="font-mono text-zinc-400">8 min</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  MindfulLoop noticed video streaming. If this is tutorial research for {storedIntention}, clicking
                  "I'm Using This for {storedIntention}" updates the contextual whitelist without interrupting you.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TODAY'S INSIGHTS SECTION
          ======================================================== */}
      <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-zinc-900">Today's Insights</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Deep Focus Peak</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-zinc-800 leading-snug">
              Your longest focused period was <strong>42 minutes</strong>.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <span>Attention Recovery</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-zinc-800 leading-snug">
              Digital Drift decreased <strong>18%</strong> compared with yesterday.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-800">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span>Circadian Rhythm</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-zinc-800 leading-snug">
              Your strongest focus period is between <strong>7 PM and 9 PM</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          Interactive Activity Simulator & Event Stream
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ActivitySimulator />
        </div>

        <div className="lg:col-span-5 rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Live Activity Stream
            </span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Real-time
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {activeSession && [activeSession.currentActivity, ...activeSession.activityHistory].map((act, idx) => (
              <div
                key={`${act.id || 'act'}-${idx}`}
                className={`p-3 rounded-2xl border text-xs flex items-start justify-between gap-3 ${
                  act.isAligned
                    ? 'bg-emerald-50/40 border-emerald-100 text-emerald-950'
                    : 'bg-amber-50/40 border-amber-100 text-amber-950'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                    <span>{act.appName}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {Math.floor(act.durationSeconds / 60)}m
                    </span>
                  </div>
                  <p className="text-zinc-600 line-clamp-1 font-medium">{act.windowTitle}</p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    act.isAligned ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {act.isAligned ? 'Aligned' : 'Drift'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Nudge Overlay Modal */}
      <SmartNudgeModal
        nudge={activeSession?.activeNudge || null}
        onDismiss={dismissNudge}
        onTakeBreak={() => {
          dismissNudge();
          navigate('/brain-break');
        }}
        onOverride={handleMarkAsIntentional}
        intentionName={storedIntention}
        durationMinutes={storedDuration}
        isDurationExceeded={isDurationExceeded}
        overtimeMinutes={overtimeMinutes}
      />

      {/* Context Correction Modal */}
      <ContextCorrectionModal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
      />
    </div>
  );
};
