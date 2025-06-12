"use client";

import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { IconTab } from "@/components/common/IconTab";
import { LogIn, UserPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type AuthMode = "signin" | "signup";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") as AuthMode;
  const [currentMode, setCurrentMode] = useState<AuthMode>(mode || "signin");
  const tabOptions = [
    {
      value: "signin",
      icon: <LogIn className="h-4 w-4" />,
    },
    {
      value: "signup",
      icon: <UserPlus className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* Tab Navigation */}
        <div className="mb-3 flex w-full justify-end">
          <IconTab
            options={tabOptions}
            currentValue={currentMode}
            onChange={(value) => setCurrentMode(value as AuthMode)}
          />
        </div>

        {/* Form Container with Animation */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(${currentMode === "signin" ? "0%" : "-100%"})`,
            }}
          >
            {/* SignIn Form */}
            <div className="w-full flex-shrink-0">
              <div
                className={`transition-opacity duration-300 ${currentMode === "signin" ? "opacity-100" : "opacity-0"}`}
              >
                <SignInForm onSwitchToSignUp={() => setCurrentMode("signup")} />
              </div>
            </div>

            {/* SignUp Form */}
            <div className="w-full flex-shrink-0">
              <div
                className={`transition-opacity duration-300 ${currentMode === "signup" ? "opacity-100" : "opacity-0"}`}
              >
                <SignUpForm onSwitchToSignIn={() => setCurrentMode("signin")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
