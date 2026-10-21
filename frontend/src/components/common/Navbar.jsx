import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useWellness } from '../../contexts/WellnessContext';
import { 
  Sparkles, 
  Menu, 
  X, 
  Home, 
  ClipboardCheck, 
  HeartHandshake, 
  Compass, 
  MessageCircle, 
  LogIn 
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const { openProfile, burstPetals } = useTheme();
  const { character, nickname, level } = useWellness();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Check-in', path: '/checkin', icon: ClipboardCheck },
    { name: 'Daily Tasks', path: '/activity', icon: HeartHandshake },
    { name: 'My Journey', path: '/journey', icon: Compass },
    { name: 'AI Chat', path: '/chat', icon: MessageCircle, badge: 'AI' },
  ];

  const handleNavClick = (path) => {
    burstPetals();
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleDailyTasksCTA = () => {
    burstPetals();
    setMobileMenuOpen(false);
    navigate('/activity');
  };

  const handleProfileOpenFromMobile = () => {
    setMobileMenuOpen(false);
    openProfile();
  };

  return (
    <>
      <nav className="sticky top-0 z-50 glass-nav px-4 sm:px-8 md:px-12 py-3.5 flex items-center justify-between transition-colors duration-300 border-b border-surface-border">
        {/* Brand Logo */}
        <Link
          to="/home"
          onClick={() => burstPetals()}
          className="flex items-center gap-2.5 font-serif text-xl sm:text-2xl font-bold tracking-tight text-text-primary hover:opacity-90 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-lg shadow-sm">
            🌸
          </div>
          <span>
            Well<span className="text-primary font-serif">Nest</span>{' '}
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-secondary bg-surface-chip border border-surface-border px-1.5 py-0.5 rounded-md ml-1 shadow-2xs">
              AI
            </span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-7 text-sm font-semibold">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.name}>
                <button
                  onClick={() => handleNavClick(link.path)}
                  className={`transition-all duration-200 cursor-pointer font-sans relative flex items-center gap-1.5 pb-1 ${
                    isActive
                      ? 'text-primary font-bold border-b-2 border-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[9px] font-extrabold uppercase bg-secondary/20 text-secondary px-1.5 py-0.5 rounded-full border border-secondary/30">
                      {link.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Action CTA & Profile Corner */}
        <div className="flex items-center gap-3">
          {/* Check-in button next to profile: opens Daily Tasks / Relief page */}
          <button
            onClick={handleDailyTasksCTA}
            className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-primary to-secondary text-white font-sans font-bold text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            title="Open Daily Tasks & Activities"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Tasks</span>
          </button>

          {/* Profile Avatar trigger */}
          {isAuthenticated ? (
            <button
              onClick={openProfile}
              className="flex items-center gap-2 bg-surface-card hover:bg-surface border border-surface-border px-3 py-1.5 rounded-full shadow-sm hover:scale-105 transition-all duration-200 cursor-pointer"
              title="Open Profile & Settings"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm shadow-inner shrink-0">
                {user?.character || character}
              </div>
              <span className="text-xs font-bold text-text-primary max-w-[90px] truncate hidden sm:inline">
                {user?.name || nickname}
              </span>
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-text-primary hover:text-primary bg-surface-chip border border-surface-border px-3.5 py-2 rounded-full transition-colors shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5 text-primary" />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-card transition-colors cursor-pointer"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* ── Mobile Sliding Sidebar (Right Drawer) ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] md:hidden flex justify-end animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
        >
          <div className="w-4/5 max-w-xs bg-surface-card glass-panel h-full shadow-2xl flex flex-col justify-between p-6 animate-slide-in-right border-l border-surface-border">
            {/* Drawer Top */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-6">
                <div className="flex items-center gap-2 font-serif text-lg font-bold text-text-primary">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-secondary to-primary-light flex items-center justify-center text-base">
                    🌸
                  </div>
                  <span>
                    Well<span className="text-primary font-serif">Nest</span> AI
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-surface-input text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links in Sidebar */}
              <div className="space-y-1.5">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.path)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md font-bold'
                          : 'text-text-primary hover:bg-surface/80 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{link.name}</span>
                      </div>
                      {link.badge && (
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-secondary/20 text-secondary border border-secondary/30'
                        }`}>
                          {link.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Daily Tasks Shortcut Button */}
              <div className="mt-5">
                <button
                  onClick={handleDailyTasksCTA}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open Daily Tasks</span>
                </button>
              </div>
            </div>

            {/* Profile Section Pinned at Bottom of Sidebar */}
            <div className="pt-4 border-t border-surface-border">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <button
                    onClick={handleProfileOpenFromMobile}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface-card border border-surface-border hover:border-primary transition-all cursor-pointer text-left"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl shadow-inner shrink-0">
                      {user?.character || character}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-sm text-text-primary truncate">
                        {user?.name || nickname}
                      </div>
                      <div className="text-[11px] text-text-secondary truncate">
                        Lv.{user?.level || level} · Profile Settings
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In / Sign Up</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
