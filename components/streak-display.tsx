"use client";

import { Flame, Trophy, Target, Sparkles } from "lucide-react";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  totalEntries?: number;
  streakActive?: boolean;
  todayEntry?:boolean;
}

function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your journey today!";
  if (streak === 1) return "Great start! Keep it up!";
  if (streak < 7) return "Building momentum!";
  if (streak < 14) return "One week strong!";
  if (streak < 30) return "You're on fire!";
  if (streak < 60) return "A month of consistency!";
  if (streak < 100) return "Incredible dedication!";
  return "Legendary writer!";
}

function getStreakEmoji(streak: number): string {
  if (streak === 0) return "✨";
  if (streak < 3) return "🌱";
  if (streak < 7) return "🔥";
  if (streak < 14) return "⚡";
  if (streak < 30) return "🚀";
  if (streak < 60) return "💎";
  if (streak < 100) return "👑";
  return "🏆";
}

export default function StreakDisplay({
  currentStreak,
  longestStreak,
  totalEntries = 0,
  streakActive = false,
  todayEntry=false
}: StreakDisplayProps) {
  const isNewRecord = currentStreak > 0 && currentStreak >= longestStreak;

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {/* Main Streak Display */}
      <div className="p-6 text-center relative overflow-hidden">
        {/* Background glow effect */}
        {streakActive && currentStreak > 0 && (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5" />
        )}

        {/* Streak Icon */}
        <div
          className={`
            w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center
            transition-all duration-300
            ${
              streakActive && currentStreak > 0
                ? "bg-gradient-to-br from-orange-500/20 to-amber-500/20"
                : "bg-muted"
            }
          `}
        >
          <Flame
            className={`
              w-8 h-8 transition-all duration-300
              ${
                streakActive && currentStreak > 0
                  ? "text-orange-500"
                  : "text-muted-foreground"
              }
              ${streakActive && currentStreak > 0 ? "animate-pulse" : ""}
            `}
          />
        </div>

        {/* Current Streak Number */}
        <div className="relative">
          <p
            className={`
              text-5xl font-bold tracking-tight transition-all duration-300
              ${
                streakActive && currentStreak > 0
                  ? "text-foreground"
                  : "text-muted-foreground"
              }
            `}
          >
            {currentStreak}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            day{currentStreak !== 1 ? "s" : ""} streak
          </p>
        </div>

        {/* Motivational Message */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-lg">{getStreakEmoji(currentStreak)}</span>
          <p className="text-sm font-medium text-muted-foreground">
            {getStreakMessage(currentStreak)}
          </p>
        </div>

        {/* New Record Badge */}
        {isNewRecord && currentStreak > 1 && (
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full text-amber-600 dark:text-amber-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            New Personal Best!
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 border-t border-border">
        <div className="p-4 text-center border-r border-border">
          <div className="flex items-center justify-center gap-1.5 text-orange-500 mb-1">
            <Trophy className="w-4 h-4" />
          </div>
          <p className="text-2xl font-semibold text-foreground">
            {longestStreak}
          </p>
          <p className="text-xs text-muted-foreground">Best Streak</p>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-blue-500 mb-1">
            <Target className="w-4 h-4" />
          </div>
          <p className="text-2xl font-semibold text-foreground">{totalEntries}</p>
          <p className="text-xs text-muted-foreground">Total Entries</p>
        </div>
      </div>

      {/* Status Bar */}
      <div
        className={`
          px-4 py-2.5 text-center text-xs font-medium
          ${
            streakActive
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          }
        `}
      >
        {streakActive && todayEntry
          ? "✓ You've written today!"
          : currentStreak > 0
          ? "⏰ Write today to keep your streak!"
          : "📝 Start journaling to build your streak"}
      </div>
    </div>
  );
}
