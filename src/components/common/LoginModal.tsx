"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  setIsOpen: (bool: boolean) => void;
  trigger: React.ReactNode;
  title?: string;
  description?: string;
}

export default function LoginModal({
  isOpen,
  setIsOpen,
  trigger,
  title,
  description,
}: LoginModalProps) {
  const router = useRouter();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-0 bg-white shadow-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-semibold text-black text-xl">
            {title || "聖地の登録にはログインが必要です"}
          </DialogTitle>
          <DialogDescription className="mt-2 text-center text-black">
            {description || "ログインすると以下の機能が利用できます："}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          <ul className="space-y-1 self-start pr-4 pl-8 text-black text-sm">
            <li>• 聖地へのコメント投稿</li>
            <li>• お気に入り登録・管理</li>
            <li>• 投稿履歴の確認</li>
          </ul>

          <div className="w-full space-y-3">
            <Button
              className="w-full bg-black py-2.5 font-medium text-white hover:bg-gray-800"
              onClick={() => {
                // アカウント作成処理
                router.push("/auth?mode=signup");
              }}
            >
              アカウント作成
            </Button>

            <Button
              variant="outline"
              className="w-full border-gray-300 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => {
                // ログイン処理
                router.push("/auth");
              }}
            >
              ログイン
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
