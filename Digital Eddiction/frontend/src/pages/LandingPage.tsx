import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  LayoutDashboard,
  Coffee,
  BarChart3,
  ShieldCheck,
  Zap,
  ArrowRight,
  Brain,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  BookOpen,
  Layers,
  Heart,
  TrendingUp,
  Clock,
  AlertTriangle,
  Flame,
  Check,
  ChevronRight,
  Eye,
  Sliders,
  Bell,
  Cpu,
} from 'lucide-react';
import { PREDEFINED_SCENARIOS } from '../data/mockData';

export const LandingPage: React.FC = () => {
  const [selectedDemoScenario, setSelectedDemoScenario] = useState(PREDEFINED_SCENARIOS[0]);
  const [activeNudgeDismissed, setActiveNudgeDismissed] = useState(false);

  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Ambient atmospheric backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[400px] bg-gradient-to-tr from-emerald-100/50 via-teal-50/40 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Hero Header Text */}
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            {/* Small badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/70 bg-emerald-50/90 px-4 py-1.5 text-xs font-semibold text-emerald-800 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
              <span>AI-Powered Digital Wellness</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.12]">
              Use technology <span className="text-emerald-700">intentionally.</span>
            </h1>

            {/* Supporting text */}
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-600 leading-relaxed">
              MindfulLoop understands how your digital behavior connects with your intentions and helps you stay focused without blocking the technology you need.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                to="/login"
                id="hero-cta-get-started"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-800/20 hover:bg-emerald-800 transition"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                onClick={scrollToHowItWorks}
                id="hero-cta-how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-7 py-3.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 transition shadow-2xs"
              >
                <Compass className="h-4 w-4 text-emerald-700" />
                <span>See How It Works</span>
              </a>
            </div>
          </div>

          {/* HERO VISUAL: Polished Dashboard-Style Preview */}
          <div className="mx-auto max-w-5xl rounded-3xl border border-zinc-200/90 bg-white/90 p-4 sm:p-6 lg:p-8 shadow-xl shadow-zinc-200/50 backdrop-blur-xs">
            {/* Top Preview Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-900">Live Focus Telemetry Preview</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">Alex Rivera • CS 189 Machine Learning</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-medium">Intention:</span>
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/60">
                  Study • Deep Work
                </span>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {/* 1. Wellness Score */}
              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-4 space-y-2">
                <div className="flex items-center justify-between text-zinc-500">
                  <span className="text-xs font-medium">Wellness Score</span>
                  <Heart className="h-4 w-4 text-rose-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-zinc-900 tracking-tight">92</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    +4 pts today
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">High intentionality & consistent resets</p>
              </div>

              {/* 2. Screen Time */}
              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-4 space-y-2">
                <div className="flex items-center justify-between text-zinc-500">
                  <span className="text-xs font-medium">Screen Time</span>
                  <Clock className="h-4 w-4 text-teal-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-zinc-900 tracking-tight">4h 15m</span>
                  <span className="text-xs font-semibold text-teal-700">88% aligned</span>
                </div>
                <p className="text-[11px] text-zinc-500">3h 45m intentional • 30m recreational</p>
              </div>

              {/* 3. Digital Drift */}
              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-4 space-y-2">
                <div className="flex items-center justify-between text-zinc-500">
                  <span className="text-xs font-medium">Digital Drift</span>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-zinc-900 tracking-tight">Low</span>
                  <span className="text-xs font-semibold text-emerald-700">8m total</span>
                </div>
                <p className="text-[11px] text-zinc-500">2 gentle smart nudges recovered</p>
              </div>

              {/* 4. Focus Session */}
              <div className="rounded-2xl border border-zinc-200/80 bg-emerald-50/40 p-4 space-y-2">
                <div className="flex items-center justify-between text-emerald-800">
                  <span className="text-xs font-medium">Focus Session</span>
                  <Flame className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-emerald-950 tracking-tight">25:00</span>
                  <span className="text-xs font-semibold text-emerald-800">Block 3 of 4</span>
                </div>
                <p className="text-[11px] text-emerald-700">Linear Algebra & Matrix Decompositions</p>
              </div>
            </div>

            {/* Smart Nudge Interactive Demo Banner inside Preview */}
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                        Contextual Smart Nudge Example
                      </h3>
                      <span className="text-[10px] bg-amber-200/70 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
                        Empathetic Check-in
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-700 mt-1">
                      "We noticed you opened YouTube. If you're watching <em>'3Blue1Brown: Essence of Linear Algebra'</em>, carry on! If your mind is fatigued, take a quick 2-minute brain break."
                    </p>
                  </div>
                </div>

                {/* Simulated interactive actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!activeNudgeDismissed ? (
                    <>
                      <button
                        onClick={() => setActiveNudgeDismissed(true)}
                        className="rounded-lg bg-white border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 shadow-2xs transition"
                      >
                        Yes, Studying
                      </button>
                      <Link
                        to="/brain-break"
                        className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-800 shadow-2xs transition"
                      >
                        Take 2m Break
                      </Link>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-lg">
                      <Check className="h-3.5 w-3.5" /> Intention Confirmed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            The Student Attention Paradox
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
            Your screen time tells only half the story.
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Raw hourly metrics cannot distinguish between a focused research afternoon and an algorithmic rabbit hole.
          </p>
        </div>

        {/* 3 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 space-y-4 shadow-xs hover:border-zinc-300 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-zinc-900">
                1. Too much passive scrolling
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Algorithmic feeds prey on micro-fatigue. A student looking up one reference gets pulled into an infinite stream of short-form clips without realizing it.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-medium text-rose-700 bg-rose-50/60 p-2.5 rounded-xl">
              Average student loses 47 minutes per day to unconscious digital drifting.
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 space-y-4 shadow-xs hover:border-zinc-300 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-zinc-900">
                2. Difficulty staying focused
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Constant notification pings and 30 open browser tabs trigger cognitive thrashing. Transitioning between assignments depletes working memory.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-medium text-amber-800 bg-amber-50/60 p-2.5 rounded-xl">
              Takes up to 23 minutes to return to deep concentration after a single tab switch.
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 space-y-4 shadow-xs hover:border-zinc-300 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-100">
              <XCircle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-zinc-900">
                3. Screen-time tools lack context
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Legacy blocker apps classify entire domains as "bad". They lock you out of YouTube lectures, Reddit coding threads, and Discord study groups when you need them most.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-medium text-teal-800 bg-teal-50/60 p-2.5 rounded-xl">
              Blanket bans cause frustration, leading 82% of students to disable blockers.
            </div>
          </div>
        </div>
      </section>

      {/* 3. SOLUTION SECTION: The Process */}
      <section id="how-it-works" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-20">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Intelligent Attention Cycle
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
            MindfulLoop closes the loop.
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            A conscious 5-stage framework that replaces rigid restrictions with real-time cognitive awareness.
          </p>
        </div>

        {/* 5-Step Connected Process Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Step 1 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 space-y-3 shadow-xs relative group hover:border-emerald-300 transition">
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-xs font-bold text-white">
                1
              </span>
              <Compass className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">Set Intention</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Define your focus mode (Study, Work, Creative) and specific topic before opening your tools.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 space-y-3 shadow-xs relative group hover:border-emerald-300 transition">
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-xs font-bold text-white">
                2
              </span>
              <Eye className="h-5 w-5 text-teal-600" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">Track Activity</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              MindfulLoop observes window titles, document topics, and media categories non-intrusively.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 space-y-3 shadow-xs relative group hover:border-emerald-300 transition">
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-xs font-bold text-white">
                3
              </span>
              <Sliders className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">Detect Drift</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              AI compares current app context against your stated goal to catch subtle drift early.
            </p>
          </div>

          {/* Step 4 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 space-y-3 shadow-xs relative group hover:border-emerald-300 transition">
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-xs font-bold text-white">
                4
              </span>
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">Smart Nudge</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Receive gentle, empathetic micro-prompts or a 2-min brain break instead of an aggressive block.
            </p>
          </div>

          {/* Step 5 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 space-y-3 shadow-xs relative group hover:border-emerald-300 transition">
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-xs font-bold text-white">
                5
              </span>
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">Improve</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Review weekly cognitive clarity graphs, peak focus hours, and self-correcting whitelist memory.
            </p>
          </div>
        </div>
      </section>

      {/* 4. INNOVATION SECTION */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Engineered for Modern Students
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
            Innovative features that respect your autonomy.
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Built with cognitive neuroscience and respectful AI design principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: Intent-based tracking */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 space-y-3 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Intent-based tracking</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Set your target intention first. Whether studying Organic Chemistry, writing a thesis, or unwinding, all activity is benchmarked against what YOU decided to achieve.
            </p>
          </div>

          {/* Feature 2: Context-aware Digital Drift detection */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 space-y-3 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Context-aware Digital Drift detection</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              No blacklists. MindfulLoop understands that a YouTube video on "Fourier Transforms" is study, while a viral meme reel is drift. You can also teach the system your custom habits.
            </p>
          </div>

          {/* Feature 3: Personalized Smart Nudges */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 space-y-3 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Personalized Smart Nudges</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Choose your coaching tone: Empathetic, Socratic, or Direct. Nudges encourage self-regulation through small, achievable micro-steps rather than shame or frustration.
            </p>
          </div>

          {/* Feature 4: Brain Breaks */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 space-y-3 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Coffee className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Brain Breaks</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Interactive 2-5 minute physiological resets: 4-7-8 parasympathetic breathing, 20-20-20 eye relief, and desk stretches that replenish dopamine without doomscrolling.
            </p>
          </div>

          {/* Feature 5: AI-powered insights */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 space-y-3 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">AI-powered insights</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Gemini analyzes your focus rhythms over time, identifies your peak focus windows, calculates your Intentional Alignment Rate, and generates personalized academic wellness suggestions.
            </p>
          </div>

          {/* Feature 6: Privacy & Autonomy */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 space-y-3 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Total User Control & Overrides</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              You always have the final say. If MindfulLoop misclassifies an activity, one click overrides the decision and updates your persistent custom whitelist instantly.
            </p>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE LIVE CONTEXT SIMULATOR */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              Compare: Blanket Blocker vs. Context-Aware AI
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              Select an activity scenario below to see how MindfulLoop preserves your research workflow while traditional blockers disrupt you.
            </p>
          </div>

          {/* Interactive Toggle Scenarios */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left selector */}
            <div className="lg:col-span-5 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-2">
                Click a Test Scenario:
              </span>
              {PREDEFINED_SCENARIOS.slice(0, 4).map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedDemoScenario(scenario)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedDemoScenario.id === scenario.id
                      ? 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500 shadow-2xs'
                      : 'bg-zinc-50/60 border-zinc-200/70 hover:bg-zinc-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-900">
                    <span>{scenario.appName}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        scenario.expectedAlignment
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {scenario.expectedAlignment ? 'Educational / Aligned' : 'Digital Drift'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 truncate mt-1">
                    {scenario.windowTitle}
                  </p>
                </button>
              ))}
            </div>

            {/* Right comparison card */}
            <div className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
                <div>
                  <span className="text-xs font-semibold text-zinc-500 uppercase">
                    Active Student Intention:
                  </span>
                  <div className="text-sm font-bold text-emerald-800 flex items-center gap-1.5 mt-0.5">
                    <Compass className="h-4 w-4" />
                    {selectedDemoScenario.forIntention} Session
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-400">Content inspected:</span>
                  <div className="text-xs font-mono text-zinc-800">{selectedDemoScenario.appName}</div>
                </div>
              </div>

              {/* Contrast columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Traditional Blocker */}
                <div className="rounded-xl border border-rose-200 bg-white p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                    <XCircle className="h-4 w-4 text-rose-500" />
                    <span>Traditional Blocker</span>
                  </div>
                  <p className="text-xs font-bold text-rose-950">BLOCKED (0% Context)</p>
                  <p className="text-[11px] text-zinc-500 leading-snug">
                    Blindly closes {selectedDemoScenario.appName}, breaking student research and causing frustration.
                  </p>
                </div>

                {/* MindfulLoop Context AI */}
                <div className="rounded-xl border border-emerald-300 bg-emerald-50/40 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <span>MindfulLoop Context AI</span>
                  </div>
                  <p className="text-xs font-bold text-emerald-950">
                    {selectedDemoScenario.expectedAlignment
                      ? 'APPROVED (Educational Content)'
                      : 'GENTLE SMART NUDGE'}
                  </p>
                  <p className="text-[11px] text-zinc-700 leading-snug">
                    {selectedDemoScenario.explanation}
                  </p>
                </div>
              </div>

              <div className="text-center pt-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  <span>Test this in the live interactive dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 p-8 sm:p-14 text-center text-white space-y-6 shadow-xl shadow-emerald-950/20">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-900/40 px-3.5 py-1 text-xs font-medium text-emerald-200">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Join thousands of mindful student learners</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to take control of your digital habits?
          </h2>

          <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
            Experience technology as an amplifier of your focus and intellect, rather than an endless distraction loop.
          </p>

          <div className="pt-3">
            <Link
              to="/register"
              id="cta-start-mindfulloop"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-semibold text-emerald-950 shadow-lg hover:bg-emerald-50 transition transform hover:-translate-y-0.5"
            >
              <span>Start MindfulLoop</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-emerald-200/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              100% Free for Students
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-emerald-400" />
              Empathetic AI Architecture
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
