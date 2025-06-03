"use client";

import { redirectToSignIn, signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface UserMenuProps {
  userAuthenticated: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="absolute top-6 right-6 z-10" ref={menuRef}>
      {/* アバターボタン */}

      {props.userAuthenticated ? (
        <Button onClick={() => setIsMenuOpen(!isMenuOpen)} size="icon" variant="outline">
          <User className="text-gray-600" />
        </Button>
      ) : (
        <Button onClick={() => router.push("/sign-in")}>サインインする</Button>
      )}
      {/* ドロップダウンメニュー */}
      {isMenuOpen && (
        <Card className="absolute top-14 right-0 w-48 p-2 shadow-lg border">
          <Button
            onClick={handleSignOut}
            disabled={isSigningOut}
            variant="ghost"
            className="w-full justify-start text-left hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isSigningOut ? "サインアウト中..." : "サインアウト"}
          </Button>
        </Card>
      )}
    </div>
  );
};
