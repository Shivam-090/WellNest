import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, LogIn, Sparkles } from 'lucide-react';

export default function SessionExpiredModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthExpired = () => {
      setIsOpen(true);
      setCountdown(5);
    };

    window.addEventListener('wellnest:auth_expired', handleAuthExpired);
    return () => {
      window.removeEventListener('wellnest:auth_expired', handleAuthExpired);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (countdown <= 0) {
      handleRedirectToLogin();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, countdown]);

  const handleRedirectToLogin = () => {
    setIsOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-surface-card glass-panel border border-surface-border rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-scale-in">
        {/* Animated Lock Icon */}
        <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-secondary/30 to-primary/30 border border-primary/40 flex items-center justify-center text-primary shadow-inner">
          <Lock className="w-8 h-8 animate-pulse" />
        </div>

        {/* Header Titles */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-extrabold text-secondary px-3 py-1 rounded-full bg-secondary/15 border border-secondary/25">
            <Sparkles className="w-3 h-3" />
            <span>Authorization Notice</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-text-primary">
            Session Expired
          </h3>
        </div>

        {/* Explanatory Description */}
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans px-2">
          Your secure authentication token has expired. To protect your mental wellness data and privacy, please log in again to continue.
        </p>

        {/* Countdown Progress */}
        <div className="space-y-1.5 py-1">
          <div className="text-[11px] font-semibold text-text-secondary">
            Redirecting to login in <span className="text-primary font-bold">{countdown}s</span>...
          </div>
          <div className="w-full h-1.5 bg-surface-input rounded-full overflow-hidden border border-surface-border/50">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${(countdown / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleRedirectToLogin}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>Go to Login Now</span>
        </button>
      </div>
    </div>
  );
}
