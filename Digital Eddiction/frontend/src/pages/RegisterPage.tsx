import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  BookOpen,
  Briefcase,
  Sprout,
  Heart,
  Clock,
  Compass,
  Check,
  X,
} from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { authService } from '../services/auth';

type PrimaryGoal = 'Study' | 'Work' | 'Personal Growth';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile } = useSession();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal>('Study');

  // UI & control states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Errors & validation
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
  }>({});

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-zinc-200', text: 'text-zinc-400' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-teal-500', text: 'text-teal-600' };
      case 4:
      default:
        return { score: 4, label: 'Strong', color: 'bg-emerald-600', text: 'text-emerald-700' };
    }
  };

  const passwordStrength = calculatePasswordStrength(password);

  // Validation function
  const validate = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      general?: string;
    } = {};

    const cleanName = name.trim();
    if (!cleanName) {
      newErrors.name = 'Full name is required.';
    } else if (cleanName.length < 2) {
      newErrors.name = 'Please enter your full name.';
    }

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@university.edu).';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: 'name' | 'email' | 'password' | 'confirmPassword') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  // Submit Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await authService.register({
        name,
        email,
        password,
        primaryGoal,
      });

      if (result.success && result.user) {
        // Sync with Session Context
        updateProfile({
          name: result.user.name,
          email: result.user.email,
        });

        // Store custom goal preference in localStorage
        try {
          localStorage.setItem('mindfulloop_primary_goal', primaryGoal);
        } catch {
          // ignore
        }

        // Navigate to /intention setup as requested
        navigate('/intention');
      } else {
        setErrors({ general: result.error || 'Registration failed. Please try again.' });
      }
    } catch {
      setErrors({ general: 'A network error occurred. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Responsive 2-column Container matching Login Page */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* ========================================================
            LEFT SIDE: Brand, Calming Visual & Wellness Statement
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
                Start your <br />
                <span className="text-emerald-300 font-medium">calmer digital routine.</span>
              </h2>
              <p className="text-sm text-emerald-100/80 leading-relaxed max-w-sm">
                MindfulLoop protects your attention and gives you conscious control over how technology serves your goals.
              </p>
            </div>
          </div>

          {/* Abstract Wellness Visual Graphic */}
          <div className="relative z-10 my-8 py-4 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-52 h-52">
              {/* Outer rotating pulse rings */}
              <div className="absolute inset-0 rounded-full border border-emerald-400/20 animate-[spin_26s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-dashed border-teal-300/25 animate-[spin_20s_linear_infinite_reverse]" />
              <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-400/10 backdrop-blur-xs" />

              {/* Inner glowing core */}
              <div className="relative flex flex-col items-center justify-center h-28 w-28 rounded-full bg-emerald-800/80 border border-emerald-400/40 shadow-lg shadow-emerald-500/20 text-center p-2">
                <Compass className="h-7 w-7 text-emerald-300 animate-pulse" />
                <span className="text-[11px] font-semibold text-emerald-100 mt-1">Focus Flow</span>
                <span className="text-[9px] text-emerald-300/90">Purpose-Driven</span>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-1 right-2 flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/30 px-3 py-1 text-[11px] text-emerald-200 shadow-md backdrop-blur-md">
                <Heart className="h-3 w-3 text-rose-400" />
                <span>Zero Shame</span>
              </div>

              <div className="absolute -bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-teal-400/30 px-3 py-1 text-[11px] text-teal-200 shadow-md backdrop-blur-md">
                <Clock className="h-3 w-3 text-teal-300" />
                <span>Smart Nudges</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Guarantee */}
          <div className="relative z-10 pt-4 border-t border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-200/75">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Autonomous control: Whitelist learning with zero data monetization.</span>
          </div>
        </div>

        {/* ========================================================
            RIGHT SIDE: Registration Form Card
            ======================================================== */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="rounded-3xl border border-zinc-200/90 bg-white p-7 sm:p-10 shadow-lg shadow-zinc-200/40 space-y-6">
            
            {/* Heading & Subtitle */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                Create your MindfulLoop
              </h1>
              <p className="text-sm text-zinc-600">
                Build healthier digital habits, one intention at a time.
              </p>
            </div>

            {/* General Error Banner */}
            {errors.general && (
              <div
                id="register-error-banner"
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

            {/* Registration Form */}
            <form onSubmit={handleRegister} noValidate className="space-y-4">
              
              {/* Field 1: Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="reg-name" className="block text-xs font-semibold text-zinc-700">
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Alex Rivera"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    onBlur={() => handleBlur('name')}
                    className={`w-full rounded-xl border bg-white pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:outline-none focus:ring-2 ${
                      touched.name && errors.name
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                        : 'border-zinc-300 focus:border-emerald-600 focus:ring-emerald-100 hover:border-zinc-400'
                    }`}
                  />
                </div>
                {touched.name && errors.name && (
                  <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Field 2: Email */}
              <div className="space-y-1.5">
                <label htmlFor="reg-email" className="block text-xs font-semibold text-zinc-700">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-email"
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

              {/* Password & Confirm Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Field 3: Password */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-password" className="block text-xs font-semibold text-zinc-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="reg-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      onBlur={() => handleBlur('password')}
                      className={`w-full rounded-xl border bg-white pl-10 pr-10 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:outline-none focus:ring-2 ${
                        touched.password && errors.password
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                          : 'border-zinc-300 focus:border-emerald-600 focus:ring-emerald-100 hover:border-zinc-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Field 4: Confirm Password */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-confirm-password" className="block text-xs font-semibold text-zinc-700">
                    Confirm password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="reg-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                      }}
                      onBlur={() => handleBlur('confirmPassword')}
                      className={`w-full rounded-xl border bg-white pl-10 pr-10 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:outline-none focus:ring-2 ${
                        touched.confirmPassword && errors.confirmPassword
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                          : 'border-zinc-300 focus:border-emerald-600 focus:ring-emerald-100 hover:border-zinc-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.confirmPassword}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500 font-medium">Password strength:</span>
                    <span className={`font-semibold ${passwordStrength.text}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    <div
                      className={`rounded-full transition-all ${
                        passwordStrength.score >= 1 ? passwordStrength.color : 'bg-zinc-200'
                      }`}
                    />
                    <div
                      className={`rounded-full transition-all ${
                        passwordStrength.score >= 2 ? passwordStrength.color : 'bg-zinc-200'
                      }`}
                    />
                    <div
                      className={`rounded-full transition-all ${
                        passwordStrength.score >= 3 ? passwordStrength.color : 'bg-zinc-200'
                      }`}
                    />
                    <div
                      className={`rounded-full transition-all ${
                        passwordStrength.score >= 4 ? passwordStrength.color : 'bg-zinc-200'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Optional Field: Primary Goal */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-zinc-700">
                    Primary goal <span className="text-zinc-400 font-normal">(Optional)</span>
                  </label>
                  <span className="text-[11px] text-zinc-400">Tailors coaching nudges</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {/* Study */}
                  <button
                    type="button"
                    onClick={() => setPrimaryGoal('Study')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition ${
                      primaryGoal === 'Study'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500 shadow-2xs'
                        : 'border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:bg-zinc-100/60'
                    }`}
                  >
                    <BookOpen className={`h-4 w-4 mb-1 ${primaryGoal === 'Study' ? 'text-emerald-700' : 'text-zinc-500'}`} />
                    <span>Study</span>
                  </button>

                  {/* Work */}
                  <button
                    type="button"
                    onClick={() => setPrimaryGoal('Work')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition ${
                      primaryGoal === 'Work'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500 shadow-2xs'
                        : 'border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:bg-zinc-100/60'
                    }`}
                  >
                    <Briefcase className={`h-4 w-4 mb-1 ${primaryGoal === 'Work' ? 'text-emerald-700' : 'text-zinc-500'}`} />
                    <span>Work</span>
                  </button>

                  {/* Personal Growth */}
                  <button
                    type="button"
                    onClick={() => setPrimaryGoal('Personal Growth')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition ${
                      primaryGoal === 'Personal Growth'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500 shadow-2xs'
                        : 'border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:bg-zinc-100/60'
                    }`}
                  >
                    <Sprout className={`h-4 w-4 mb-1 ${primaryGoal === 'Personal Growth' ? 'text-emerald-700' : 'text-zinc-500'}`} />
                    <span>Personal Growth</span>
                  </button>
                </div>
              </div>

              {/* Primary Button: Create Account */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="btn-register-submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-800/20 hover:bg-emerald-800 transition active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>Creating your MindfulLoop...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Below: Already have an account? Log in */}
            <div className="text-center pt-1 text-xs sm:text-sm text-zinc-600">
              Already have an account?{' '}
              <Link
                to="/login"
                id="link-login-account"
                className="font-semibold text-emerald-700 hover:text-emerald-900 transition hover:underline"
              >
                Log in
              </Link>
            </div>

            {/* Privacy Message */}
            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 flex items-start gap-2.5 text-xs text-zinc-600">
              <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px] sm:text-xs">
                Your data should remain under your control. MindfulLoop is designed around purposeful and privacy-conscious tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
