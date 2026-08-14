import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { apiService } from '../services/api';
import {
  TrendingUp,
  Flame,
  Clock,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Calendar,
  Layers,
  Lightbulb,
  Play,
  RotateCcw,
  CheckCircle2,
  Activity,
  Smile,
  Compass,
} from 'lucide-react';

interface ProgressData {
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

export const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useSession();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProgressData>({
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
  });

  const [chartMetric, setChartMetric] = useState<'wellness' | 'drift' | 'focus'>('wellness');

  useEffect(() => {
    let isMounted = true;
    const fetchProgress = async () => {
      try {
        const progressRes = await apiService.getProgress();
        if (isMounted && progressRes) {
          setData(progressRes);
        }
      } catch (e) {
        console.warn('Using local mock progress data', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProgress();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute maximums for relative chart heights
  const maxFocusMinutes = Math.max(...data.weeklyChart.map((d) => d.focusTimeMinutes), 240);
  const maxDriftMinutes = Math.max(...data.weeklyChart.map((d) => d.digitalDriftMinutes), 45);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 mb-2">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Weekly Progress & Habits</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Your digital wellness journey
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            Small changes become better digital habits.
          </p>
        </div>

        <button
          onClick={() => navigate('/intention')}
          id="btn-start-new-session"
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-emerald-800/15 hover:bg-emerald-800 transition active:scale-[0.99] self-start sm:self-auto cursor-pointer"
        >
          <Play className="h-4 w-4 fill-current" />
          <span>Start New Session</span>
        </button>
      </div>

      {/* TOP SUMMARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Wellness Score */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 space-y-2 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Wellness Score
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900 font-mono">
              {data.wellnessScore.current}
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              was {data.wellnessScore.previous}
            </span>
          </div>
          <p className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-4 w-4" />
            <span>+{data.wellnessScore.delta} this week</span>
          </p>
        </div>

        {/* Card 2: Digital Drift */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 space-y-2 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Digital Drift
            </span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900 font-mono">
              {data.digitalDrift.currentMinutes}
            </span>
            <span className="text-sm text-zinc-500 font-normal">min</span>
            <span className="text-xs text-zinc-400 font-medium">
              was {data.digitalDrift.previousMinutes} min
            </span>
          </div>
          <p className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
            <ArrowDownRight className="h-4 w-4" />
            <span>{data.digitalDrift.deltaPercent}% decrease</span>
          </p>
        </div>

        {/* Card 3: Focus Sessions */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 space-y-2 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Focus Sessions
            </span>
            <Zap className="h-4 w-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900 font-mono">
              {data.focusSessions.current}
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              was {data.focusSessions.previous}
            </span>
          </div>
          <p className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-4 w-4" />
            <span>+{data.focusSessions.deltaPercent}% completed</span>
          </p>
        </div>

        {/* Card 4: Focus Streak */}
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/90 to-amber-100/50 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Focus Streak
            </span>
            <Flame className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-amber-950 font-mono">
              {data.focusStreakDays}
            </span>
            <span className="text-sm font-semibold text-amber-900">days</span>
            <span className="text-lg ml-1">🔥</span>
          </div>
          <p className="text-xs text-amber-800 font-medium">
            Consecutive daily intentional loops
          </p>
        </div>
      </div>

      {/* SECTION: WEEKLY CHART + INTENTIONAL VS PASSIVE USAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 cols: Weekly Interactive Chart */}
        <div className="lg:col-span-7 rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900">Weekly Habits Overview</h3>
              <p className="text-xs text-zinc-500">
                Daily telemetry across Mon – Sun
              </p>
            </div>

            {/* Metric Toggle Tabs */}
            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
              <button
                onClick={() => setChartMetric('wellness')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  chartMetric === 'wellness'
                    ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Wellness Score
              </button>
              <button
                onClick={() => setChartMetric('drift')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  chartMetric === 'drift'
                    ? 'bg-white text-amber-800 shadow-2xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Digital Drift
              </button>
              <button
                onClick={() => setChartMetric('focus')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  chartMetric === 'focus'
                    ? 'bg-white text-teal-800 shadow-2xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Focus Time
              </button>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="pt-2">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-52 pb-2 border-b border-zinc-100">
              {data.weeklyChart.map((item) => {
                let heightPct = 0;
                let valueDisplay = '';
                let barColor = 'bg-emerald-500';

                if (chartMetric === 'wellness') {
                  heightPct = (item.wellnessScore / 100) * 100;
                  valueDisplay = `${item.wellnessScore}`;
                  barColor = 'bg-emerald-600';
                } else if (chartMetric === 'drift') {
                  heightPct = (item.digitalDriftMinutes / maxDriftMinutes) * 100;
                  valueDisplay = `${item.digitalDriftMinutes}m`;
                  barColor = 'bg-amber-500';
                } else {
                  heightPct = (item.focusTimeMinutes / maxFocusMinutes) * 100;
                  valueDisplay = `${Math.round(item.focusTimeMinutes / 60)}h ${item.focusTimeMinutes % 60}m`;
                  barColor = 'bg-teal-600';
                }

                return (
                  <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-zinc-500 font-medium group-hover:text-zinc-900 transition">
                      {valueDisplay}
                    </span>
                    <div className="w-full max-w-[42px] bg-zinc-100 rounded-xl overflow-hidden flex items-end h-36">
                      <div
                        className={`w-full ${barColor} rounded-t-lg transition-all duration-500 group-hover:opacity-90`}
                        style={{ height: `${Math.max(heightPct, 12)}%` }}
                        title={`${item.day}: ${valueDisplay}`}
                      />
                    </div>
                    <span className="text-xs font-semibold text-zinc-700">{item.day}</span>
                  </div>
                );
              })}
            </div>

            {/* Chart Legend / Summary Note */}
            <div className="flex items-center justify-between pt-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                <span>Mon – Sun 7-Day Average: <strong>78 Wellness Score</strong></span>
              </span>
              <span className="text-[11px] text-zinc-400">Synced with session telemetry</span>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Intentional vs Passive Usage Comparison */}
        <div className="lg:col-span-5 rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-zinc-100 pb-3">
              <h3 className="text-base font-bold text-zinc-900">Intentional vs. Passive Usage</h3>
              <p className="text-xs text-zinc-500">
                Cognitive alignment comparison across all tracked hours
              </p>
            </div>

            {/* Split Progress Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-800 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded bg-emerald-600" />
                  Intentional ({data.intentionalVsPassive.intentionalPercent}%)
                </span>
                <span className="text-amber-700 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded bg-amber-500" />
                  Passive / Drift ({data.intentionalVsPassive.passivePercent}%)
                </span>
              </div>

              <div className="h-5 w-full overflow-hidden rounded-xl bg-zinc-100 flex p-1 border border-zinc-200/60">
                <div
                  className="h-full rounded-lg bg-emerald-600 transition-all duration-500"
                  style={{ width: `${data.intentionalVsPassive.intentionalPercent}%` }}
                />
                <div
                  className="h-full rounded-lg bg-amber-400 ml-1 transition-all duration-500"
                  style={{ width: `${data.intentionalVsPassive.passivePercent}%` }}
                />
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-3.5 space-y-1">
                <span className="text-[11px] font-semibold uppercase text-emerald-800 block">
                  Purpose-Driven
                </span>
                <div className="text-lg font-bold text-emerald-950 font-mono">18.4 hrs</div>
                <p className="text-[11px] text-emerald-800/80 leading-snug">
                  Coursework, IDE, research, and curated tutorials.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-3.5 space-y-1">
                <span className="text-[11px] font-semibold uppercase text-amber-800 block">
                  Digital Drift
                </span>
                <div className="text-lg font-bold text-amber-950 font-mono">5.2 hrs</div>
                <p className="text-[11px] text-amber-800/80 leading-snug">
                  Algorithmic autoplay & unrelated browsing tabs.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-50 p-3 border border-zinc-200/70 text-[11px] text-zinc-600 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Telemetry is processed on-device for user empowerment, never external surveillance.</span>
          </div>
        </div>
      </div>

      {/* SECTION: PERSONALIZED INSIGHTS (3 Specific Cards) */}
      <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-zinc-900">
              Personalized Insights
            </h2>
            <p className="text-xs text-zinc-500">
              Data-backed observations from your focus sessions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Insight Card 1 */}
          <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/40 to-white p-5 space-y-3 shadow-2xs hover:shadow-xs transition">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Clock className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Peak Cognitive Window
              </span>
              <p className="text-xs sm:text-sm font-semibold text-zinc-800 leading-snug">
                Your focus is strongest between 7 PM and 9 PM.
              </p>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Session completion rates reach 94% during this evening interval with lowest digital drift.
            </p>
          </div>

          {/* Insight Card 2 */}
          <div className="rounded-2xl border border-teal-200/80 bg-gradient-to-b from-teal-50/40 to-white p-5 space-y-3 shadow-2xs hover:shadow-xs transition">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                Habit Improvement
              </span>
              <p className="text-xs sm:text-sm font-semibold text-zinc-800 leading-snug">
                Your Digital Drift decreased compared with last week.
              </p>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Average drift dropped from 35 min to 20 min per study block thanks to proactive Smart Nudges.
            </p>
          </div>

          {/* Insight Card 3 */}
          <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/40 to-white p-5 space-y-3 shadow-2xs hover:shadow-xs transition">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Recovery Rhythm
              </span>
              <p className="text-xs sm:text-sm font-semibold text-zinc-800 leading-snug">
                You complete longer sessions when you take a short break after 30–40 minutes.
              </p>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              60-second Brain Breaks prevent mental fatigue and eliminate compulsive feed scrolling.
            </p>
          </div>
        </div>

        {/* Actionable Recommendation Box */}
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                Recommended Action for Tomorrow
              </span>
              <p className="text-xs sm:text-sm font-semibold text-emerald-950">
                {data.recommendation}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/intention')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition shadow-2xs shrink-0 cursor-pointer"
          >
            <span>Set Tomorrow's Intention</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProgressPage;
