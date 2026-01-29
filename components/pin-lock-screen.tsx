"use client";

import { useState, useRef, useEffect } from "react";
import { Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { verifyPin, setPinSession } from "@/lib/pin";

interface PinLockScreenProps {
  userId: string;
  onUnlock: () => void;
}

export default function PinLockScreen({ userId, onUnlock }: PinLockScreenProps) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError(null);

    // Auto-advance to next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (value && index === 3 && newPin.every((d) => d !== "")) {
      handleVerify(newPin.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (/^\d{4}$/.test(pastedData)) {
      const newPin = pastedData.split("");
      setPin(newPin);
      inputRefs.current[3]?.focus();
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (pinStr: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      const isValid = await verifyPin(userId, pinStr);
      if (isValid) {
        setPinSession();
        onUnlock();
      } else {
        setError("Incorrect PIN. Please try again.");
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setPin(["", "", "", ""]);
          inputRefs.current[0]?.focus();
        }, 500);
      }
    } catch (err) {
      console.error("PIN verification error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your 4-digit PIN to access your diary
          </p>
        </div>

        {/* PIN Input */}
        <div
          className={`flex justify-center gap-3 mb-6 transition-transform ${
            shake ? "animate-shake" : ""
          }`}
        >
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type={showPin ? "text" : "password"}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isVerifying}
              className={`
                w-14 h-14 text-center text-2xl font-semibold
                bg-surface border-2 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
                transition-all duration-200
                ${error ? "border-destructive" : "border-border"}
                ${isVerifying ? "opacity-50" : ""}
              `}
            />
          ))}
        </div>

        {/* Show/Hide PIN */}
        <button
          type="button"
          onClick={() => setShowPin(!showPin)}
          className="flex items-center gap-2 mx-auto mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPin ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide PIN
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show PIN
            </>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 justify-center text-destructive text-sm mb-6">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {isVerifying && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            Verifying...
          </div>
        )}

        {/* Hint */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Forgot your PIN? You can reset it from account settings after
          signing in again.
        </p>
      </div>
    </div>
  );
}
