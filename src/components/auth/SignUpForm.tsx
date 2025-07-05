"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignUpForm } from "@/hooks/form/useSignUpForm";
import { cn } from "@/lib/utils";
import { CheckCircle, Mail } from "lucide-react";
import Link from "next/link";

interface SignUpFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onSwitchToSignIn?: () => void;
}

export function SignUpForm({ className, onSwitchToSignIn, ...props }: SignUpFormProps) {
  const { form, onSubmit, isLoading, isSuccess } = useSignUpForm();

  // 成功画面を表示
  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <CheckCircle className="h-8 w-8 text-gray-600" />
            </div>
            <CardTitle className="text-2xl">確認メールを送信しました</CardTitle>
            <CardDescription>アカウントを有効化するためにメールをご確認ください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong className="text-gray-900">{form.getValues("email")}</strong> に確認メールを送信しました。
              </p>
              <p className="text-gray-600">
                メール内のリンクをクリックしてアカウントを有効化してください。
              </p>
            </div>

            <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-left">
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                <div className="space-y-1 text-gray-600 text-sm">
                  <p>
                    • メールが届かない場合は<strong>迷惑メールフォルダ</strong>をご確認ください
                  </p>
                  <p>
                    • 確認メールの有効期限は<strong>24時間</strong>です
                  </p>
                </div>
              </div>
            </div>

            {form.formState.errors.root && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-red-600 text-sm">{form.formState.errors.root.message}</p>
              </div>
            )}

            <div className="space-y-3">
              {onSwitchToSignIn ? (
                <Button variant="default" className="w-full" onClick={onSwitchToSignIn}>
                  ログインページに戻る
                </Button>
              ) : (
                <Button variant="default" asChild className="w-full">
                  <Link href="/sign-in">ログインページに戻る</Link>
                </Button>
              )}
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="user@example.com"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パスワード</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repeatPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パスワード（確認）</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        name="confirm-password"
                        autoComplete="new-password"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.formState.errors.root && (
                <p className="text-red-500 text-sm">{form.formState.errors.root.message}</p>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "アカウント作成中..." : "サインアップ"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center text-sm">
            すでにアカウントをお持ちの場合は{" "}
            {onSwitchToSignIn ? (
              <button
                type="button"
                onClick={onSwitchToSignIn}
                className="underline underline-offset-4 hover:text-primary"
              >
                ログイン
              </button>
            ) : (
              <Link href="/sign-in" className="underline underline-offset-4">
                ログイン
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
