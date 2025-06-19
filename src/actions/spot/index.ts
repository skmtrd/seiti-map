"use server";

import { createWork } from "@/actions/work";
import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import type { Spot, SpotInsert, SpotWithWork } from "@/types/database";
import { revalidatePath } from "next/cache";

interface GetSpotsOptions {
  prefecture?: string;
  city?: string;
  search?: string;
  limit?: number;
  workIds?: string[]; // 作品IDの配列で絞り込み
  workTypes?: string[]; // 作品タイプの配列で絞り込み
}

export async function getSpots(options: GetSpotsOptions = {}): Promise<SpotWithWork[]> {
  try {
    let query = supabase.from("spots").select(`
        *,
        works!inner (
          id,
          title,
          type,
          description,
          release_year
        )
      `);

    // 作品IDでフィルタ（複数選択対応）
    if (options.workIds && options.workIds.length > 0) {
      query = query.in("work_id", options.workIds);
    }

    // 作品タイプでフィルタ（JOINしたworksテーブルのtypeカラムを使用）
    if (options.workTypes && options.workTypes.length > 0) {
      query = query.in("works.type", options.workTypes);
    }

    // 検索（名前または説明文で検索）
    if (options.search) {
      query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }

    // 制限
    if (options.limit) {
      query = query.limit(options.limit);
    }

    // 作成日時の降順でソート
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching spots:", error);
      throw new Error("スポットの取得に失敗しました");
    }

    return data || [];
  } catch (error) {
    console.error("getSpots error:", error);
    throw new Error("スポットの取得中にエラーが発生しました");
  }
}

export async function getSpotDetail(spotId: string): Promise<Spot> {
  try {
    const { data, error } = await supabase
      .from("spots")
      .select("*, works!inner (id, title, type, description, release_year)")
      .eq("id", spotId)
      .single();

    if (error) {
      console.error("Error fetching spots:", error);
      throw new Error("スポットの取得に失敗しました");
    }

    return data || null;
  } catch (error) {
    console.error("getSpots error:", error);
    throw new Error("スポットの取得中にエラーが発生しました");
  }
}

export async function updateSpot(
  spotId: string,
  formData: FormData
): Promise<{ success: boolean; spot?: Spot; error?: string }> {
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

    // 既存のスポット情報を取得して権限をチェック
    const { data: existingSpot, error: fetchError } = await supabase
      .from("spots")
      .select("*")
      .eq("id", spotId)
      .single();

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return { success: false, error: "スポット情報の取得に失敗しました" };
    }

    if (!existingSpot) {
      return { success: false, error: "スポットが見つかりません" };
    }

    // 権限チェック：投稿者本人のみ更新可能
    if (existingSpot.submitted_by !== user.id) {
      return { success: false, error: "このスポットを更新する権限がありません" };
    }

    // FormDataからデータを抽出
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File | null;

    // 入力検証
    if (!name?.trim()) {
      return { success: false, error: "スポット名は必須です" };
    }

    // 画像処理
    let imageUrl = existingSpot.image_url; // デフォルトは既存の画像URL

    if (imageFile && imageFile.size > 0) {
      try {
        // 既存の画像がある場合は削除
        if (existingSpot.image_url) {
          try {
            // URLから相対パスを抽出
            const urlParts = existingSpot.image_url.split("/spot-images/");
            if (urlParts.length > 1) {
              const filePath = urlParts[1];
              await supabase.storage.from("spot-images").remove([filePath]);
            }
          } catch (deleteError) {
            console.warn("既存画像の削除に失敗しました:", deleteError);
            // 削除失敗は警告のみで続行
          }
        }

        // 新しい画像をアップロード
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = imageFile.name.split(".").pop() || "jpg";
        const fileName = `${timestamp}_${randomString}.${fileExtension}`;
        const filePath = `${user.id}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("spot-images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error details:", uploadError);
          return {
            success: false,
            error: `画像のアップロードに失敗しました: ${uploadError.message}`,
          };
        }

        // 公開URLを取得
        const { data: urlData } = supabase.storage.from("spot-images").getPublicUrl(filePath);

        if (!urlData.publicUrl) {
          return { success: false, error: "画像URLの取得に失敗しました" };
        }

        imageUrl = urlData.publicUrl;
      } catch (error) {
        console.error("Image upload error:", error);
        return { success: false, error: "画像のアップロード中にエラーが発生しました" };
      }
    }

    // スポットデータを更新
    const updateData = {
      name: name.trim(),
      description: description?.trim() || "",
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedSpot, error: updateError } = await supabase
      .from("spots")
      .update(updateData)
      .eq("id", spotId)
      .select("*")
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return { success: false, error: "スポットの更新に失敗しました" };
    }

    // キャッシュを無効化
    revalidatePath("/");
    revalidatePath("/spots");
    revalidatePath(`/spots/${spotId}`);

    return { success: true, spot: updatedSpot };
  } catch (error) {
    console.error("updateSpot error:", error);
    return { success: false, error: "スポット更新中にエラーが発生しました" };
  }
}

// 新しいスポットを作成する関数（新規作品作成・画像アップロード統合対応）
export async function createSpot(
  formData: FormData
): Promise<{ success: boolean; spot?: SpotWithWork; error?: string }> {
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
    const workId = formData.get("work_id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const latitude = Number(formData.get("latitude"));
    const longitude = Number(formData.get("longitude"));
    const address = formData.get("address") as string;
    const prefecture = formData.get("prefecture") as string;
    const city = formData.get("city") as string;
    const imageFile = formData.get("image") as File | null;

    // 入力検証
    if (!workId || !name || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return { success: false, error: "必須項目が不足しています" };
    }

    let actualWorkId = workId;

    // 新規作品作成が必要な場合
    if (workId === "new") {
      const newWorkTitle = formData.get("new_work_title") as string;
      const newWorkType = formData.get("new_work_type") as string;
      const newWorkDescription = formData.get("new_work_description") as string;
      const newWorkYear = formData.get("new_work_year") as string;

      if (!newWorkTitle.trim()) {
        return { success: false, error: "新しい作品の名前を入力してください" };
      }

      const workResult = await createWork(
        newWorkTitle.trim(),
        newWorkType as "anime" | "drama" | "movie" | "game" | "novel" | "manga" | "other",
        newWorkDescription || undefined,
        newWorkYear ? Number(newWorkYear) : undefined
      );

      if (!workResult.success || !workResult.work) {
        return {
          success: false,
          error: `作品の作成に失敗しました: ${workResult.error}`,
        };
      }

      actualWorkId = workResult.work.id;
    }

    // 画像がある場合は事前にアップロード
    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      try {
        // ファイル名を生成（タイムスタンプ + ランダム文字列 + 元のファイル名）
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = imageFile.name.split(".").pop() || "jpg";
        const fileName = `${timestamp}_${randomString}.${fileExtension}`;
        // ユーザーIDをフォルダ名として使用（RLSポリシーに準拠）
        const filePath = `${user.id}/${fileName}`;

        // Supabase Storageにアップロード
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("spot-images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error details:", uploadError);
          return {
            success: false,
            error: `画像のアップロードに失敗しました: ${uploadError.message}`,
          };
        }

        // 公開URLを取得
        const { data: urlData } = supabase.storage.from("spot-images").getPublicUrl(filePath);

        if (!urlData.publicUrl) {
          return { success: false, error: "画像URLの取得に失敗しました" };
        }

        imageUrl = urlData.publicUrl;
      } catch (error) {
        console.error("Image upload error:", error);
        return { success: false, error: "画像のアップロード中にエラーが発生しました" };
      }
    }

    // スポットデータを準備（image_urlを含む）
    const spotData: SpotInsert = {
      work_id: actualWorkId,
      name,
      description,
      latitude,
      longitude,
      address,
      prefecture,
      city,
      submitted_by: user.id,
      is_public: true,
      view_count: 0,
      image_url: imageUrl, // 画像URLを直接設定
    };

    // スポットを作成
    const { data: spotResult, error: insertError } = await supabase
      .from("spots")
      .insert(spotData)
      .select(`
        *,
        works (
          id,
          title,
          type,
          description,
          release_year
        )
      `)
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return { success: false, error: "スポットの作成に失敗しました" };
    }

    // キャッシュを無効化
    revalidatePath("/");
    revalidatePath("/spots");

    return { success: true, spot: spotResult };
  } catch (error) {
    console.error("createSpot error:", error);
    return { success: false, error: "スポット作成中にエラーが発生しました" };
  }
}
