"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarGridProps {
  entryDates: Set<string>;
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
}

export default function CalendarGrid({
  entryDates,
  selectedDate,
  onDateSelect,
}: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad with previous month's days
  const paddingDays = Array(monthStart.getDay()).fill(null);

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={handlePreviousMonth}
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-xs font-medium text-muted-foreground text-center py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {paddingDays.map((_, i) => (
          <div key={`padding-${i}`} className="aspect-square" />
        ))}
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const hasEntry = entryDates.has(dateStr);
          const isTodayDate = isToday(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate === dateStr;

          return (
            <div key={dateStr} className="relative aspect-square">
              <button
                onClick={() => onDateSelect?.(dateStr)}
                className={`
                  w-full h-full rounded text-xs font-medium transition-colors
                  flex items-center justify-center
                  ${!isCurrentMonth && "text-muted-foreground/30"}
                  ${
                    isTodayDate &&
                    !isSelected &&
                    "border-2 border-accent text-foreground"
                  }
                  ${
                    isSelected &&
                    "bg-accent text-accent-foreground border-2 border-accent"
                  }
                  ${
                    !isTodayDate &&
                    !isSelected &&
                    isCurrentMonth &&
                    "text-foreground hover:bg-muted"
                  }
                  ${!isCurrentMonth && !isTodayDate && !isSelected && ""}
                `}
              >
                {format(day, "d")}
              </button>
              {hasEntry && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
