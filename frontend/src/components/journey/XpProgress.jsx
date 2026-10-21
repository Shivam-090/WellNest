import { useState } from 'react';
import { useWellness } from '../../contexts/WellnessContext';
import { LEVELS, BADGES } from '../../data/levelsData';
import { Sparkles, Trophy, ChevronDown, ChevronUp, Lock, CheckCircle2, Flame, Award } from 'lucide-react';

export default function XpProgress() {
  const { xp, level, streak, xpDetails } = useWellness();
  const [showAllTiers, setShowAllTiers] = useState(false);

  const {
    currentLevelName,
    currentLevelEmoji,
    nextLevelTargetXp,
    xpToNextLevel,
    progressPct,
    isMaxLevel,
    nextLevelName,
    nextLevelEmoji,
    nextLevelNumber
  } = xpDetails;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#1c1335] via-[#1b263b] to-[#122822] p-6 sm:p-10 text-white shadow-2xl border border-white/15 relative overflow-hidden space-y-8">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Main Progress Track */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="flex-1 w-full space-y-3">
          {/* Header pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-white/10 border border-white/15 text-primary-light">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>XP Level Progression</span>
          </div>

          {/* Level Transition Title */}
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white flex flex-wrap items-center gap-2.5">
            <span>{currentLevelEmoji} Lv.{level} ({currentLevelName})</span>
            {!isMaxLevel && (
              <>
                <span className="text-white/40 font-sans text-xl">→</span>
                <span className="text-primary-light">{nextLevelEmoji} Lv.{nextLevelNumber} ({nextLevelName})</span>
              </>
            )}
          </h3>

          {/* XP details description */}
          <p className="text-xs sm:text-sm text-white/80 font-sans leading-relaxed">
            {isMaxLevel ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Trophy className="w-4 h-4" /> You have achieved Master Level Champion with {xp} total XP!
              </span>
            ) : (
              <>
                <strong className="text-white font-bold">{xp} XP</strong> / <strong className="text-white font-bold">{nextLevelTargetXp} XP</strong> target —{' '}
                <span className="text-secondary font-bold">
                  {xpToNextLevel} more XP needed
                </span>{' '}
                to unlock {nextLevelName}.
              </>
            )}
          </p>

          {/* Progress Track */}
          <div className="space-y-1.5 pt-2">
            <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-secondary via-teal-400 to-primary-light shadow-lg transition-all duration-1000 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-bold text-white/60 tracking-wider">
              <span>{xp} XP Earned</span>
              <span>{progressPct}% to Lv.{nextLevelNumber}</span>
              <span>{nextLevelTargetXp} XP Target</span>
            </div>
          </div>
        </div>

        {/* Right Quick Level Status Card */}
        <div className="w-full lg:w-auto bg-white/10 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-white/15 shrink-0 flex items-center gap-4 justify-between lg:justify-start">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-3xl shadow-lg ring-2 ring-white/20">
            {currentLevelEmoji}
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-white/50">
              Active Tier
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-white">
              Level {level}
            </div>
            <div className="text-xs text-primary-light font-bold">
              {currentLevelName}
            </div>
          </div>
        </div>
      </div>

      {/* Badges Overview Grid */}
      <div className="relative z-10 space-y-3 pt-4 border-t border-white/15">
        <div className="flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-widest font-extrabold text-white/50 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-secondary" />
            <span>Milestone Badges & Requirements</span>
          </div>

          <button
            onClick={() => setShowAllTiers(!showAllTiers)}
            className="text-xs font-bold text-primary-light hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{showAllTiers ? 'Hide All Levels' : 'View Level XP Matrix'}</span>
            {showAllTiers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Badge Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BADGES.map((b) => {
            const isEarned = level >= b.minLevel;
            return (
              <div
                key={b.id}
                className={`rounded-2xl p-3.5 text-center border transition-all duration-300 relative select-none ${
                  isEarned
                    ? 'bg-white/15 border-secondary/60 shadow-md shadow-secondary/10 scale-[1.02]'
                    : 'bg-white/5 border-white/10 opacity-40 grayscale'
                }`}
              >
                <div className="text-3xl mb-1.5">{b.emoji}</div>
                <div className="text-xs font-bold text-white mb-0.5">{b.name}</div>
                <div className="text-[10px] font-semibold text-white/60">
                  {b.xpRequired > 0 ? `${b.xpRequired} XP` : 'Starter'}
                </div>
                <div className="mt-2 text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full inline-block bg-white/10 text-white/80">
                  {isEarned ? 'Unlocked' : `Lv.${b.minLevel}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expandable Detailed Level Requirements Matrix */}
      {showAllTiers && (
        <div className="relative z-10 pt-4 border-t border-white/15 space-y-3 animate-fade-in">
          <div className="text-xs font-bold text-white/70 uppercase tracking-wider">
            Comprehensive Level Progression Table
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {LEVELS.map((lvl) => {
              const isPassed = level > lvl.level;
              const isCurrent = level === lvl.level;
              const isUpcoming = level < lvl.level;

              return (
                <div
                  key={lvl.level}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-primary/20 border-primary-light ring-2 ring-primary-light/40'
                      : isPassed
                      ? 'bg-white/10 border-emerald-500/40'
                      : 'bg-white/5 border-white/10 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{lvl.emoji}</span>
                      <div>
                        <div className="text-xs font-bold text-white">
                          Lv.{lvl.level} — {lvl.name}
                        </div>
                        <div className="text-[10px] text-white/50 flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 text-orange-400 fill-orange-400" />
                          <span>Streak Day {lvl.requiredStreak}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {isCurrent ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-light text-[#1b263b]">
                          Current
                        </span>
                      ) : isPassed ? (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-white/40 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-white/80 font-semibold space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white/50">Required XP:</span>
                      <span className="text-white font-bold">{lvl.minXp} XP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Level Reward:</span>
                      <span className="text-secondary font-bold">{lvl.reward} ({lvl.xpReward})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
