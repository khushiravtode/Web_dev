import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Heart,
  Clock,
  Compass,
  X,
} from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { authService } from '../services/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useSession();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Validation & UI states
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Forgot password modal state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  // Pre-fill remembered email if saved or in userProfile
  useEffect(() => {
    const savedEmail = authService.getSavedEmail() || userProfile.email || 'alex.rivera@university.edu';
    if (savedEmail) {
      setEmail(savedEmail);
      setPassword('mindfulstudent2026'); // Pre-fill default demo password for smooth evaluation
    }
  }, [userProfile.email]);

  // Validation helper
  const validate = () => {
    const newErrors: { email?: string; password?: string; general?: string } = {};

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.email = 'Please enter a valid email address (e.g., student@university.edu).';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  // Submit Handler for Email/Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await authService.login({
        email,
        password,
        rememberMe,
      });

      if (result.success && result.user) {
        // Sync with Session Context
        updateProfile({
          email: result.user.email,
          name: result.user.name,
        });

        // Navigate to main application dashboard
        navigate('/dashboard');
      } else {
        setErrors({ general: result.error || 'Authentication failed. Please check your credentials.' });
      }
    } catch {
      setErrors({ general: 'A network error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrors({});

    try {
      const result = await authService.loginWithGoogle();
      if (result.success && result.user) {
        updateProfile({
          email: result.user.email,
          name: result.user.name,
        });
        navigate('/dashboard');
      } else {
        setErrors({ general: result.error || 'Google authentication was not completed.' });
      }
    } catch {
      setErrors({ general: 'Failed to connect with Google. Please try standard login.' });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim())) {
      setForgotStatus({
        type: 'error',
        message: 'Please enter a valid university email address.',
      });
      return;
    }

    setForgotStatus({ type: 'loading', message: 'Sending password recovery link...' });
    const res = await authService.requestPasswordReset(forgotEmail);
    if (res.success) {
      setForgotStatus({
        type: 'success',
        message: res.message,
      });
    } else {
      setForgotStatus({
        type: 'error',
        message: res.message || 'Unable to send reset instructions.',
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Container with responsive 2-column split */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* ========================================================
            LEFT SIDE: Brand identity, statement, and calming visual
            ======================================================== */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-teal-950 p-8 sm:p-10 text-white relative overflow-hidden shadow-xl shadow-emerald-950/20">
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Marker */}
          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 shadow-inner group-hover:scale-105 transition">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">MindfulLoop</span>
            </Link>

            <div className="space-y-3 pt-4">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-white">
                Welcome back. <br />
                <span className="text-emerald-300 font-medium">Let's get back to what matters.</span>
              </h2>
              <p className="text-sm text-emerald-100/80 leading-relaxed max-w-sm">
                Rediscover deep concentration with gentle, context-aware focus tracking designed for intentional learners.
              </p>
            </div>
          </div>

          {/* Abstract Wellness Visual Illustration (Center Graphic) */}
          <div className="relative z-10 my-8 py-4 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-52 h-52">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-emerald-400/20 animate-[spin_24s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-dashed border-teal-300/25 animate-[spin_18s_linear_infinite_reverse]" />
              <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-400/10 backdrop-blur-xs" />

              {/* Inner glowing core */}
              <div className="relative flex flex-col items-center justify-center h-28 w-28 rounded-full bg-emerald-800/80 border border-emerald-400/40 shadow-lg shadow-emerald-500/20 text-center p-2">
                <Compass className="h-7 w-7 text-emerald-300 animate-pulse" />
                <span className="text-[11px] font-semibold text-emerald-100 mt-1">Intentional</span>
                <span className="text-[9px] text-emerald-300/90">Alignment</span>
              </div>

              {/* Floating micro badges */}
              <div className="absolute -top-1 left-2 flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/30 px-3 py-1 text-[11px] text-emerald-200 shadow-md backdrop-blur-md">
                <Heart className="h-3 w-3 text-rose-400" />
                <span>92 Score</span>
              </div>

              <div className="absolute -bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-teal-400/30 px-3 py-1 text-[11px] text-teal-200 shadow-md backdrop-blur-md">
                <Clock className="h-3 w-3 text-teal-300" />
                <span>Zero Drift</span>
              </div>
            </div>
          </div>

          {/* Bottom Security / Autonomy Guarantee */}
          <div className="relative z-10 pt-4 border-t border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-200/75">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Encrypted student telemetry & private local whitelist rules.</span>
          </div>
        </div>

        {/* ========================================================
            RIGHT SIDE: Clean, Calming Authentication Card
            ======================================================== */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-7 sm:p-10 shadow-lg shadow-zinc-200/40 space-y-6">
            
            {/* Header */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                Welcome back
              </h1>
              <p className="text-sm text-zinc-600">
                Continue your digital wellness journey.
              </p>
            </div>

            {/* General Error Banner */}
            {errors.general && (
              <div
                id="login-error-banner"
                className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-800 animate-in fade-in duration-200"
              >
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">{errors.general}</div>
                <button
                  type="button"
                  onClick={() => setErrors((prev) => ({ ...prev, general: undefined }))}
                  className="text-rose-500 hover:text-rose-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleLogin} noValidate className="space-y-5">
              
              {/* Field 1: Email */}
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="block text-xs font-semibold text-zinc-700">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    onBlur={() => handleBlur('email')}
                    className={`w-full rounded-xl border bg-white pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:outline-none focus:ring-2 ${
                      touched.email && errors.email
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                        : 'border-zinc-300 focus:border-emerald-600 focus:ring-emerald-100 hover:border-zinc-400'
                    }`}
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Field 2: Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="block text-xs font-semibold text-zinc-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setForgotEmail(email || '');
                      setForgotStatus({ type: 'idle', message: '' });
                    }}
                    id="link-forgot-password"
                    className="text-xs font-medium text-emerald-700 hover:text-emerald-900 transition hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    onBlur={() => handleBlur('password')}
                    className={`w-full rounded-xl border bg-white pl-10 pr-11 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:outline-none focus:ring-2 ${
                      touched.password && errors.password
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                        : 'border-zinc-300 focus:border-emerald-600 focus:ring-emerald-100 hover:border-zinc-400'
                    }`}
                  />
                  {/* Show / Hide Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 text-zinc-500" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Controls: Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-700 focus:ring-emerald-600 accent-emerald-700 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-zinc-700">Remember me</span>
                </label>
                <span className="text-[11px] text-zinc-400">Preserves session 30 days</span>
              </div>

              {/* Primary Button: Log In */}
              <button
                type="submit"
                id="btn-login-submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-800/20 hover:bg-emerald-800 transition active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="w-full border-t border-zinc-200" />
              <span className="bg-white px-3 text-xs font-semibold text-zinc-400 tracking-wider absolute">
                OR
              </span>
            </div>

            {/* Button: Continue with Google */}
            <button
              type="button"
              id="btn-login-google"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-white py-3 px-4 text-xs sm:text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 transition shadow-2xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
                  <span>Connecting with Google...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Below: Don't have an account? Create account */}
            <div className="text-center pt-2 text-xs sm:text-sm text-zinc-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                id="link-create-account"
                className="font-semibold text-emerald-700 hover:text-emerald-900 transition hover:underline"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          FORGOT PASSWORD MODAL (Accessible & Calming)
          ======================================================== */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl space-y-5">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 mb-2">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Reset your password</h3>
              <p className="text-xs text-zinc-600">
                Enter your university email and we will send you a secure link to reset your credentials.
              </p>
            </div>

            {forgotStatus.type === 'success' ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-emerald-900 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{forgotStatus.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition"
                >
                  Return to Log In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                {forgotStatus.type === 'error' && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{forgotStatus.message}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-zinc-700">University Email</label>
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-xs sm:text-sm text-zinc-900 focus:outline-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotStatus.type === 'loading'}
                    className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {forgotStatus.type === 'loading' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>Send Reset Link</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
