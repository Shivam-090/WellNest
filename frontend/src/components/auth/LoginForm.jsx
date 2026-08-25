import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { burstPetals } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    const errs = {};
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      errs.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(cleanEmail)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = await login(email.trim(), password);
      if (res?.success || res?.token) {
        burstPetals();
        const destination = location.state?.from || '/home';
        navigate(destination, { replace: true });
      } else {
        setGeneralError(res?.message || 'Invalid email or password. Please try again.');
      }
    } catch {
      setGeneralError('Invalid login credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setGeneralError('');
    setErrors({});
    try {
      await login('hero@wellnest.ai', 'demo123');
      burstPetals();
      const destination = location.state?.from || '/home';
      navigate(destination, { replace: true });
    } catch {
      setGeneralError('Failed to login with demo account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface-card glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-surface-border animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary-light flex items-center justify-center text-3xl mx-auto mb-4 shadow-md">
          🌸
        </div>
        <h2 className="font-serif text-3xl font-bold text-text-primary tracking-tight">
          Welcome Back
        </h2>
        <p className="text-sm text-text-secondary mt-1.5 font-sans">
          Log in to continue your personal wellness journey
        </p>
      </div>

      {/* General Error notification */}
      {generalError && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-500 flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
            Email Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="you@example.com"
              className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-surface-input border text-text-primary text-sm focus:outline-none focus:ring-2 font-sans transition-all ${
                errors.email
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-surface-border focus:ring-primary'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] font-semibold text-red-500 mt-1.5 ml-2 animate-fade-in">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
            Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-surface-input border text-text-primary text-sm focus:outline-none focus:ring-2 font-sans transition-all ${
                errors.password
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-surface-border focus:ring-primary'
              }`}
            />
          </div>
          {errors.password && (
            <p className="text-[11px] font-semibold text-red-500 mt-1.5 ml-2 animate-fade-in">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* One-click Demo Button */}
      <div className="mt-4">
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-full bg-primary-soft text-primary hover:bg-primary-soft/80 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-primary-light/40 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Demo Login (One-click)</span>
        </button>
      </div>

      {/* Footer Link */}
      <div className="text-center mt-6 pt-5 border-t border-surface-border/60">
        <p className="text-xs text-text-secondary">
          Don't have an account yet?{' '}
          <Link
            to="/signup"
            className="text-primary hover:text-primary-deep font-bold underline ml-1"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
