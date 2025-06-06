"use server";

import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import type { Work, WorkInsert } from "@/types/database";
import { revalidatePath } from "next/cache";

// 作品一覧を取得する関数
export async function getWorks(): Promise<Work[]> {
  try {
    const { data, error } = await supabase
      .from("works")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching works:", error);
      throw new Error("作品の取得に失敗しました");
    }

    return data || [];
  } catch (error) {
    console.error("getWorks error:", error);
    throw new Error("作品の取得中にエラーが発生しました");
  }
}

export async function getWorkDetail(workId: string): Promise<Work> {
  try {
    const { data, error } = await supabase.from("works").select("*").eq("id", workId).single();

    if (error) {
      console.error("Error fetching work detail:", error);
      throw new Error("作品の取得に失敗しました");
    }

    return data;
  } catch (error) {
    console.error("getWorkDetail error:", error);
    throw new Error("作品の取得中にエラーが発生しました");
  }
}

// 新しい作品を作成する関数
export async function createWork(
  title: string,
  type: "anime" | "drama" | "movie" | "game" | "novel" | "manga" | "other",
  description?: string,
  releaseYear?: number
): Promise<{ success: boolean; work?: Work; error?: string }> {
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

    // 同じタイトルの作品が既に存在するかチェック
    const { data: existingWork, error: checkError } = await supabase
      .from("works")
      .select("id, title")
      .ilike("title", title.trim())
      .eq("is_public", true)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116は「レコードが見つからない」エラーなので無視
      console.error("Error checking existing work:", checkError);
      return { success: false, error: "作品の重複チェックに失敗しました" };
    }

    if (existingWork) {
      return {
        success: false,
        error: `「${existingWork.title}」は既に登録されています`,
      };
    }

    // 作品データを準備
    const workData: WorkInsert = {
      title: title.trim(),
      type,
      description: description?.trim() || null,
      release_year: releaseYear || null,
      created_by: user.id,
      is_public: true,
    };

    // 作品を作成
    const { data: workResult, error: insertError } = await supabase
      .from("works")
      .insert(workData)
      .select()
      .single();

    if (insertError) {
      console.error("Insert work error:", insertError);
      return { success: false, error: "作品の作成に失敗しました" };
    }

    // キャッシュを無効化
    revalidatePath("/");
    revalidatePath("/create");

    return { success: true, work: workResult };
  } catch (error) {
    console.error("createWork error:", error);
    return { success: false, error: "作品作成中にエラーが発生しました" };
  }
}
