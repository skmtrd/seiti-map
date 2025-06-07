"use client";

import { getWorks } from "@/actions/work";
import type { Work } from "@/types/database";
import useSWR from "swr";

// SWR用のキー生成関数
const createWorksKey = () => {
  const key = ["works"];
  return JSON.stringify(key);
};

// SWR用のfetcher関数
const worksWrapper = async (key: string): Promise<Work[]> => {
  return await getWorks();
};

// スポット一覧を取得するhook
export function useWorks() {
  const key = createWorksKey();

  const { data, error, isLoading, mutate } = useSWR(key, worksWrapper, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1分間のデデュープ
  });

  return {
    works: data || [],
    isLoading,
    isError: !!error,
    error: error?.message || null,
    mutate, // データを手動で再取得する関数
  };
}
