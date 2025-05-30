import { supabase } from "@/lib/supabase";
import type { Work } from "@/types/database";

export async function getWorks(): Promise<Work[]> {
  try {
    const query = supabase.from("works").select("*");

    const { data, error } = await query;

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
