import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { IntentionCategory } from '../types';
import { apiService } from '../services/api';
import {
  Compass,
  BookOpen,
  Briefcase,
  Palette,
  Sprout,
  Gamepad2,
  Clock,
  Sparkles,
  ShieldCheck,
  Check,
  Play,
  ArrowRight,
  Info,
} from 'lucide-react';

interface IntentionOption {
  id: IntentionCategory;
  title: string;
  emoji: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultGoal: string;
}

export const IntentionPage: React.FC = () => {
  const navigate = useNavigate();
  const { startSession, updateProfile } = useSession();

  // Intention state (Default: Study)
  const [selectedIntention, setSelectedIntention] = useState<IntentionCategory>('Study');
  const [goalTopic, setGoalTopic] = useState('Linear Algebra & Exam Preparation');

  // Duration state (Options: 15, 30, 45, 60, custom)
  const [durationMode, setDurationMode] = useState<number | 'custom'>(30);
  const [customMinutes, setCustomMinutes] = useState<number>(25);

  const activeDuration = durationMode === 'custom' ? Number(customMinutes) || 25 : durationMode;

  // Intention Cards definition
  const intentionCards: IntentionOption[] = [
    {
      id: 'Study',
      title: 'Study',
      emoji: '📚',
      description: 'Learning, assignments, exam preparation',
      icon: BookOpen,
      defaultGoal: 'Learning, assignments, exam preparation',
    },
    {
      id: 'Work',
      title: 'Work',
      emoji: '💻',
      description: 'Professional or project work',
      icon: Briefcase,
      defaultGoal: 'Professional or project work',
    },
    {
      id: 'Creative',
      title: 'Creative',
      emoji: '🎨',
      description: 'Design, writing, coding or creative work',
      icon: Palette,
      defaultGoal: 'Design, writing, coding or creative work',
    },
    {
      id: 'Personal Growth',
      title: 'Personal Growth',
      emoji: '🌿',
      description: 'Reading, meditation, learning',
      icon: Sprout,
      defaultGoal: 'Reading, meditation, learning',
    },
    {
      id: 'Entertainment',
      title: 'Entertainment',
      emoji: '🎮',
      description: 'Intentional entertainment and relaxation',
      icon: Gamepad2,
      defaultGoal: 'Intentional entertainment and relaxation',
    },
  ];

  const durationOptions = [
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '60 min', value: 60 },
    { label: 'Custom', value: 'custom' as const },
  ];

  const handleSelectIntention = (item: IntentionOption) => {
    setSelectedIntention(item.id);
    if (!goalTopic || intentionCards.some((c) => c.defaultGoal === goalTopic)) {
      setGoalTopic(item.defaultGoal);
    }
  };

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();

    const sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const sessionStartTime = new Date().toISOString();

    // Store required data in localStorage
    try {
      localStorage.setItem('mindfulloop_intention', selectedIntention);
      localStorage.setItem('mindfulloop_duration', activeDuration.toString());
      localStorage.setItem('mindfulloop_sessionStartTime', sessionStartTime);
      localStorage.setItem('mindfulloop_sessionId', sessionId);
      localStorage.setItem('mindfulloop_goalTopic', goalTopic);
    } catch {
      // Storage fallback
    }

    // Clean data object ready for POST /api/session
    const sessionPayload = {
      sessionId,
      intention: selectedIntention,
      durationMinutes: activeDuration,
      sessionStartTime,
      goalTopic: goalTopic || selectedIntention,
      allowedExceptions: ['Educational / Reference', 'Docs & Notes'],
    };

    // Trigger API service (calls POST /api/session if available or mock handles safely)
    await apiService.createSession(sessionPayload);

    // Sync session context
    startSession(selectedIntention, goalTopic || selectedIntention, activeDuration, [
      'YouTube (Lectures & Tutorials)',
      'Notion / Docs',
      'Reference Materials',
    ]);

    // Navigate directly to /dashboard
    navigate('/dashboard');
  };

  const currentCard = intentionCards.find((c) => c.id === selectedIntention) || intentionCards[0];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 px-3.5 py-1 text-xs font-semibold text-emerald-800">
          <Compass className="h-3.5 w-3.5" />
          <span>Intentional Focus Setup</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-900">
          What do you want to focus on?
        </h1>
        <p className="text-xs sm:text-base text-zinc-600">
          Your intention helps MindfulLoop understand your behavior in context.
        </p>
      </div>

      <form onSubmit={handleStartSession} className="space-y-8">
        {/* ========================================================
            SECTION 1: 5 Intention Cards
            ======================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
              Select Your Intention
            </label>
            <span className="text-xs text-zinc-500">Choose one core focus</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {intentionCards.map((card) => {
              const isSelected = selectedIntention === card.id;
              const Icon = card.icon;
              return (
                <button
                  type="button"
                  key={card.id}
                  id={`intention-card-${card.id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleSelectIntention(card)}
                  className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer group ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-600 shadow-sm scale-[1.01]'
                      : 'bg-white border-zinc-200/90 hover:border-emerald-300 hover:bg-zinc-50/70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-zinc-100 text-zinc-700 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                        } transition`}
                      >
                        <span className="text-base">{card.emoji}</span>
                      </div>
                      {isSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-zinc-900">{card.title}</div>
                    <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="text-[10px] font-semibold text-emerald-800 pt-3 border-t border-emerald-200/60 mt-3 flex items-center gap-1">
                      <span>Active selection</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            SECTION 2: Duration Selector
            ======================================================== */}
        <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
                Session Duration
              </label>
              <p className="text-xs text-zinc-500">
                MindfulLoop checks in gently when your chosen target is reached.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 font-mono">
              <Clock className="h-3.5 w-3.5" />
              <span>{activeDuration} minutes</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {durationOptions.map((opt) => {
              const isSelected = durationMode === opt.value;
              return (
                <button
                  type="button"
                  key={opt.label}
                  id={`duration-btn-${opt.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setDurationMode(opt.value)}
                  className={`p-3.5 rounded-xl border text-center transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold ring-2 ring-emerald-500 shadow-2xs'
                      : 'bg-zinc-50/70 border-zinc-200 text-zinc-700 hover:bg-zinc-100/80'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.label}</div>
                </button>
              );
            })}
          </div>

          {/* Custom Duration Input */}
          {durationMode === 'custom' && (
            <div className="pt-2 flex items-center gap-3 animate-in fade-in duration-200">
              <label htmlFor="custom-duration-input" className="text-xs font-semibold text-zinc-700 whitespace-nowrap">
                Enter custom minutes:
              </label>
              <input
                id="custom-duration-input"
                type="number"
                min="5"
                max="240"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-28 rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 focus:outline-emerald-600 font-mono font-bold"
              />
              <span className="text-xs text-zinc-500 font-medium">min (e.g. 25, 50, 90)</span>
            </div>
          )}
        </div>

        {/* ========================================================
            SECTION 3: Specific Goal / Context Anchor
            ======================================================== */}
        <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="goal-topic-input" className="block text-xs font-bold uppercase tracking-wider text-zinc-700">
              Specific Subject or Task Description
            </label>
            <span className="text-xs text-zinc-400">Contextual Reference</span>
          </div>
          <input
            id="goal-topic-input"
            type="text"
            required
            value={goalTopic}
            onChange={(e) => setGoalTopic(e.target.value)}
            placeholder="e.g. Organic Chemistry Lecture 4 or UI Component Refactor"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:outline-emerald-600 font-medium"
          />
        </div>

        {/* ========================================================
            SECTION 4: Session Preview Box
            ======================================================== */}
        <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 to-teal-50/50 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
            <Sparkles className="h-4 w-4 text-emerald-700" />
            <span>Session Preview</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/90 border border-emerald-100 p-4 space-y-1">
              <span className="text-xs text-zinc-500 font-medium block">Your intention</span>
              <div className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <span>{currentCard.emoji}</span>
                <span>{selectedIntention}</span>
              </div>
              <p className="text-[11px] text-zinc-500">{goalTopic || currentCard.description}</p>
            </div>

            <div className="rounded-2xl bg-white/90 border border-emerald-100 p-4 space-y-1">
              <span className="text-xs text-zinc-500 font-medium block">Your target</span>
              <div className="text-lg font-bold text-emerald-800 font-mono">
                {activeDuration} minutes
              </div>
              <p className="text-[11px] text-zinc-500">Autonomous pause & mindful check-in reminder</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-1 text-xs text-emerald-900">
            <Info className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="font-medium">
              MindfulLoop will compare your actual activity with this intention.
            </p>
          </div>
        </div>

        {/* ========================================================
            Primary CTA Button
            ======================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>No website is inherently marked bad. Intent provides context for behavior.</span>
          </div>

          <button
            type="submit"
            id="btn-start-session"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-9 py-4 text-sm font-bold text-white shadow-md shadow-emerald-800/20 hover:bg-emerald-800 transition active:scale-[0.99] cursor-pointer"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Start Session</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
