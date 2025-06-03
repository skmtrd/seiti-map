"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// サインアップのレスポンス型
interface AuthResponse {
  success: boolean;
  error?: string;
  message?: string;
}

// サインアップ用のServer Action
export async function signUp(
  email: string,
  password: string,
  confirmPassword: string
): Promise<AuthResponse> {
  // パスワード確認のバリデーション
  if (password !== confirmPassword) {
    return {
      success: false,
      error: "パスワードが一致しません",
    };
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Sign up error:", error);

      // Supabaseの具体的なエラーメッセージを日本語化
      let errorMessage = "サインアップに失敗しました";
      if (error.message.includes("User already registered")) {
        errorMessage = "このメールアドレスは既に登録されています";
      } else if (error.message.includes("Password should be")) {
        errorMessage = "パスワードは6文字以上で入力してください";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "有効なメールアドレスを入力してください";
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    // サインアップ成功（確認メール送信）
    return {
      success: true,
      message: "確認メールを送信しました。メールをご確認ください。",
    };
  } catch (error) {
    console.error("Unexpected sign up error:", error);
    return {
      success: false,
      error: "予期しないエラーが発生しました",
    };
  }
}

// サインイン用のServer Action
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);

      // Supabaseの具体的なエラーメッセージを日本語化
      let errorMessage = "サインインに失敗しました";
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "メールアドレスまたはパスワードが正しくありません";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "メールアドレスの確認が完了していません";
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    // サインイン成功
    revalidatePath("/", "layout");
    return {
      success: true,
      message: "サインインしました",
    };
  } catch (error) {
    console.error("Unexpected sign in error:", error);
    return {
      success: false,
      error: "予期しないエラーが発生しました",
    };
  }
}

// サインアウト用のServer Action
export async function signOut(): Promise<AuthResponse> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      return {
        success: false,
        error: "サインアウトに失敗しました",
      };
    }

    revalidatePath("/", "layout");
    return {
      success: true,
      message: "サインアウトしました",
    };
  } catch (error) {
    console.error("Unexpected sign out error:", error);
    return {
      success: false,
      error: "予期しないエラーが発生しました",
    };
  }
}

// リダイレクト専用のServer Action（サインイン成功後用）
export async function redirectToHome() {
  redirect("/");
}

// リダイレクト専用のServer Action（サインアウト後用）
export async function redirectToSignIn() {
  redirect("/sign-in");
}

export async function checkAuth() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // ログインしていない場合はサインインページにリダイレクト
  if (authError || !user) {
    redirect("/sign-in");
  }
}
