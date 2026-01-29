"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { clearPinSession } from "@/lib/pin";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Flame,
} from "lucide-react";

interface UserHeaderProps {
  user: {
    email?: string;
    id: string;
  };
  displayName?: string | null;
  currentStreak?: number;
  streakActive?: boolean;
}

export default function UserHeader({
  user,
  displayName,
  currentStreak = 0,
  streakActive = false,
}: UserHeaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    clearPinSession();
    
    const supabase = createClient();
    await supabase.auth.signOut();
    
    // Force a hard navigation to clear all state
    window.location.href = "/auth/login";
  };

  const userName = displayName || user.email?.split("@")[0] || "User";

  return (
    <header className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo & Date */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-foreground leading-tight">
                  Daily Diary
                </h1>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(), "EEE, MMM d")}
                </p>
              </div>
            </div>

            {/* Mobile date */}
            <div className="sm:hidden">
              <p className="text-sm font-medium text-foreground">
                {format(new Date(), "EEE, MMM d")}
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Streak Badge */}
            {currentStreak > 0 && (
              <div
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-300
                  ${
                    streakActive
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400"
                      : "bg-muted text-muted-foreground"
                  }
                `}
              >
                <Flame
                  className={`w-4 h-4 ${
                    streakActive ? "text-orange-500 animate-pulse" : ""
                  }`}
                />
                <span>{currentStreak}</span>
              </div>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-accent" />
                </div>
                <span className="hidden md:block text-sm font-medium text-foreground max-w-[120px] truncate">
                  {userName}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-lg py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        router.push("/account");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      Account Settings
                    </button>
                  </div>

                  <div className="border-t border-border pt-1">
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}
                      disabled={isLoading}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {isLoading ? "Signing out..." : "Sign Out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
