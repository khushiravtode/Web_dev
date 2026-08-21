import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { Sparkles, Check, X, ShieldCheck, BookOpen, Lightbulb } from 'lucide-react';

interface ContextCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContextCorrectionModal: React.FC<ContextCorrectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeSession, overrideClassification } = useSession();
  const [isApproved, setIsApproved] = useState(true);
  const [reason, setReason] = useState('Watching educational video tutorial relevant to my course');
  const [alwaysWhitelist, setAlwaysWhitelist] = useState(true);

  if (!isOpen || !activeSession) return null;

  const currentActivity = activeSession.currentActivity;

  const presetReasons = [
    'Watching educational video tutorial relevant to course',
    'Creative design research and aesthetic references',
    'Collaborating with study group on homework problem',
    'Looking up technical API documentation & error fix',
    'Taking intentional micro-break within study session',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    overrideClassification(currentActivity.id, isApproved, reason);
    onClose();
  };

  return (
    <div
      id="context-correction-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-900">
                Correct AI Activity Classification
              </h3>
              <p className="text-xs text-zinc-500">
                Help MindfulLoop understand your unique context
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Current Activity details */}
        <div className="my-4 rounded-xl bg-zinc-50 p-3.5 border border-zinc-200/80 text-xs space-y-1">
          <div className="flex items-center justify-between text-zinc-500 font-medium">
            <span>App: <strong className="text-zinc-900">{currentActivity.appName}</strong></span>
            <span>Intention: <strong className="text-emerald-700">{activeSession.intention}</strong></span>
          </div>
          <div className="text-zinc-700 truncate font-mono text-[11px]">
            {currentActivity.windowTitle}
          </div>
        </div>

        {/* Correction Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
              Is this activity intentional for your current session?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsApproved(true)}
                className={`flex items-center justify-center gap-2 rounded-xl p-2.5 text-xs font-medium border transition ${
                  isApproved
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500'
                    : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Yes, Intentional</span>
              </button>
              <button
                type="button"
                onClick={() => setIsApproved(false)}
                className={`flex items-center justify-center gap-2 rounded-xl p-2.5 text-xs font-medium border transition ${
                  !isApproved
                    ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-500'
                    : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                <X className="h-4 w-4 text-amber-600" />
                <span>No, It was Drift</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
              Explain why (Quick presets or custom note):
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {presetReasons.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setReason(preset)}
                  className={`text-[11px] rounded-lg px-2.5 py-1 transition border ${
                    reason === preset
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-medium'
                      : 'bg-zinc-100/80 text-zinc-600 border-zinc-200 hover:bg-zinc-200/70'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-zinc-300 bg-white p-2.5 text-xs text-zinc-900 focus:outline-emerald-600"
              placeholder="e.g. This YouTube video is a lecture required for my assignment."
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <input
              type="checkbox"
              id="whitelist-check"
              checked={alwaysWhitelist}
              onChange={(e) => setAlwaysWhitelist(e.target.checked)}
              className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="whitelist-check">
              Remember this pattern for future <span className="font-semibold text-zinc-900">{activeSession.intention}</span> sessions
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-800 shadow-xs"
            >
              Save Context Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
