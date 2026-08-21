import React from 'react';
import { DriftLevel } from '../types';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

interface DriftMeterProps {
  driftLevel: DriftLevel;
  isAligned: boolean;
  confidence: number;
  reasoning: string;
  onOverrideClick?: () => void;
  isAnalyzing?: boolean;
}

export const DriftMeter: React.FC<DriftMeterProps> = ({
  driftLevel,
  isAligned,
  confidence,
  reasoning,
  onOverrideClick,
  isAnalyzing = false,
}) => {
  const getLevelConfig = () => {
    if (isAnalyzing) {
      return {
        label: 'Contextualizing Activity...',
        bg: 'bg-zinc-50 border-zinc-200',
        textColor: 'text-zinc-600',
        badgeBg: 'bg-zinc-100 text-zinc-700',
        barColor: 'bg-zinc-300',
        percentage: 50,
        icon: Sparkles,
      };
    }

    if (isAligned) {
      return {
        label: 'Intentional Alignment (Optimal)',
        bg: 'bg-emerald-50/70 border-emerald-200/80',
        textColor: 'text-emerald-900',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        barColor: 'bg-emerald-500',
        percentage: 15,
        icon: CheckCircle2,
      };
    }

    switch (driftLevel) {
      case 'low':
        return {
          label: 'Minor Digital Drift Detected',
          bg: 'bg-amber-50/70 border-amber-200/80',
          textColor: 'text-amber-900',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
          barColor: 'bg-amber-400',
          percentage: 45,
          icon: AlertTriangle,
        };
      case 'medium':
        return {
          label: 'Moderate Digital Drift (Recreational Loop)',
          bg: 'bg-orange-50/70 border-orange-200/80',
          textColor: 'text-orange-900',
          badgeBg: 'bg-orange-100 text-orange-800 border-orange-200',
          barColor: 'bg-orange-500',
          percentage: 75,
          icon: AlertTriangle,
        };
      case 'high':
        return {
          label: 'High Digital Drift (Compulsive Rabbit Hole)',
          bg: 'bg-rose-50/70 border-rose-200/80',
          textColor: 'text-rose-900',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
          barColor: 'bg-rose-500',
          percentage: 95,
          icon: AlertOctagon,
        };
      default:
        return {
          label: 'Intentional Alignment',
          bg: 'bg-emerald-50/70 border-emerald-200/80',
          textColor: 'text-emerald-900',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          barColor: 'bg-emerald-500',
          percentage: 15,
          icon: ShieldCheck,
        };
    }
  };

  const config = getLevelConfig();
  const IconComponent = config.icon;

  return (
    <div
      id="drift-meter-card"
      className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-xs ${config.bg}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${config.badgeBg} border`}>
            <IconComponent className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs sm:text-sm font-semibold ${config.textColor}`}>
                {config.label}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/80 font-medium text-zinc-600 border border-zinc-200/60">
                {Math.round(confidence * 100)}% confidence
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-0.5">
              Context-aware analysis • No simplistic app blocks
            </p>
          </div>
        </div>

        {onOverrideClick && (
          <button
            onClick={onOverrideClick}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition shadow-2xs"
            title="Teach MindfulLoop why this activity is intentional"
          >
            <HelpCircle className="h-3.5 w-3.5 text-zinc-500" />
            Correct Classification
          </button>
        )}
      </div>

      {/* Visual Drift Level Bar */}
      <div className="space-y-1.5 my-3">
        <div className="flex justify-between text-[11px] font-medium text-zinc-500">
          <span>Intentional Focus</span>
          <span>Light Wandering</span>
          <span>Dopamine Loop</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200/80">
          <div
            className={`h-full transition-all duration-500 rounded-full ${config.barColor}`}
            style={{ width: `${config.percentage}%` }}
          />
        </div>
      </div>

      {/* AI Contextual Reasoning Box */}
      <div className="mt-3 rounded-xl bg-white/90 p-3 border border-zinc-200/70 text-xs leading-relaxed text-zinc-700">
        <div className="flex items-center gap-1.5 font-medium text-zinc-900 mb-1">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>Contextual Rationale:</span>
        </div>
        <p className="italic text-zinc-600">{reasoning}</p>
      </div>
    </div>
  );
};
