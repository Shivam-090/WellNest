export const LEVELS = [
  {
    level: 1,
    name: 'The Seedling',
    emoji: '🌱',
    colorClass: 'from-[#D4EDE4] to-[#B8DDD0] text-[#2A5A48]',
    desc: "You've taken your first step. Complete 1 daily check-in and finish your first relief plan to sprout your seed.",
    reward: '🌸 Blossom Badge',
    xpReward: '+100 XP',
    minXp: 0,
    nextXp: 300,
    requiredStreak: 1
  },
  {
    level: 2,
    name: 'The Sprout',
    emoji: '🌿',
    colorClass: 'from-[#E4DCF5] to-[#D0C4EC] text-[#4A3580]',
    desc: 'Keep your streak for 3 days. Log your mood every morning and complete daily exercises to grow stronger.',
    reward: '💜 Calm Badge',
    xpReward: '+200 XP',
    minXp: 300,
    nextXp: 750,
    requiredStreak: 3
  },
  {
    level: 3,
    name: 'The Blossom',
    emoji: '🌸',
    colorClass: 'from-[#F9E0EC] to-[#F2CDE0] text-[#7A2348]',
    desc: "7-day streak achieved. You're building real habits. Complete the full weekly challenge to blossom into your best self.",
    reward: '🌺 Bloom Badge',
    xpReward: '+350 XP',
    minXp: 750,
    nextXp: 1500,
    requiredStreak: 7
  },
  {
    level: 4,
    name: 'The Sunflower',
    emoji: '🌻',
    colorClass: 'from-[#FFF0CC] to-[#FFE4A0] text-[#7A5A10]',
    desc: '14 days of consistent check-ins. Your mind is finding its rhythm. Complete advanced mindfulness activities to rise tall.',
    reward: '✨ Glow Badge',
    xpReward: '+500 XP',
    minXp: 1500,
    nextXp: 2500,
    requiredStreak: 14
  },
  {
    level: 5,
    name: 'The Forest',
    emoji: '🍃',
    colorClass: 'from-[#D4ECF7] to-[#B8DCEE] text-[#1A5070]',
    desc: "21-day streak. You've built a forest of good habits. Deepen your emotional self-awareness and mindful consistency.",
    reward: '🌿 Sage Badge',
    xpReward: '+750 XP',
    minXp: 2500,
    nextXp: 4000,
    requiredStreak: 21
  },
  {
    level: 6,
    name: 'The Mighty Tree',
    emoji: '🌳',
    colorClass: 'from-[#2A1F4E] to-[#1A3A38] text-white',
    desc: '30-day streak. You have become the tree — rooted, resilient, and radiant. A true WellNest Master Champion. 🏆',
    reward: '🏆 Champion Badge',
    xpReward: '+1000 XP',
    minXp: 4000,
    nextXp: 4000,
    requiredStreak: 30
  }
];

export const BADGES = [
  { id: 'seedling', name: 'Seedling', emoji: '🌱', minLevel: 1, xpRequired: 0 },
  { id: 'calm', name: 'Calm', emoji: '💜', minLevel: 2, xpRequired: 300 },
  { id: 'bloom', name: 'Bloom', emoji: '🌺', minLevel: 3, xpRequired: 750 },
  { id: 'glow', name: 'Glow', emoji: '✨', minLevel: 4, xpRequired: 1500 },
  { id: 'sage', name: 'Sage', emoji: '🌿', minLevel: 5, xpRequired: 2500 },
  { id: 'champion', name: 'Champion', emoji: '🏆', minLevel: 6, xpRequired: 4000 },
];

/**
 * Calculate user level based on both XP and Streak
 */
export function calculateLevel(xp = 0, streak = 1) {
  let lvlByXp = 1;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      lvlByXp = LEVELS[i].level;
      break;
    }
  }

  let lvlByStreak = 1;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (streak >= LEVELS[i].requiredStreak) {
      lvlByStreak = LEVELS[i].level;
      break;
    }
  }

  // Level is the maximum achieved between XP and Streak milestones
  return Math.max(lvlByXp, lvlByStreak);
}

/**
 * Get detailed XP progression metrics for any level & XP amount
 */
export function getXpProgressDetails(xp = 0, level = 1) {
  const currentLvl = LEVELS.find((l) => l.level === level) || LEVELS[0];
  const nextLvl = LEVELS.find((l) => l.level === level + 1) || null;
  const isMaxLevel = !nextLvl;

  const currentTierBaseXp = currentLvl.minXp;
  const nextLevelTargetXp = isMaxLevel ? currentLvl.minXp : nextLvl.minXp;

  const xpInCurrentTier = Math.max(0, xp - currentTierBaseXp);
  const xpNeededForTier = isMaxLevel ? 1 : nextLevelTargetXp - currentTierBaseXp;
  const xpToNextLevel = isMaxLevel ? 0 : Math.max(0, nextLevelTargetXp - xp);

  let progressPct = isMaxLevel
    ? 100
    : Math.min(100, Math.max(4, Math.round((xpInCurrentTier / xpNeededForTier) * 100)));

  return {
    currentLevel: currentLvl.level,
    currentLevelName: currentLvl.name,
    currentLevelEmoji: currentLvl.emoji,
    currentTierBaseXp,
    nextLevelTargetXp,
    xpInCurrentTier,
    xpToNextLevel,
    progressPct,
    isMaxLevel,
    nextLevelName: nextLvl ? nextLvl.name : 'Master Champion',
    nextLevelEmoji: nextLvl ? nextLvl.emoji : '👑',
    nextLevelNumber: nextLvl ? nextLvl.level : 6
  };
}
