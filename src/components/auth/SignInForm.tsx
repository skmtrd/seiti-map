"use client";

import { redirectToHome, signIn } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export function SignInForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn(email, password);

      if (result.success) {
        // 成功時はリダイレクトを試行するが、エラーがあってもユーザーには表示しない
        try {
          await redirectToHome();
        } catch (redirectError) {
          // リダイレクトエラーは無視（ブラウザの制限等で発生する可能性がある）
          console.error("Redirect error (ignored):", redirectError);
        }
        return;
      }

      // サインイン自体が失敗した場合のみエラーを表示
      setError(result.error || "サインインに失敗しました");
    } catch (error) {
      // サインイン処理自体でエラーが発生した場合のみ表示
      console.error("Sign in error:", error);
      setError("サインインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">ログイン</CardTitle>
          <CardDescription>
            メールアドレスとパスワードを入力してログインしてください
          </CardDescription>
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
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    パスワードを忘れた場合
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "ログイン中..." : "ログイン"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              アカウントをお持ちでない場合は{" "}
              <Link href="/sign-up" className="underline underline-offset-4">
                サインアップ
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
