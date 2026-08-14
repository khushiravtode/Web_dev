import React from 'react';
import { SmartNudge, BrainBreakType } from '../types';
import { Sprout, ArrowRight, X, Coffee, Check, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SmartNudgeModalProps {
  nudge: SmartNudge | null;
  onDismiss: () => void;
  onTakeBreak: (type?: BrainBreakType) => void;
  onOverride: () => void;
  intentionName?: string;
  durationMinutes?: number;
  isDurationExceeded?: boolean;
  overtimeMinutes?: number;
}

export const SmartNudgeModal: React.FC<SmartNudgeModalProps> = ({
  nudge,
  onDismiss,
  onTakeBreak,
  onOverride,
  intentionName = 'Study',
  durationMinutes = 30,
  isDurationExceeded = false,
  overtimeMinutes = 5,
}) => {
  const navigate = useNavigate();

  if (!nudge) return null;

  const displayHeading = nudge.title || 'Time for a quick check-in';
  const primaryMessage =
    nudge.message ||
    `Your ${durationMinutes}-minute ${intentionName} intention is complete.`;

  const secondaryMessage =
    isDurationExceeded || overtimeMinutes > 0
      ? `You've continued for ${overtimeMinutes} additional minutes. Would you like to continue or reset your attention?`
      : 'Would you like to continue or reset your attention?';

  const handleTakeBreak = () => {
    onTakeBreak();
    navigate('/brain-break');
  };

  const handleUsingForGoal = () => {
    onOverride();
    onDismiss();
  };

  return (
    <div
      id="smart-nudge-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg rounded-3xl border border-emerald-200/90 bg-white p-6 sm:p-7 shadow-2xl shadow-emerald-950/15 space-y-5">
        
        {/* Header with Small 🌿 Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="text-xl">🌿</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Mindful Attention Check-in
              </span>
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                {displayHeading}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
            aria-label="Close check-in modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message Card: Calm, Non-judgmental */}
        <div className="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-200/70 space-y-2">
          <p className="text-sm font-semibold text-emerald-950 leading-relaxed">
            {primaryMessage}
          </p>
          <p className="text-xs text-emerald-800/90 leading-relaxed">
            {secondaryMessage}
          </p>

          {nudge.microStep && (
            <div className="mt-2.5 pt-2.5 border-t border-emerald-200/60 text-[11px] text-emerald-900 flex items-start gap-1.5">
              <span className="font-semibold text-emerald-800 shrink-0">Micro-Step:</span>
              <span>{nudge.microStep}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Primary Action: Continue */}
          <button
            type="button"
            id="nudge-btn-continue"
            onClick={onDismiss}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition active:scale-[0.99] cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>Continue</span>
          </button>

          {/* Secondary Action: Take a Brain Break */}
          <button
            type="button"
            id="nudge-btn-brain-break"
            onClick={handleTakeBreak}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-50 py-3 text-xs sm:text-sm font-semibold text-teal-900 border border-teal-200/80 hover:bg-teal-100 transition cursor-pointer"
          >
            <Coffee className="h-4 w-4 text-teal-700" />
            <span>Take a Brain Break</span>
          </button>

          {/* Tertiary Text Button: I'm Using This for My Goal */}
          <div className="pt-1 text-center">
            <button
              type="button"
              id="nudge-btn-override"
              onClick={handleUsingForGoal}
              className="text-xs font-semibold text-zinc-600 hover:text-emerald-800 transition underline underline-offset-4 cursor-pointer"
            >
              I'm Using This for My Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
