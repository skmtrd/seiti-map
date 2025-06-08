"use server";

import { createClient } from "@/lib/supabase/server";
import type { Comment, CommentInsert, CommentWithUser } from "@/types/database";
import { revalidatePath } from "next/cache";

interface GetCommentsOptions {
  spotId: string;
  limit?: number;
}

/**
 * 指定されたスポットのコメント一覧を取得
 */
export async function getComments(options: GetCommentsOptions): Promise<Comment[]> {
  try {
    const supabase = await createClient();

    let query = supabase.from("comments").select("*").eq("spot_id", options.spotId);

    // 作成日時の降順でソート
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching comments:", error);
      throw new Error("コメントの取得に失敗しました");
    }

    return data || [];
  } catch (error) {
    console.error("getComments error:", error);
    throw new Error("コメントの取得中にエラーが発生しました");
  }
}

/**
 * 新しいコメントを作成（最大4枚の画像対応）
 */
export async function createComment(
  formData: FormData
): Promise<{ success: boolean; comment?: Comment; error?: string }> {
  try {
    // 認証されたサーバークライアントを作成
    const supabase = await createClient();

    // 現在のユーザーを取得
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Auth error:", authError);
      return { success: false, error: "認証エラーが発生しました" };
    }

    if (!user) {
      return { success: false, error: "ログインが必要です" };
    }

    // FormDataからデータを抽出
    const spotId = formData.get("spot_id") as string;
    const content = formData.get("content") as string;
    const imageFile1 = formData.get("image_1") as File | null;
    const imageFile2 = formData.get("image_2") as File | null;
    const imageFile3 = formData.get("image_3") as File | null;
    const imageFile4 = formData.get("image_4") as File | null;

    // 入力検証
    if (!spotId) {
      return { success: false, error: "スポットIDが必要です" };
    }

    if (!content?.trim()) {
      return { success: false, error: "コメント内容は必須です" };
    }

    // スポットの存在確認
    const { data: spot, error: spotError } = await supabase
      .from("spots")
      .select("id")
      .eq("id", spotId)
      .single();

    if (spotError || !spot) {
      return { success: false, error: "指定されたスポットが見つかりません" };
    }

    // 画像アップロード処理（最大4枚）
    const imageFiles = [imageFile1, imageFile2, imageFile3, imageFile4];
    const imageUrls: (string | null)[] = [null, null, null, null];

    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];

      if (imageFile && imageFile.size > 0) {
        try {
          // ファイル名を生成（タイムスタンプ + ランダム文字列 + 元のファイル名）
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 15);
          const fileExtension = imageFile.name.split(".").pop() || "jpg";
          const fileName = `${timestamp}_${randomString}_${i + 1}.${fileExtension}`;
          // ユーザーIDをフォルダ名として使用（RLSポリシーに準拠）
          const filePath = `${user.id}/${fileName}`;

          // Supabase Storageにアップロード
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("comment-images")
            .upload(filePath, imageFile, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            console.error(`Upload error for image ${i + 1}:`, uploadError);
            // 一部の画像のアップロードが失敗しても続行（他の画像や本文は保存）
            console.warn(`画像${i + 1}のアップロードに失敗しました: ${uploadError.message}`);
            continue;
          }

          // 公開URLを取得
          const { data: urlData } = supabase.storage.from("comment-images").getPublicUrl(filePath);

          if (urlData.publicUrl) {
            imageUrls[i] = urlData.publicUrl;
          }
        } catch (error) {
          console.error(`Image upload error for image ${i + 1}:`, error);
          // エラーをログに記録するが、処理は続行
          console.warn(`画像${i + 1}のアップロード中にエラーが発生しました`);
        }
      }
    }

    // コメントデータを準備
    const commentData: CommentInsert = {
      spot_id: spotId,
      user_id: user.id,
      content: content.trim(),
      image_url_1: imageUrls[0],
      image_url_2: imageUrls[1],
      image_url_3: imageUrls[2],
      image_url_4: imageUrls[3],
    };

    // コメントを作成
    const { data: commentResult, error: insertError } = await supabase
      .from("comments")
      .insert(commentData)
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return { success: false, error: "コメントの作成に失敗しました" };
    }

    // キャッシュを無効化
    revalidatePath(`/spot/${spotId}`);
    revalidatePath("/");

    return { success: true, comment: commentResult };
  } catch (error) {
    console.error("createComment error:", error);
    return { success: false, error: "コメント作成中にエラーが発生しました" };
  }
}

/**
 * コメントを更新（画像の追加・削除も対応）
 */
export async function updateComment(
  commentId: string,
  formData: FormData
): Promise<{ success: boolean; comment?: Comment; error?: string }> {
  try {
    // 認証されたサーバークライアントを作成
    const supabase = await createClient();

    // 現在のユーザーを取得
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Auth error:", authError);
      return { success: false, error: "認証エラーが発生しました" };
    }

    if (!user) {
      return { success: false, error: "ログインが必要です" };
    }

    // 既存のコメント情報を取得して権限をチェック
    const { data: existingComment, error: fetchError } = await supabase
      .from("comments")
      .select("*")
      .eq("id", commentId)
      .single();

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return { success: false, error: "コメント情報の取得に失敗しました" };
    }

    if (!existingComment) {
      return { success: false, error: "コメントが見つかりません" };
    }

    // 権限チェック：投稿者本人のみ更新可能
    if (existingComment.user_id !== user.id) {
      return { success: false, error: "このコメントを更新する権限がありません" };
    }

    // FormDataからデータを抽出
    const content = formData.get("content") as string;
    const imageFile1 = formData.get("image_1") as File | null;
    const imageFile2 = formData.get("image_2") as File | null;
    const imageFile3 = formData.get("image_3") as File | null;
    const imageFile4 = formData.get("image_4") as File | null;

    // 入力検証
    if (!content?.trim()) {
      return { success: false, error: "コメント内容は必須です" };
    }

    // 既存の画像URL
    const currentImageUrls = [
      existingComment.image_url_1,
      existingComment.image_url_2,
      existingComment.image_url_3,
      existingComment.image_url_4,
    ];

    // 新しい画像ファイル
    const imageFiles = [imageFile1, imageFile2, imageFile3, imageFile4];
    const updatedImageUrls: (string | null)[] = [...currentImageUrls];

    // 画像の更新処理
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];

      if (imageFile && imageFile.size > 0) {
        try {
          // 既存の画像がある場合は削除
          if (currentImageUrls[i]) {
            try {
              const currentImageUrl = currentImageUrls[i];
              if (currentImageUrl) {
                const urlParts = currentImageUrl.split("/comment-images/");
                if (urlParts.length > 1) {
                  const filePath = urlParts[1];
                  await supabase.storage.from("comment-images").remove([filePath]);
                }
              }
            } catch (deleteError) {
              console.warn(`既存画像${i + 1}の削除に失敗しました:`, deleteError);
            }
          }

          // 新しい画像をアップロード
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 15);
          const fileExtension = imageFile.name.split(".").pop() || "jpg";
          const fileName = `${timestamp}_${randomString}_${i + 1}.${fileExtension}`;
          const filePath = `${user.id}/${fileName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("comment-images")
            .upload(filePath, imageFile, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            console.error(`Upload error for image ${i + 1}:`, uploadError);
            console.warn(`画像${i + 1}のアップロードに失敗しました: ${uploadError.message}`);
            continue;
          }

          // 公開URLを取得
          const { data: urlData } = supabase.storage.from("comment-images").getPublicUrl(filePath);

          if (urlData.publicUrl) {
            updatedImageUrls[i] = urlData.publicUrl;
          }
        } catch (error) {
          console.error(`Image upload error for image ${i + 1}:`, error);
          console.warn(`画像${i + 1}のアップロード中にエラーが発生しました`);
        }
      }
    }

    // コメントを更新
    const { data: commentResult, error: updateError } = await supabase
      .from("comments")
      .update({
        content: content.trim(),
        image_url_1: updatedImageUrls[0],
        image_url_2: updatedImageUrls[1],
        image_url_3: updatedImageUrls[2],
        image_url_4: updatedImageUrls[3],
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return { success: false, error: "コメントの更新に失敗しました" };
    }

    // キャッシュを無効化
    revalidatePath(`/spot/${existingComment.spot_id}`);
    revalidatePath("/");

    return { success: true, comment: commentResult };
  } catch (error) {
    console.error("updateComment error:", error);
    return { success: false, error: "コメント更新中にエラーが発生しました" };
  }
}

/**
 * コメントを削除
 */
export async function deleteComment(
  commentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 認証されたサーバークライアントを作成
    const supabase = await createClient();

    // 現在のユーザーを取得
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Auth error:", authError);
      return { success: false, error: "認証エラーが発生しました" };
    }

    if (!user) {
      return { success: false, error: "ログインが必要です" };
    }

    // 既存のコメント情報を取得して権限をチェック
    const { data: existingComment, error: fetchError } = await supabase
      .from("comments")
      .select("*")
      .eq("id", commentId)
      .single();

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return { success: false, error: "コメント情報の取得に失敗しました" };
    }

    if (!existingComment) {
      return { success: false, error: "コメントが見つかりません" };
    }

    // 権限チェック：投稿者本人のみ削除可能
    if (existingComment.user_id !== user.id) {
      return { success: false, error: "このコメントを削除する権限がありません" };
    }

    // 関連画像を削除
    const imageUrls = [
      existingComment.image_url_1,
      existingComment.image_url_2,
      existingComment.image_url_3,
      existingComment.image_url_4,
    ];

    for (const imageUrl of imageUrls) {
      if (imageUrl) {
        try {
          const urlParts = imageUrl.split("/comment-images/");
          if (urlParts.length > 1) {
            const filePath = urlParts[1];
            await supabase.storage.from("comment-images").remove([filePath]);
          }
        } catch (deleteError) {
          console.warn("画像の削除に失敗しました:", deleteError);
          // 画像削除失敗は警告のみで続行
        }
      }
    }

    // コメントを削除
    const { error: deleteError } = await supabase.from("comments").delete().eq("id", commentId);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return { success: false, error: "コメントの削除に失敗しました" };
    }

    // キャッシュを無効化
    revalidatePath(`/spot/${existingComment.spot_id}`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("deleteComment error:", error);
    return { success: false, error: "コメント削除中にエラーが発生しました" };
  }
}
