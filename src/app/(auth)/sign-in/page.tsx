import { SignInForm } from "@/components/auth/SignInForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">サインイン</CardTitle>
            <CardDescription className="text-center">
              メールアドレスとパスワードでサインインしてください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm />
            <div className="mt-6 text-center text-sm">
              アカウントをお持ちでない方は{" "}
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 underline">
                こちらからサインアップ
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
