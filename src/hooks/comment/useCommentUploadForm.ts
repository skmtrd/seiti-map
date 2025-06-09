"use client";

import { createComment } from "@/actions/comments";
import { createCommentsKey } from "@/hooks/comment/useComments";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import z from "zod";

export const useCommentUploadForm = (spotId: string) => {
  const formSchema = z.object({
    content: z.string().min(1, { message: "コメントを入力してください" }).max(200, {
      message: "20文字以内で入力してください",
    }),
    images: z.array(z.instanceof(File)).optional(),
  });

  const router = useRouter();

  const handleImagesChange = (files: File[]) => {
    form.setValue("images", files);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      content: "",
      images: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // FormDataを作成
      const submissionFormData = new FormData();

      // 基本データを追加
      submissionFormData.set("spot_id", spotId);
      submissionFormData.set("content", data.content);

      // 画像ファイルを追加（最大4枚）
      for (let i = 0; i < Math.min(data.images?.length || 0, 4); i++) {
        submissionFormData.set(`image_${i + 1}`, data.images?.[i] || "");
      }

      const result = await createComment(submissionFormData);

      if (result.success) {
        toast.success("コメントを投稿しました");
        form.reset();
        mutate(createCommentsKey(spotId));
        router.push(`/${spotId}?tab=comment`);
      } else {
        toast.error(result.error || "コメントの投稿に失敗しました");
      }
    } catch (error) {
      const errorMessage = "予期しないエラーが発生しました";
      toast.error(errorMessage);
    }
  };

  return {
    form,
    onSubmit,
    handleImagesChange,
  };
};
