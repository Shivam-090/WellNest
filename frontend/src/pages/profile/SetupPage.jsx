import SetupCard from '../../components/profile/SetupCard';

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d2e] via-[#1a0e3a] to-[#0a1e2e] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Starry Twinkle Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute w-1 h-1 bg-white rounded-full top-[20%] left-[30%] animate-ping" />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-[60%] left-[70%] animate-pulse" />
        <div className="absolute w-1 h-1 bg-white rounded-full top-[40%] left-[10%] animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute w-2 h-2 bg-secondary-light rounded-full top-[80%] left-[50%] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute w-1.5 h-1.5 bg-primary-light rounded-full top-[15%] left-[85%] animate-ping" style={{ animationDelay: '2s' }} />
      </div>

      <SetupCard />
    </div>
  );
}
