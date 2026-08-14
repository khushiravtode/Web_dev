import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  Sparkles,
  BarChart3,
  User,
  Coffee,
  Play,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useSession } from '../context/SessionContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { activeSession, userProfile, updateProfile } = useSession();

  const navLinks = [
    { path: '/intention', label: 'Set Intention', icon: Compass },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/brain-break', label: 'Brain Break', icon: Coffee },
    { path: '/progress', label: 'Progress', icon: BarChart3 },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isSessionActive = activeSession && activeSession.status === 'active';
  const isDrifting = activeSession && activeSession.currentDriftLevel !== 'none';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-[#fbfcfb]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 transition hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm shadow-emerald-700/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold tracking-tight text-zinc-900 text-base sm:text-lg">
                MindfulLoop
              </span>
              <span className="rounded-full bg-emerald-100/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 tracking-wide uppercase">
                AI Wellness
              </span>
            </div>
            <p className="hidden text-[11px] text-zinc-500 sm:block -mt-0.5">
              Intentional Technology
            </p>
          </div>
        </Link>

        {/* Live Active Intention Pill (Visible if session running) */}
        {activeSession && (
          <div className="hidden lg:flex items-center gap-3 rounded-full border border-emerald-950/10 bg-white/90 px-3.5 py-1.5 shadow-sm text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                {isSessionActive && !isDrifting && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                )}
                {isDrifting && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    isDrifting
                      ? 'bg-amber-500'
                      : isSessionActive
                      ? 'bg-emerald-500'
                      : 'bg-zinc-400'
                  }`}
                ></span>
              </span>
              <span className="font-medium text-zinc-700">
                {activeSession.intention}:
              </span>
              <span className="font-semibold text-zinc-900 max-w-[140px] truncate">
                {activeSession.goalTopic}
              </span>
            </div>
            <div className="h-3.5 w-px bg-zinc-200" />
            <span className="font-mono font-medium text-emerald-700">
              {formatTime(activeSession.totalDurationMinutes * 60 - activeSession.elapsedSeconds)}
            </span>
            <Link
              to="/dashboard"
              className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-600 hover:bg-zinc-200 transition"
            >
              View
            </Link>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 shadow-xs ring-1 ring-emerald-600/20'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-700' : 'text-zinc-500'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons & Mobile Quick CTA */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => updateProfile({ soundEnabled: !userProfile.soundEnabled })}
            title={userProfile.soundEnabled ? 'Mute mindful chimes' : 'Enable mindful chimes'}
            aria-label="Toggle Sound"
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition"
          >
            {userProfile.soundEnabled ? (
              <Volume2 className="h-4 w-4 text-emerald-700" />
            ) : (
              <VolumeX className="h-4 w-4 text-zinc-400" />
            )}
          </button>

          {!activeSession || activeSession.status === 'completed' ? (
            <Link
              to="/intention"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white shadow-xs hover:bg-emerald-800 transition"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Start Focus
            </Link>
          ) : (
            <Link
              to="/brain-break"
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-50 px-3 py-1.5 text-xs sm:text-sm font-medium text-teal-800 ring-1 ring-teal-600/20 hover:bg-teal-100 transition"
            >
              <Coffee className="h-3.5 w-3.5" />
              Take Break
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden border-t border-zinc-200/60 bg-white px-2 py-1.5 overflow-x-auto justify-around">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                isActive ? 'text-emerald-700 font-semibold' : 'text-zinc-500'
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
};
