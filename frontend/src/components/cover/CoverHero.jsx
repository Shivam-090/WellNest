import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ArrowRight, Sparkles, Shield } from 'lucide-react';

export default function CoverHero() {
  const { isAuthenticated } = useAuth();
  const { burstPetals } = useTheme();
  const navigate = useNavigate();

  const handleStart = () => {
    burstPetals();
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 py-12">
      {/* Background Radial Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(78,180,150,0.14),transparent)] -top-20 -left-20 animate-orb-float" />
        <div className="absolute w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(126,206,202,0.12),transparent)] -bottom-20 -right-20 animate-orb-float" style={{ animationDelay: '2s' }} />
        <div className="absolute w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(155,134,204,0.1),transparent)] top-1/3 right-1/4 animate-orb-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl text-center flex flex-col items-center animate-fade-in">
        {/* Animated Brand Emblem */}
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-secondary/20 via-primary/30 to-accent/20 border border-white/20 p-6 flex items-center justify-center mb-8 shadow-2xl animate-logo-drift filter drop-shadow-[0_0_40px_rgba(78,180,150,0.45)]">
          <span className="text-6xl sm:text-7xl select-none">🌸</span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-5xl sm:text-7xl font-bold tracking-tight text-white mb-3">
          WellNest <span className="text-secondary italic">AI</span>
        </h1>

        {/* Tagline */}
        <div className="text-xs sm:text-sm text-white/50 tracking-[3px] sm:tracking-[4px] uppercase font-bold mb-4 font-sans">
          Student Stress &amp; Wellness Solution
        </div>

        {/* Gradient Divider */}
        <div className="w-16 h-1 bg-gradient-to-r from-secondary to-primary rounded-full mb-6" />

        {/* Description */}
        <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-lg mb-10 font-sans">
          Your personal AI companion for stress detection and mental wellness — gentle check-ins, personalized relief, and a journey to bloom.
        </p>

        {/* Action Button */}
        <button
          onClick={handleStart}
          className="py-4 px-10 sm:px-14 rounded-full bg-gradient-to-r from-[#4EB694] to-secondary text-[#0a1f18] font-sans font-extrabold text-base sm:text-lg shadow-[0_12px_40px_rgba(78,182,148,0.45)] hover:shadow-[0_20px_50px_rgba(78,182,148,0.65)] hover:-translate-y-1 hover:scale-103 active:translate-y-0 transition-all duration-200 flex items-center gap-3 cursor-pointer"
        >
          <span>🌿 Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Subtitle Hint */}
        <div className="mt-5 text-xs text-white/35 tracking-wider flex items-center gap-2">
          <Shield className="w-3.5 h-3.5" />
          <span>Takes just 3 minutes · Private &amp; Secure · Free</span>
        </div>
      </div>
    </div>
  );
}
