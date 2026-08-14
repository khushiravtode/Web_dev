import React, { useState } from 'react';
import { PREDEFINED_SCENARIOS } from '../data/mockData';
import { PredefinedScenario, ActivityItem } from '../types';
import { useSession } from '../context/SessionContext';
import {
  MonitorPlay,
  Play,
  RotateCcw,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface ActivitySimulatorProps {
  onSelectScenario?: (scenario: PredefinedScenario) => void;
}

export const ActivitySimulator: React.FC<ActivitySimulatorProps> = () => {
  const {
    activeSession,
    simulateActivity,
    isAutoSimulating,
    setIsAutoSimulating,
    isAnalyzing,
  } = useSession();

  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customApp, setCustomApp] = useState('YouTube');
  const [customTitle, setCustomTitle] = useState('Stanford CS229: Machine Learning Lecture 1');
  const [customUrl, setCustomUrl] = useState('youtube.com/watch?v=jGwO_EiC50Q');

  const handleRunPreset = (scenario: PredefinedScenario) => {
    simulateActivity(scenario);
  };

  const handleRunCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customApp.trim() || !customTitle.trim()) return;

    simulateActivity({
      appName: customApp,
      windowTitle: customTitle,
      urlDomain: customUrl || 'web.local',
    });
  };

  return (
    <div
      id="activity-simulator-panel"
      className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs space-y-4"
    >
      {/* Header with Auto-Sim toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-800">
            <MonitorPlay className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">
              Interactive Digital Activity Simulator
            </h3>
            <p className="text-xs text-zinc-500">
              Simulate student browser tabs & test AI context recognition in real-time
            </p>
          </div>
        </div>

        {/* Live Auto-Simulation mode */}
        <button
          onClick={() => setIsAutoSimulating(!isAutoSimulating)}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition border ${
            isAutoSimulating
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/30'
              : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
          }`}
        >
          <Radio className={`h-3.5 w-3.5 ${isAutoSimulating ? 'animate-pulse text-emerald-600' : 'text-zinc-400'}`} />
          <span>{isAutoSimulating ? 'Auto-Simulating Tabs (Active)' : 'Enable Auto-Sim'}</span>
        </button>
      </div>

      {/* Quick Scenario Buttons Grid */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Try Real Student Contexts
          </span>
          <button
            onClick={() => setIsCustomOpen(!isCustomOpen)}
            className="text-xs font-medium text-emerald-700 hover:underline inline-flex items-center gap-1"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            {isCustomOpen ? 'Hide Custom Input' : 'Test Custom Tab'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PREDEFINED_SCENARIOS.map((scenario) => {
            const isCurrentlyActive =
              activeSession?.currentActivity.appName === scenario.appName &&
              activeSession?.currentActivity.windowTitle.includes(scenario.appName);

            return (
              <button
                key={scenario.id}
                onClick={() => handleRunPreset(scenario)}
                disabled={isAnalyzing}
                className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between group ${
                  scenario.expectedAlignment
                    ? 'border-emerald-200/70 bg-emerald-50/30 hover:bg-emerald-50/70'
                    : 'border-amber-200/70 bg-amber-50/30 hover:bg-amber-50/70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-zinc-900 group-hover:text-emerald-800 transition">
                    {scenario.appName}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      scenario.expectedAlignment
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {scenario.expectedAlignment ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    {scenario.expectedAlignment ? 'Aligned (Context)' : 'Drift Trigger'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 line-clamp-2 mt-1">
                  {scenario.windowTitle}
                </p>
                <p className="text-[10px] text-zinc-400 italic mt-1.5 border-t border-zinc-200/50 pt-1">
                  {scenario.explanation}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Simulation Form Drawer */}
      {isCustomOpen && (
        <form
          onSubmit={handleRunCustom}
          className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3.5 space-y-3 animate-in slide-in-from-top-2 duration-150"
        >
          <div className="text-xs font-semibold text-zinc-800">
            Simulate Any Custom Tab or Activity
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div>
              <label className="block text-zinc-600 mb-1">App / Service</label>
              <input
                type="text"
                value={customApp}
                onChange={(e) => setCustomApp(e.target.value)}
                placeholder="e.g. YouTube, Discord, Coursera"
                className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-zinc-900 focus:outline-emerald-600"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-zinc-600 mb-1">Window Title / Video Name / Document</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. MIT 18.06 Linear Algebra Lecture 4"
                className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-zinc-900 focus:outline-emerald-600"
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-zinc-500">
              Active Intention: <strong className="text-zinc-800">{activeSession?.intention || 'Study'}</strong>
            </span>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-800 transition disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze with Gemini AI'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
