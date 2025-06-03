import { SignUpForm } from "@/components/auth/SignUpForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">サインアップ</CardTitle>
            <CardDescription className="text-center">
              新しいアカウントを作成してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
            <div className="mt-6 text-center text-sm">
              既にアカウントをお持ちの方は{" "}
              <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 underline">
                こちらからサインイン
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
