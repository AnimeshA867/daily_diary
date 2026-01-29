"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { format } from "date-fns";
import {
  getUserSettings,
  setUserPin,
  disablePin,
  updateDisplayName,
  clearPinSession,
  type UserSettings,
} from "@/lib/pin";
import { getStreakData, type StreakData } from "@/lib/streak";
import {
  User,
  Lock,
  Unlock,
  Shield,
  ArrowLeft,
  Check,
  AlertCircle,
  Flame,
  Calendar,
  FileText,
  Eye,
  EyeOff,
  LogOut,
  LoaderIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
    const [password,setPassword]= useState("");
    const [passwordChangeError,setPasswordChangeError]= useState<string | null>(null);
    const [passwordVisible,setPasswordVisible]= useState(false);
    const [passwordCheckStatus,setPasswordCheckStatus]= useState<"idle" | "checking" | "success" | "error">("idle");
  // Display name
  
  const [displayName, setDisplayName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  // PIN setup
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [pinStep, setPinStep] = useState<"enter" | "confirm">("enter");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isSavingPin, setIsSavingPin] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmPinInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Disable PIN
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        // Protected layout handles redirect
        return;
      }

      setUser(currentUser);

      // Load settings (may return null if table doesn't exist)
      try {
        const userSettings = await getUserSettings(currentUser.id);
        setSettings(userSettings);
        if (userSettings?.display_name) {
          setDisplayName(userSettings.display_name);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }

      // Load streak data
      try {
        const streak = await getStreakData(currentUser.id);
        setStreakData(streak);
      } catch (err) {
        console.error("Failed to load streak:", err);
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleSaveDisplayName = async () => {
    if (!user) return;
    setIsSavingName(true);

    const success = await updateDisplayName(user.id, displayName);
    if (success) {
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    }

    setIsSavingName(false);
  };

  const handlePinInputChange = (
    index: number,
    value: string,
    isConfirm: boolean
  ) => {
    if (value && !/^\d$/.test(value)) return;

    const setter = isConfirm ? setConfirmPin : setNewPin;
    const current = isConfirm ? confirmPin : newPin;
    const refs = isConfirm ? confirmPinInputRefs : pinInputRefs;

    const updated = [...current];
    updated[index] = value;
    setter(updated);
    setPinError(null);

    if (value && index < 3) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (
    index: number,
    e: React.KeyboardEvent,
    isConfirm: boolean
  ) => {
    const current = isConfirm ? confirmPin : newPin;
    const refs = isConfirm ? confirmPinInputRefs : pinInputRefs;

    if (e.key === "Backspace" && !current[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleSetupPin = async () => {
    if (pinStep === "enter") {
      if (newPin.some((d) => d === "")) {
        setPinError("Please enter all 4 digits");
        return;
      }
      setPinStep("confirm");
      setTimeout(() => confirmPinInputRefs.current[0]?.focus(), 100);
      return;
    }

    // Confirm step
    if (confirmPin.some((d) => d === "")) {
      setPinError("Please confirm all 4 digits");
      return;
    }

    if (newPin.join("") !== confirmPin.join("")) {
      setPinError("PINs do not match. Please try again.");
      setConfirmPin(["", "", "", ""]);
      setTimeout(() => confirmPinInputRefs.current[0]?.focus(), 100);
      return;
    }

    if (!user) return;

    setIsSavingPin(true);
    const success = await setUserPin(user.id, newPin.join(""));

    if (success) {
      setSettings((s) => (s ? { ...s, pin_enabled: true } : s));
      setShowPinSetup(false);
      setNewPin(["", "", "", ""]);
      setConfirmPin(["", "", "", ""]);
      setPinStep("enter");
    } else {
      setPinError("Failed to save PIN. Please try again.");
    }

    setIsSavingPin(false);
  };

  const handleDisablePin = async () => {
    if (!user) return;
    setIsDisabling(true);

    const success = await disablePin(user.id);
    if (success) {
      setSettings((s) => (s ? { ...s, pin_enabled: false, pin_hash: null } : s));
    }

    setIsDisabling(false);
    setShowDisableConfirm(false);
  };

  const handleLogout = async () => {
    clearPinSession();
    const supabase = createClient();
    await supabase.auth.signOut();
    
    // Force a hard navigation to clear all state
    window.location.href = "/auth/login";
  };

  const handlePasswordChange=async(action: "check"|"change")=>{
    const supabase = createClient();

    switch(action){
        case "check":
            setPasswordCheckStatus("checking");
            const { data ,error  } = await supabase.auth.signInWithPassword({
    email: user?.email || "",
    password:password
  })

    if(error){
        setPasswordCheckStatus("error");
        setPasswordChangeError("Incorrect Password");
        return;
    }
    setPasswordCheckStatus("success");
            break;
        case "change":
            const passwordChange = await supabase.auth.updateUser({
                password: password
            });
            if(passwordChange.error){
                setPasswordCheckStatus("error");
                setPasswordChangeError(passwordChange.error.message);
                return;
            }
            setPasswordCheckStatus("success");
            setPassword("");
            break;
    }
     

    
    
  }

  

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 py-4 md:px-6">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push("/diary")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Back to diary"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Account</h1>
            <p className="text-xs text-muted-foreground">
              Manage your profile and security
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 py-8 md:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Section */}
          <section className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Profile</h2>
                <p className="text-xs text-muted-foreground">
                  Your personal information
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <div className="px-4 py-2.5 bg-muted/50 rounded-lg text-foreground text-sm">
                  {user.email}
                </div>
              </div>
               <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Password
                </label>
                <div className=" rounded-lg text-foreground text-sm flex justify-between flex-col ">
                    
                  <input placeholder="Enter your Current Password" id="password" type="password" onKeyDown={(e)=>{
                    if(e.key==="Enter"){
                        handlePasswordChange("check");
                    }
                  }} onChange={(e)=>setPassword(e.target.value)} className={` ${passwordCheckStatus==="success"?"hidden":"block"} flex-1 px-4 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent `}></input>
                  <input placeholder="Enter Your New Password" id="password" type="password" onKeyDown={(e)=>{
                    if(e.key==="Enter"){
                        handlePasswordChange("change");
                    }
                  }} onChange={(e)=>setPassword(e.target.value)} className={` ${passwordCheckStatus==="success"?"block":"hidden"} flex-1 px-4 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent relative `}></input>
                {passwordCheckStatus==="checking" ? <LoaderIcon className="w-5 h-5 mt-2 animate-spin text-muted-foreground"/> : passwordCheckStatus==="error" ? <span className="text-red-500 m-2">{passwordChangeError}</span> : passwordCheckStatus==="success" ? <span className="text-green-500 m-2">Success!</span> : null}
                
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Display Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <Button
                    onClick={handleSaveDisplayName}
                    disabled={isSavingName}
                    size="sm"
                    className="px-4 h-10 flex items-center justify-center"
                  >
                    {nameSaved ? (
                      <Check className="w-4 h-4" />
                    ) : isSavingName ? (
                      "Saving..."
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Statistics</h2>
                <p className="text-xs text-muted-foreground">
                  Your journaling progress
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-accent mb-1">
                  <Flame className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {streakData?.currentStreak ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Current Streak</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
                  <Flame className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {streakData?.longestStreak ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Best Streak</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                  <FileText className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {streakData?.totalEntries ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Total Entries</p>
              </div>
            </div>

            {streakData?.lastEntryDate && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Last entry:{" "}
                {format(new Date(streakData.lastEntryDate), "MMMM d, yyyy")}
              </div>
            )}
          </section>

          {/* Security Section */}
          <section className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Security</h2>
                <p className="text-xs text-muted-foreground">
                  Protect your diary with a PIN
                </p>
              </div>
            </div>

            {/* PIN Status */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                {settings?.pin_enabled ? (
                  <Lock className="w-5 h-5 text-green-500" />
                ) : (
                  <Unlock className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-foreground">
                    {settings?.pin_enabled ? "PIN Enabled" : "PIN Disabled"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {settings?.pin_enabled
                      ? "Your diary is protected with a 4-digit PIN"
                      : "Enable PIN to protect your diary"}
                  </p>
                </div>
              </div>
              {settings?.pin_enabled ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDisableConfirm(true)}
                >
                  Disable
                </Button>
              ) : (
                <Button size="sm" onClick={() => setShowPinSetup(true)}>
                  Set PIN
                </Button>
              )}
            </div>

            {/* PIN Setup Modal */}
            {showPinSetup && (
              <div className="mt-4 p-4 border border-border rounded-lg bg-background">
                <h3 className="font-medium text-foreground mb-4">
                  {pinStep === "enter"
                    ? "Enter a 4-digit PIN"
                    : "Confirm your PIN"}
                </h3>

                <div className="flex justify-center gap-3 mb-4">
                  {(pinStep === "enter" ? newPin : confirmPin).map(
                    (digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          if (pinStep === "enter") {
                            pinInputRefs.current[index] = el;
                          } else {
                            confirmPinInputRefs.current[index] = el;
                          }
                        }}
                        type={showPin ? "text" : "password"}
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handlePinInputChange(
                            index,
                            e.target.value,
                            pinStep === "confirm"
                          )
                        }
                        onKeyDown={(e) =>
                          handlePinKeyDown(index, e, pinStep === "confirm")
                        }
                        className="w-12 h-12 text-center text-xl font-semibold bg-surface border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                      />
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="flex items-center gap-2 mx-auto mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPin ? (
                    <>
                      <EyeOff className="w-4 h-4" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" /> Show
                    </>
                  )}
                </button>

                {pinError && (
                  <div className="flex items-center gap-2 justify-center text-destructive text-sm mb-4">
                    <AlertCircle className="w-4 h-4" />
                    {pinError}
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowPinSetup(false);
                      setNewPin(["", "", "", ""]);
                      setConfirmPin(["", "", "", ""]);
                      setPinStep("enter");
                      setPinError(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSetupPin}
                    disabled={isSavingPin}
                  >
                    {isSavingPin
                      ? "Saving..."
                      : pinStep === "enter"
                      ? "Next"
                      : "Save PIN"}
                  </Button>
                </div>
              </div>
            )}

            {/* Disable PIN Confirmation */}
            {showDisableConfirm && (
              <div className="mt-4 p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                <h3 className="font-medium text-foreground mb-2">
                  Disable PIN Protection?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your diary will no longer require a PIN to access. Are you
                  sure?
                </p>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDisableConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDisablePin}
                    disabled={isDisabling}
                  >
                    {isDisabling ? "Disabling..." : "Disable PIN"}
                  </Button>
                </div>
              </div>
            )}
          </section>

          {/* Logout Section */}
          <section className="bg-surface border border-border rounded-xl p-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-left p-3 hover:bg-muted/50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Sign Out</p>
                <p className="text-xs text-muted-foreground">
                  Sign out of your account
                </p>
              </div>
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
