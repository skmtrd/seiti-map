"use client";

import { signUp } from "@/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const useSignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formSchema = z.object({
    email: z.string().email({ message: "正しいメールアドレスを入力してください" }),
    password: z.string().min(6, { message: "パスワードは6文字以上で入力してください" }),
    repeatPassword: z.string().min(1, { message: "パスワード（確認）を入力してください" }),
  }).refine((data) => data.password === data.repeatPassword, {
    message: "パスワードが一致しません",
    path: ["repeatPassword"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const result = await signUp(data.email, data.password, data.repeatPassword);

      if (result.success) {
        // サインアップ成功時に成功画面を表示
        setIsSuccess(true);
        return;
      }

      // サインアップ自体が失敗した場合のみエラーを表示
      form.setError("root", {
        message: result.error || "サインアップに失敗しました",
      });
    } catch (error) {
      // サインアップ処理自体でエラーが発生した場合のみ表示
      console.error("Sign up error:", error);
      form.setError("root", {
        message: "サインアップに失敗しました",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
    isSuccess,
  };
};