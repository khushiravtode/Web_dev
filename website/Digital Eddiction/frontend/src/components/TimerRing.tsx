import React from 'react';

interface TimerRingProps {
  elapsedSeconds: number;
  totalDurationMinutes: number;
  size?: number;
  strokeWidth?: number;
  isPaused?: boolean;
  isDrifting?: boolean;
}

export const TimerRing: React.FC<TimerRingProps> = ({
  elapsedSeconds,
  totalDurationMinutes,
  size = 200,
  strokeWidth = 10,
  isPaused = false,
  isDrifting = false,
}) => {
  const totalSeconds = totalDurationMinutes * 60;
  const progress = Math.min(1, elapsedSeconds / (totalSeconds || 1));
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const ringColor = isDrifting
    ? 'stroke-amber-500'
    : isPaused
    ? 'stroke-zinc-400'
    : 'stroke-emerald-600';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-zinc-100"
        />
        {/* Animated Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-700 ${ringColor}`}
        />
      </svg>

      {/* Center Digital Display */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 font-mono">
          {formatTime(remainingSeconds)}
        </span>
        <span className="text-xs font-medium text-zinc-500 mt-1">
          {isPaused ? 'Paused' : isDrifting ? 'Drifting' : 'Intentional Time Remaining'}
        </span>
        <span className="text-[11px] text-emerald-800 font-semibold mt-0.5">
          {Math.round(progress * 100)}% Complete
        </span>
      </div>
    </div>
  );
};
