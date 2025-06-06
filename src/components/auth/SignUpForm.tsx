"use client";

import { signUp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("パスワードが一致しません");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp(email, password, repeatPassword);

      if (result.success) {
        // サインアップ成功時に成功画面を表示
        setIsSuccess(true);
        return;
      }

      // サインアップ自体が失敗した場合のみエラーを表示
      setError(result.error || "サインアップに失敗しました");
    } catch (error) {
      // サインアップ処理自体でエラーが発生した場合のみ表示
      console.error("Sign up error:", error);
      setError("サインアップに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // 成功画面を表示
  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-gray-600" />
            </div>
            <CardTitle className="text-2xl">確認メールを送信しました</CardTitle>
            <CardDescription>アカウントを有効化するためにメールをご確認ください</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong className="text-gray-900">{email}</strong> に確認メールを送信しました。
              </p>
              <p className="text-gray-600">
                メール内のリンクをクリックしてアカウントを有効化してください。
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    • メールが届かない場合は<strong>迷惑メールフォルダ</strong>をご確認ください
                  </p>
                  <p>
                    • 確認メールの有効期限は<strong>24時間</strong>です
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <Button variant="default" asChild className="w-full">
                <Link href="/sign-in">ログインページに戻る</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 通常のサインアップフォーム
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">サインアップ</CardTitle>
          <CardDescription>新しいアカウントを作成してください</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">パスワード</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">パスワード（確認）</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "アカウント作成中..." : "サインアップ"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              すでにアカウントをお持ちの場合は{" "}
              <Link href="/sign-in" className="underline underline-offset-4">
                ログイン
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
