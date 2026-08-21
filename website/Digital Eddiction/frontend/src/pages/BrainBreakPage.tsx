import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { BrainBreakType } from '../types';
import { apiService } from '../services/api';
import confetti from 'canvas-confetti';
import {
  Brain,
  Wind,
  Puzzle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  Coffee,
  Check,
  X,
} from 'lucide-react';

type BreakActivityId = 'quick_challenge' | 'breathing_reset' | 'memory_challenge';

export const BrainBreakPage: React.FC = () => {
  const navigate = useNavigate();
  const { recordBrainBreak, activeSession } = useSession();

  // Active activity (Start with Quick Challenge selected as required)
  const [selectedActivity, setSelectedActivity] = useState<BreakActivityId>('quick_challenge');

  // 30-second timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Completion state
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // 1. Quick Challenge State (Math Question: What is 17 + 8?)
  const [mathQuestion] = useState({
    question: 'What is 17 + 8?',
    options: [23, 25, 27, 29],
    correctAnswer: 25,
  });

  // 2. Breathing Reset State (Inhale -> Hold -> Exhale)
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCount, setBreathCount] = useState<number>(4);
  const [breathCycles, setBreathCycles] = useState<number>(0);

  // 3. Memory Challenge State (Zen Pattern Interaction)
  const [memorySequence] = useState<number[]>([1, 3, 0, 2]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [memoryStep, setMemoryStep] = useState<'showing' | 'user'>('user');

  // Timer countdown hook
  useEffect(() => {
    if (!isTimerRunning || isCompleted) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishBreak();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isCompleted]);

  // Breathing Guide Loop
  useEffect(() => {
    if (selectedActivity !== 'breathing_reset' || !isTimerRunning || isCompleted) return;

    const breathInterval = setInterval(() => {
      setBreathCount((prev) => {
        if (prev <= 1) {
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            return 4;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            return 4;
          } else {
            setBreathPhase('Inhale');
            setBreathCycles((c) => {
              const next = c + 1;
              if (next >= 3) {
                handleFinishBreak();
              }
              return next;
            });
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(breathInterval);
  }, [selectedActivity, isTimerRunning, isCompleted, breathPhase]);

  // Reset states when switching tabs
  const handleSelectActivity = (id: BreakActivityId) => {
    setSelectedActivity(id);
    setTimerSeconds(30);
    setIsTimerRunning(true);
    setIsCompleted(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setUserSequence([]);
    setBreathPhase('Inhale');
    setBreathCount(4);
    setBreathCycles(0);
  };

  // Answer handler for Quick Challenge
  const handleSelectAnswer = (option: number) => {
    setSelectedAnswer(option);
    if (option === mathQuestion.correctAnswer) {
      setIsCorrect(true);
      setTimeout(() => {
        handleFinishBreak();
      }, 400);
    } else {
      setIsCorrect(false);
    }
  };

  // Memory tile handler
  const handleMemoryTileClick = (index: number) => {
    const nextSeq = [...userSequence, index];
    setUserSequence(nextSeq);

    const isMatchSoFar = nextSeq.every((val, i) => val === memorySequence[i]);

    if (!isMatchSoFar) {
      setUserSequence([]);
    } else if (nextSeq.length === memorySequence.length) {
      setTimeout(() => {
        handleFinishBreak();
      }, 400);
    }
  };

  // Finish break and persist
  const handleFinishBreak = () => {
    setIsCompleted(true);
    setIsTimerRunning(false);

    const durationSec = 30 - timerSeconds || 30;

    // Call REST endpoint POST /api/brain-break/complete via centralized API service
    apiService.completeBrainBreak({
      activity: selectedActivity,
      durationSeconds: durationSec,
      rating: 5,
    }).catch(() => {
      // Handled gracefully in apiService
    });

    // Save break completion in localStorage
    try {
      localStorage.setItem('brainBreakCompleted', 'true');
      const breakData = {
        completedAt: new Date().toISOString(),
        activity: selectedActivity,
        durationSeconds: durationSec,
      };
      localStorage.setItem('mindfulloop_last_break_completed', JSON.stringify(breakData));
      localStorage.setItem('mindfulloop_break_count', String(Number(localStorage.getItem('mindfulloop_break_count') || '0') + 1));
    } catch {
      // ignore
    }

    // Record in session context
    recordBrainBreak('breathing', 30, 5);

    try {
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#059669', '#0d9488', '#34d399', '#fde047'],
      });
    } catch {
      // ignore
    }
  };

  const handleReturnToSession = () => {
    navigate('/dashboard');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-100/90 px-3.5 py-1 text-xs font-semibold text-teal-800">
          <Coffee className="h-3.5 w-3.5" />
          <span>Intentional Attention Reset</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-900">
          Take a mindful break
        </h1>
        <p className="text-xs sm:text-base text-zinc-600">
          Reset your attention in 60 seconds.
        </p>
      </div>

      {/* 3 Selectable Activities */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Activity 1: 🧠 Quick Challenge */}
        <button
          type="button"
          id="tab-quick-challenge"
          onClick={() => handleSelectActivity('quick_challenge')}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
            selectedActivity === 'quick_challenge'
              ? 'bg-teal-50/90 border-teal-600 ring-2 ring-teal-600 shadow-sm'
              : 'bg-white border-zinc-200/90 hover:bg-zinc-50'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🧠</span>
              <span className="text-sm font-bold text-zinc-900">1. Quick Challenge</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              A simple math or pattern question to quickly awaken executive focus.
            </p>
          </div>
          {selectedActivity === 'quick_challenge' && (
            <span className="text-[10px] font-bold text-teal-800 pt-2 block">Active Challenge</span>
          )}
        </button>

        {/* Activity 2: 🌬️ Breathing Reset */}
        <button
          type="button"
          id="tab-breathing-reset"
          onClick={() => handleSelectActivity('breathing_reset')}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
            selectedActivity === 'breathing_reset'
              ? 'bg-teal-50/90 border-teal-600 ring-2 ring-teal-600 shadow-sm'
              : 'bg-white border-zinc-200/90 hover:bg-zinc-50'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🌬️</span>
              <span className="text-sm font-bold text-zinc-900">2. Breathing Reset</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Animated breathing guide: "Inhale", "Hold", "Exhale" to downshift cortisol.
            </p>
          </div>
          {selectedActivity === 'breathing_reset' && (
            <span className="text-[10px] font-bold text-teal-800 pt-2 block">Active Breathing</span>
          )}
        </button>

        {/* Activity 3: 🧩 Memory Challenge */}
        <button
          type="button"
          id="tab-memory-challenge"
          onClick={() => handleSelectActivity('memory_challenge')}
          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
            selectedActivity === 'memory_challenge'
              ? 'bg-teal-50/90 border-teal-600 ring-2 ring-teal-600 shadow-sm'
              : 'bg-white border-zinc-200/90 hover:bg-zinc-50'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🧩</span>
              <span className="text-sm font-bold text-zinc-900">3. Memory Challenge</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Simple memory and sequence interaction to clear visual noise.
            </p>
          </div>
          {selectedActivity === 'memory_challenge' && (
            <span className="text-[10px] font-bold text-teal-800 pt-2 block">Active Memory</span>
          )}
        </button>
      </div>

      {/* Main Interactive Studio Container */}
      <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-10 shadow-xs">
        
        {/* Top Status Bar: 30-Second Timer */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-600">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span>Mindful Micro-Break</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-teal-700" />
            <span className="font-mono text-sm font-bold text-teal-900 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}s
            </span>
          </div>
        </div>

        {/* ========================================================
            CASE A: Completion Screen
            ======================================================== */}
        {isCompleted ? (
          <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 mx-auto shadow-xs">
              <CheckCircle2 className="h-10 w-10 text-emerald-700" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                Nice work! Your attention is reset.
              </h2>
              <p className="text-sm text-zinc-600 font-medium">
                Ready to return to your intention?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                id="btn-repeat-break"
                onClick={() => handleSelectActivity(selectedActivity)}
                className="rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                Repeat Exercise
              </button>
              
              <button
                type="button"
                id="btn-return-to-session"
                onClick={handleReturnToSession}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 py-3 text-sm font-bold text-white shadow-md shadow-emerald-800/20 hover:bg-emerald-800 transition active:scale-[0.99] cursor-pointer"
              >
                <span>Return to Session</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* ========================================================
                ACTIVITY 1: 🧠 Quick Challenge (Math question)
                ======================================================== */}
            {selectedActivity === 'quick_challenge' && (
              <div className="max-w-md mx-auto space-y-6 text-center py-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    Math Attention Activator
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-mono">
                    {mathQuestion.question}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Select the correct answer to immediately clear mental fog.
                  </p>
                </div>

                {/* Options Grid: 23, 25, 27, 29 */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {mathQuestion.options.map((opt) => {
                    const isPicked = selectedAnswer === opt;
                    const isCorrectAnswer = opt === mathQuestion.correctAnswer;
                    return (
                      <button
                        key={opt}
                        type="button"
                        id={`option-${opt}`}
                        onClick={() => handleSelectAnswer(opt)}
                        className={`py-4 px-6 rounded-2xl border text-xl font-bold font-mono transition-all active:scale-95 cursor-pointer ${
                          isPicked
                            ? isCorrectAnswer
                              ? 'bg-emerald-100 border-emerald-600 text-emerald-900 ring-2 ring-emerald-600'
                              : 'bg-rose-50 border-rose-400 text-rose-800'
                            : 'bg-zinc-50/70 border-zinc-200 text-zinc-800 hover:bg-teal-50 hover:border-teal-300'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && isCorrect === false && (
                  <p className="text-xs font-semibold text-rose-600 animate-in fade-in">
                    Not quite. Try another number!
                  </p>
                )}
              </div>
            )}

            {/* ========================================================
                ACTIVITY 2: 🌬️ Breathing Reset (Inhale, Hold, Exhale)
                ======================================================== */}
            {selectedActivity === 'breathing_reset' && (
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    Calming Breath Wave • Cycle {breathCycles + 1} of 3
                  </span>
                  <h3 className="text-2xl font-extrabold text-zinc-900">
                    {breathPhase}
                  </h3>
                </div>

                {/* Visual Animated Breathing Sphere */}
                <div className="relative flex items-center justify-center h-56 w-56">
                  <div
                    className={`absolute rounded-full transition-all duration-1000 ease-in-out ${
                      breathPhase === 'Inhale'
                        ? 'h-48 w-48 bg-emerald-200/70 ring-8 ring-emerald-300/40 scale-105'
                        : breathPhase === 'Hold'
                        ? 'h-48 w-48 bg-teal-200/80 ring-8 ring-teal-300/50 scale-100'
                        : 'h-28 w-28 bg-emerald-100 ring-4 ring-emerald-200/30 scale-90'
                    }`}
                  />
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-4xl font-black text-zinc-900 font-mono">
                      {breathCount}s
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-900 mt-1">
                      {breathPhase}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-800 transition cursor-pointer"
                  >
                    {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                    <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFinishBreak()}
                    className="rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                  >
                    I Feel Centered Now
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                ACTIVITY 3: 🧩 Memory Challenge (Pattern interaction)
                ======================================================== */}
            {selectedActivity === 'memory_challenge' && (
              <div className="max-w-sm mx-auto space-y-6 text-center py-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    Zen Sequence Matching
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900">
                    Tap the icons in pattern order
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Pattern: 🌊 Water → ☀️ Sun → 🌿 Leaf → ⛰️ Mountain
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-[220px] mx-auto">
                  {['🌿', '🌊', '⛰️', '☀️'].map((symbol, idx) => {
                    const isSelected = userSequence.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        id={`memory-tile-${idx}`}
                        onClick={() => handleMemoryTileClick(idx)}
                        className={`h-20 rounded-2xl border text-2xl flex items-center justify-center transition active:scale-90 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500 shadow-inner'
                            : 'bg-teal-50/60 border-teal-200 hover:bg-teal-100 text-zinc-800'
                        }`}
                      >
                        {symbol}
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-semibold text-zinc-500">
                  Progress: <strong className="text-teal-800">{userSequence.length} / 4</strong>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
