"use client";

import { MultiImageUpload } from "@/components/common/MultiImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useCommentUploadForm } from "@/hooks/form/useCommentUploadForm";
import { MessageSquare, Send } from "lucide-react";
interface CreateCommentFormProps {
  spotId: string;
  onCommentCreated?: () => void;
}

export function CreateCommentForm({ spotId }: CreateCommentFormProps) {
  const { form, onSubmit, handleImagesChange } = useCommentUploadForm(spotId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          コメントを投稿
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* コメント内容 */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>コメント *</FormLabel>
                  <FormControl>
                    <Textarea
                      id="content"
                      {...field}
                      placeholder="この聖地について教えてください&#10;&#10;例：&#10;・実際に訪れた感想&#10;・アクセス方法や注意点&#10;・作品との比較&#10;・おすすめの時間帯など"
                      rows={6}
                      required
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            {/* 送信ボタン */}
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              className="w-full"
              size="lg"
            >
              {form.formState.isSubmitting ? (
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
        </Form>
      </CardContent>
    </Card>
  );
}
