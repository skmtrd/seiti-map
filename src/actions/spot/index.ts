"use server";

import { supabase } from "@/lib/supabase";
import type { SpotWithWork } from "@/types/database";

interface GetSpotsOptions {
  prefecture?: string;
  city?: string;
  search?: string;
  limit?: number;
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
