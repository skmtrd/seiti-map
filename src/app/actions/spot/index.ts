"use server";

import { createWork } from "@/app/actions/work";
import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import type { SpotInsert, SpotWithWork } from "@/types/database";
import { revalidatePath } from "next/cache";

interface GetSpotsOptions {
  prefecture?: string;
  city?: string;
  search?: string;
  limit?: number;
  workIds?: string[]; // 作品IDの配列で絞り込み
}

export async function getSpots(options: GetSpotsOptions = {}): Promise<SpotWithWork[]> {
  try {
    let query = supabase.from("spots").select(`
        *,
        works (
          id,
          title,
          type,
          description,
          release_year
        )
      `);

    // 都道府県でフィルタ
    if (options.prefecture) {
      query = query.eq("prefecture", options.prefecture);
    }

    // 市でフィルタ
    if (options.city) {
      query = query.eq("city", options.city);
    }

    // 作品IDでフィルタ（複数選択対応）
    if (options.workIds && options.workIds.length > 0) {
      query = query.in("work_id", options.workIds);
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

// 都道府県の一覧を取得する関数
export async function getPrefectures(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("spots").select("prefecture").order("prefecture");

    if (error) {
      console.error("Error fetching prefectures:", error);
      throw new Error("都道府県の取得に失敗しました");
    }

    // ユニークな都道府県のリストを作成
    const uniquePrefectures = [...new Set(data?.map((item) => item.prefecture) || [])];
    return uniquePrefectures;
  } catch (error) {
    console.error("getPrefectures error:", error);
    throw new Error("都道府県の取得中にエラーが発生しました");
  }
}

// 指定した都道府県の市の一覧を取得する関数
export async function getCitiesByPrefecture(prefecture: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("spots")
      .select("city")
      .eq("prefecture", prefecture)
      .order("city");

    if (error) {
      console.error("Error fetching cities:", error);
      throw new Error("市区町村の取得に失敗しました");
    }

    // ユニークな市のリストを作成
    const uniqueCities = [...new Set(data?.map((item) => item.city) || [])];
    return uniqueCities;
  } catch (error) {
    console.error("getCitiesByPrefecture error:", error);
    throw new Error("市区町村の取得中にエラーが発生しました");
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
    if (!workId || !name || !description || Number.isNaN(latitude) || Number.isNaN(longitude)) {
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
