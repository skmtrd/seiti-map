"use server";

import { supabase } from "@/lib/supabase";
import type { Work } from "@/types/database";

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
