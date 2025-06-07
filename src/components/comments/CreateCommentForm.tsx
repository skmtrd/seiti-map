"use client";

import { createComment } from "@/actions/comments";
import { MultiImageUpload } from "@/components/common/MultiImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

interface CreateCommentFormProps {
  spotId: string;
  onCommentCreated?: () => void;
}

interface FormData {
  content: string;
  images: File[];
}

export function CreateCommentForm({ spotId, onCommentCreated }: CreateCommentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    content: "",
    images: [],
  });

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleImagesChange = (files: File[]) => {
    setFormData((prev) => ({ ...prev, images: files }));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // FormDataを作成
      const submissionFormData = new FormData();

      // 基本データを追加
      submissionFormData.set("spot_id", spotId);
      submissionFormData.set("content", formData.content);

      // 画像ファイルを追加（最大4枚）
      for (let i = 0; i < Math.min(formData.images.length, 4); i++) {
        submissionFormData.set(`image_${i + 1}`, formData.images[i]);
      }

      const result = await createComment(submissionFormData);

      if (result.success) {
        setMessage({ type: "success", text: "コメントが正常に投稿されました！" });

        // フォームをリセット
        setFormData({
          content: "",
          images: [],
        });

        // 成功時のコールバック実行
        onCommentCreated?.();

        toast.success("コメントを投稿しました");
        router.push(`/${spotId}`);
      } else {
        setMessage({ type: "error", text: result.error || "エラーが発生しました" });
        toast.error(result.error || "コメントの投稿に失敗しました");
      }
    } catch (error) {
      const errorMessage = "予期しないエラーが発生しました";
      setMessage({ type: "error", text: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isFormValid = formData.content.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          コメントを投稿
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* コメント内容 */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              コメント *
            </Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleContentChange}
              placeholder="この聖地について教えてください&#10;&#10;例：&#10;・実際に訪れた感想&#10;・アクセス方法や注意点&#10;・作品との比較&#10;・おすすめの時間帯など"
              rows={6}
              required
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">{formData.content.length} 文字</p>
          </div>

          {/* 画像アップロード */}
          <div className="space-y-2">
            <MultiImageUpload
              onImagesChange={handleImagesChange}
              label="画像（任意）"
              placeholder="現地の写真を追加"
              maxSize={5}
              maxImages={4}
              multiple={true}
            />
            <p className="text-xs text-muted-foreground">
              現地の写真、比較画像、シーンの参考画像などを最大4枚まで追加できます
            </p>
          </div>

          {/* メッセージ表示 */}
          {message && (
            <div
              className={`p-4 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* 送信ボタン */}
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Send className="mr-2 h-4 w-4 animate-pulse" />
                投稿中...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                コメントを投稿
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
