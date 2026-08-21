import React from 'react';
import { Sparkles, ShieldCheck, Heart, Cpu, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200/80 bg-white/70 py-10 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-semibold text-zinc-900 tracking-tight">MindfulLoop</span>
            </div>
            <p className="text-sm text-zinc-600 max-w-md leading-relaxed">
              "Use technology intentionally. Understand your digital behavior. Build better digital habits."
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-500 pt-2">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                No Blanket App Shaming
              </span>
              <span className="inline-flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-teal-600" />
                Contextual AI Engine
              </span>
            </div>
          </div>

          {/* Col 2: Core Philosophy */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 mb-3">
              Philosophy
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li>Context over Blanket Blocks</li>
              <li>Empathetic Smart Nudges</li>
              <li>Physiological Micro-Breaks</li>
              <li>Self-Correcting AI Whitelists</li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li>
                <Link to="/intention" className="hover:text-emerald-700 transition">
                  Set Study Intention
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-700 transition">
                  Live Focus Dashboard
                </Link>
              </li>
              <li>
                <Link to="/brain-break" className="hover:text-emerald-700 transition">
                  Brain Break Studio
                </Link>
              </li>
              <li>
                <Link to="/progress" className="hover:text-emerald-700 transition">
                  Habit Insights & Trends
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
          <p>© 2026 MindfulLoop. Built with care for student digital wellness & cognitive clarity.</p>
          <div className="flex items-center gap-1 text-zinc-500">
            <span>Powered by</span>
            <span className="font-semibold text-emerald-800">Gemini Contextual AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
