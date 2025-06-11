"use client";

import { redirectToSignIn, signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetUser } from "@/hooks/SWR/useGetUser";
import { usePreventScroll } from "@/hooks/common/usePreventScroll";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const UserMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, isLoading, isError, error, mutate } = useGetUser();
  const userAuthenticated = user !== null;

  const preventScroll = usePreventScroll({
    wheel: true,
    touch: true,
    keyboard: false,
  });

  // メニュー外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      const result = await signOut();

      if (result.success) {
        // サインアウト成功後、サインインページにリダイレクト
        await redirectToSignIn();
      } else {
        console.error("Sign out failed:", result.error);
      }
    } catch (error) {
      console.error("Unexpected sign out error:", error);
    } finally {
      setIsSigningOut(false);
      setIsMenuOpen(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50" ref={preventScroll}>
      {/* アバターボタン */}

      {userAuthenticated ? (
        <Button onClick={() => setIsMenuOpen(!isMenuOpen)} size="icon" variant="default">
          <User className="text-white" />
        </Button>
      ) : (
        <Button disabled={isLoading} onClick={() => router.push("/sign-in")} variant="default">
          サインイン
        </Button>
      )}
      {/* ドロップダウンメニュー */}
      {isMenuOpen && (
        <Card className="absolute top-14 right-0 w-48 border p-2 shadow-lg">
          <Button
            onClick={handleSignOut}
            disabled={isSigningOut}
            variant="ghost"
            className="w-full justify-start text-left hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isSigningOut ? "サインアウト中..." : "サインアウト"}
          </Button>
        </Card>
      )}
    </div>
  );
};
