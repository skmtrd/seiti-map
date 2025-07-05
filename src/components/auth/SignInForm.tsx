"use client";

import { redirectToHome, signIn } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignInForm } from "@/hooks/form/useSignInForm";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SignInFormProps extends React.ComponentPropsWithoutRef<"div"> {
  onSwitchToSignUp?: () => void;
}

export function SignInForm({ className, onSwitchToSignUp, ...props }: SignInFormProps) {
  const { form, onSubmit, isLoading } = useSignInForm();

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
                    <div className="flex items-center">
                      <FormLabel>パスワード</FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        パスワードを忘れた場合
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        name="password"
                        autoComplete="current-password"
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
                {isLoading ? "ログイン中..." : "ログイン"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center text-sm">
            アカウントをお持ちでない場合は{" "}
            {onSwitchToSignUp ? (
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="underline underline-offset-4 hover:text-primary"
              >
                サインアップ
              </button>
            ) : (
              <Link href="/sign-up" className="underline underline-offset-4">
                サインアップ
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
