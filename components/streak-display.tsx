interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
}

export default function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Current Streak</p>
        <p className="text-4xl font-semibold text-foreground">{currentStreak}</p>
        <p className="text-xs text-muted-foreground mt-1">days</p>
      </div>

      <div className="h-px bg-border" />

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Best Streak</p>
        <p className="text-3xl font-semibold text-foreground">{longestStreak}</p>
        <p className="text-xs text-muted-foreground mt-1">days</p>
      </div>
    </div>
  )
}
