import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { User, Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const { burstPetals } = useTheme();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      errs.name = 'Please provide your name or nickname.';
    } else if (cleanName.length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    } else if (cleanName.length > 50) {
      errs.name = 'Name cannot exceed 50 characters.';
    }

    if (!cleanEmail) {
      errs.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(cleanEmail)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters long.';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
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
      const res = await signup(name.trim(), email.trim(), password);
      if (res?.success || res?.token) {
        burstPetals();
        navigate('/setup');
      } else {
        setGeneralError(res?.message || 'Signup failed. Please try again with a different email.');
      }
    } catch {
      setGeneralError('Signup failed. Please try again with a different email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface-card glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-surface-border animate-fade-in">
      {/* Header */}
      <div className="text-center mb-7">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary-light flex items-center justify-center text-3xl mx-auto mb-4 shadow-md">
          ✨
        </div>
        <h2 className="font-serif text-3xl font-bold text-text-primary tracking-tight">
          Join WellNest AI
        </h2>
        <p className="text-sm text-text-secondary mt-1 font-sans">
          Begin your gentle path towards mental wellness and calm
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
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        {/* Name Field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
            Your Name / Nickname *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="e.g. StarGazer, Luna..."
              maxLength={50}
              className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-surface-input border text-text-primary text-sm focus:outline-none focus:ring-2 font-sans transition-all ${
                errors.name
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-surface-border focus:ring-primary'
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-[11px] font-semibold text-red-500 mt-1 ml-2 animate-fade-in">
              {errors.name}
            </p>
          )}
        </div>

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
              className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-surface-input border text-text-primary text-sm focus:outline-none focus:ring-2 font-sans transition-all ${
                errors.email
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-surface-border focus:ring-primary'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] font-semibold text-red-500 mt-1 ml-2 animate-fade-in">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
            Password (min 6 chars) *
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
              placeholder="At least 6 characters"
              className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-surface-input border text-text-primary text-sm focus:outline-none focus:ring-2 font-sans transition-all ${
                errors.password
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-surface-border focus:ring-primary'
              }`}
            />
          </div>
          {errors.password && (
            <p className="text-[11px] font-semibold text-red-500 mt-1 ml-2 animate-fade-in">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
            Confirm Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              placeholder="Re-enter password"
              className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-surface-input border text-text-primary text-sm focus:outline-none focus:ring-2 font-sans transition-all ${
                errors.confirmPassword
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-surface-border focus:ring-primary'
              }`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] font-semibold text-red-500 mt-1 ml-2 animate-fade-in">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-3.5 px-6 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="text-center mt-6 pt-4 border-t border-surface-border/60">
        <p className="text-xs text-text-secondary">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary hover:text-primary-deep font-bold underline ml-1"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
