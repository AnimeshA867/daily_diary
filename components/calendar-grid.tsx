"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isFuture,
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

  const handleToday = () => {
    setCurrentMonth(new Date());
    onDateSelect?.(format(new Date(), "yyyy-MM-dd"));
  };

  // Calculate entries count for this month
  const entriesThisMonth = days.filter((day) =>
    entryDates.has(format(day, "yyyy-MM-dd"))
  ).length;

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {/* Month Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-semibold text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {entriesThisMonth} {entriesThisMonth === 1 ? "entry" : "entries"}
          </p>
        </div>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div
              key={`${day}-${i}`}
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
            const isFutureDate = isFuture(day) && !isTodayDate;

            return (
              <div key={dateStr} className="relative aspect-square">
                <button
                  onClick={() => !isFutureDate && onDateSelect?.(dateStr)}
                  disabled={isFutureDate}
                  className={`
                    w-full h-full rounded-lg text-xs font-medium transition-all duration-200
                    flex items-center justify-center relative
                    ${!isCurrentMonth && "text-muted-foreground/30"}
                    ${isFutureDate && "opacity-40 cursor-not-allowed"}
                    ${
                      isTodayDate &&
                      !isSelected &&
                      "ring-2 ring-accent ring-inset text-foreground font-semibold"
                    }
                    ${
                      isSelected
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : hasEntry
                        ? "bg-accent/20 text-foreground hover:bg-accent/30"
                        : "text-foreground hover:bg-muted"
                    }
                  `}
                >
                  {format(day, "d")}
                </button>
                {hasEntry && !isSelected && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
                )}
              </div>
            );
          })}
        </div>

        {/* Today Button */}
        <button
          onClick={handleToday}
          className="w-full mt-4 py-2 text-xs font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors"
        >
          Jump to Today
        </button>
      </div>
    </div>
  );
}
