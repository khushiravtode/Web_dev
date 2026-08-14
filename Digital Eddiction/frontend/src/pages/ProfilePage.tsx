import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { authService } from '../services/auth';
import { IntentionCategory } from '../types';
import {
  User,
  ShieldCheck,
  Bell,
  Sliders,
  Check,
  Sparkles,
  Download,
  RotateCcw,
  LogOut,
  Flame,
  Clock,
  Zap,
  Lock,
  Volume2,
  VolumeX,
  Compass,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useSession();

  // Profile fields
  const [name, setName] = useState(userProfile.name || 'Alex Rivera');
  const [email, setEmail] = useState(userProfile.email || 'alex.rivera@university.edu');

  // Preferences fields
  const [defaultIntention, setDefaultIntention] = useState<IntentionCategory>(
    (localStorage.getItem('mindfulloop_default_intention') as IntentionCategory) || 'Study'
  );
  const [defaultDuration, setDefaultDuration] = useState<number>(
    parseInt(localStorage.getItem('mindfulloop_default_duration') || '45', 10)
  );
  const [notificationPref, setNotificationPref] = useState<string>(
    localStorage.getItem('mindfulloop_notification_pref') || 'chimes'
  );
  const [nudgeStyle, setNudgeStyle] = useState<'empathetic' | 'socratic' | 'direct'>(
    userProfile.nudgeStyle || 'empathetic'
  );
  const [soundEnabled, setSoundEnabled] = useState(userProfile.soundEnabled);

  const [saveMessage, setSaveMessage] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();

    // Persist to localStorage
    localStorage.setItem('mindfulloop_default_intention', defaultIntention);
    localStorage.setItem('mindfulloop_default_duration', defaultDuration.toString());
    localStorage.setItem('mindfulloop_notification_pref', notificationPref);
    localStorage.setItem('mindfulloop_user_name', name);
    localStorage.setItem('mindfulloop_user_email', email);

    // Update global session context
    updateProfile({
      name,
      email,
      nudgeStyle,
      soundEnabled,
    });

    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 2500);
  };

  const handleLogout = () => {
    // Clear mock authentication session and any temporary session tokens
    authService.logout();
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('mindfulloop_auth_session');
    
    // Redirect to login
    navigate('/login');
  };

  const handleExportTelemetry = () => {
    const exportData = {
      profile: { name, email, streak: 13, focusSessions: 28, intentionalHours: 34.5 },
      preferences: { defaultIntention, defaultDuration, notificationPref, nudgeStyle, soundEnabled },
      exportDate: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'mindfulloop_privacy_export.json');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 mb-2">
            <User className="h-3.5 w-3.5" />
            <span>Account & Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Your Profile
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            Manage your digital wellness defaults, privacy settings, and cognitive preferences.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportTelemetry}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 shadow-2xs cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>

          <button
            onClick={handleLogout}
            id="btn-logout"
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition shadow-2xs cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* USER PROFILE CARD + SUMMARY METRICS */}
      <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar with calming emerald gradient badge */}
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white font-bold text-2xl shadow-md shadow-emerald-800/20">
              {name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'AR'}
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-white text-emerald-600 shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-zinc-900">{name}</h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                Active Member
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500">{email}</p>
            <p className="text-xs text-zinc-400">
              MindfulLoop student account • Intentional focus since Feb 2026
            </p>
          </div>
        </div>

        {/* 3 Key Profile Telemetry Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-zinc-100">
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 space-y-1">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-xs font-semibold uppercase tracking-wider">Current Streak</span>
              <Flame className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-amber-950 font-mono">13 Days 🔥</div>
            <p className="text-[11px] text-amber-800/80">Daily intentional focus active</p>
          </div>

          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 space-y-1">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Sessions</span>
              <Zap className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-950 font-mono">28 Sessions</div>
            <p className="text-[11px] text-emerald-800/80">92% intentional alignment</p>
          </div>

          <div className="rounded-2xl border border-teal-200/80 bg-teal-50/60 p-4 space-y-1">
            <div className="flex items-center justify-between text-teal-800">
              <span className="text-xs font-semibold uppercase tracking-wider">Intentional Time</span>
              <Clock className="h-4 w-4 text-teal-600" />
            </div>
            <div className="text-2xl font-bold text-teal-950 font-mono">34.5 Hours</div>
            <p className="text-[11px] text-teal-800/80">Logged in deep work mode</p>
          </div>
        </div>
      </div>

      {/* FORM: PREFERENCES CONFIGURATION */}
      <form onSubmit={handleSavePreferences} className="space-y-6">
        <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 pb-4">
            <h2 className="text-lg font-bold text-zinc-900">Session & Nudge Preferences</h2>
            <p className="text-xs text-zinc-500">
              Customize how MindfulLoop behaves during your focus blocks
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Preference 1: Default Intention */}
            <div className="space-y-1.5">
              <label htmlFor="pref-default-intention" className="block font-semibold text-zinc-700">
                Default Intention
              </label>
              <select
                id="pref-default-intention"
                value={defaultIntention}
                onChange={(e) => setDefaultIntention(e.target.value as IntentionCategory)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-emerald-600"
              >
                <option value="Study">Study (Assignments, Research, Reading)</option>
                <option value="Work">Work (Coding, Engineering, Writing)</option>
                <option value="Creative Work">Creative Work (Design, Art, Media)</option>
                <option value="Entertainment">Entertainment (Leisure, Video)</option>
                <option value="Personal Growth">Personal Growth (Wellness, Habits)</option>
              </select>
              <p className="text-[11px] text-zinc-400">Pre-selected category when starting a session.</p>
            </div>

            {/* Preference 2: Default Session Duration */}
            <div className="space-y-1.5">
              <label htmlFor="pref-default-duration" className="block font-semibold text-zinc-700">
                Default Session Duration
              </label>
              <select
                id="pref-default-duration"
                value={defaultDuration}
                onChange={(e) => setDefaultDuration(parseInt(e.target.value, 10))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-emerald-600"
              >
                <option value={15}>15 minutes (Quick micro-focus)</option>
                <option value={25}>25 minutes (Standard Pomodoro)</option>
                <option value={45}>45 minutes (Optimal lecture block)</option>
                <option value={60}>60 minutes (Deep study session)</option>
                <option value={90}>90 minutes (Ultradian rhythm block)</option>
              </select>
              <p className="text-[11px] text-zinc-400">Default timer length for new sessions.</p>
            </div>

            {/* Preference 3: Notification Preference */}
            <div className="space-y-1.5">
              <label htmlFor="pref-notifications" className="block font-semibold text-zinc-700">
                Notification Preference
              </label>
              <select
                id="pref-notifications"
                value={notificationPref}
                onChange={(e) => {
                  setNotificationPref(e.target.value);
                  setSoundEnabled(e.target.value === 'chimes' || e.target.value === 'all');
                }}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-emerald-600"
              >
                <option value="chimes">Gentle Harmonic Chimes (Recommended)</option>
                <option value="visual_only">Visual Nudge Only (Silent Mode)</option>
                <option value="all">Sound Chimes + Browser Banner</option>
              </select>
              <p className="text-[11px] text-zinc-400">Alert style when check-in or drift is triggered.</p>
            </div>

            {/* Preference 4: Smart Nudge Preference Tone */}
            <div className="space-y-1.5">
              <label htmlFor="pref-nudge-style" className="block font-semibold text-zinc-700">
                Smart Nudge Preference Tone
              </label>
              <select
                id="pref-nudge-style"
                value={nudgeStyle}
                onChange={(e) => setNudgeStyle(e.target.value as any)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-emerald-600"
              >
                <option value="empathetic">Empathetic & Supportive (Zero guilt, warm guidance)</option>
                <option value="socratic">Socratic Inquiry (Reflective thought-provoking questions)</option>
                <option value="direct">Direct Boundary (Concise, firm reminders)</option>
              </select>
              <p className="text-[11px] text-zinc-400">Tone used by AI coach when drifting.</p>
            </div>
          </div>
        </div>

        {/* PRIVACY SECTION (Mandated Content) */}
        <div className="rounded-3xl border border-emerald-200/90 bg-emerald-50/40 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                Your digital wellness data
              </h2>
              <span className="text-[11px] text-emerald-800 font-semibold uppercase tracking-wider">
                Privacy-First Guarantee
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 sm:p-5 border border-emerald-200/70 shadow-2xs space-y-2">
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
              MindfulLoop uses activity information to provide personalized wellness insights. Only collect information necessary for the feature being used.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] text-zinc-600">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Zero selling or monetization of telemetry data</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Local client-side caching & instant export capability</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Context whitelisting honors student research sites</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>No employer or institutional surveillance feeds</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div>
            {saveMessage && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 animate-in fade-in">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Preferences saved successfully!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleLogout}
              className="w-1/2 sm:w-auto rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition shadow-2xs cursor-pointer"
            >
              Log Out
            </button>
            <button
              type="submit"
              id="btn-save-profile-changes"
              className="w-1/2 sm:w-auto rounded-xl bg-emerald-700 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-emerald-800/15 hover:bg-emerald-800 transition active:scale-[0.99] cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default ProfilePage;
