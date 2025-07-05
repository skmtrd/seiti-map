"use client";

import { redirectToHome, signIn } from "@/actions/auth";
import { createUserKey } from "@/hooks/SWR/useGetUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import z from "zod";

export const useSignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().email({ message: "正しいメールアドレスを入力してください" }),
    password: z.string().min(1, { message: "パスワードを入力してください" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const result = await signIn(data.email, data.password);

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
      form.setError("root", {
        message: result.error || "サインインに失敗しました",
      });
    } catch (error) {
      // サインイン処理自体でエラーが発生した場合のみ表示
      console.error("Sign in error:", error);
      form.setError("root", {
        message: "サインインに失敗しました",
      });
    } finally {
      setIsLoading(false);
      mutate(createUserKey());
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
  };
};