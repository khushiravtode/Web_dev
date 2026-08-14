import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { IntentionPage } from './pages/IntentionPage';
import { DashboardPage } from './pages/DashboardPage';
import { BrainBreakPage } from './pages/BrainBreakPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <SessionProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#fbfcfb] text-zinc-900 selection:bg-emerald-200 selection:text-emerald-900 font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/intention" element={<IntentionPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/brain-break" element={<BrainBreakPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </SessionProvider>
  );
}
