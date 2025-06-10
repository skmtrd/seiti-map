"use client";

import { getSpotDetail } from "@/actions/spot";
import type { Spot } from "@/types/database";
import useSWR from "swr";

// SWR用のキー生成関数
export const createSpotDetailKey = (spotId: string) => {
  const key = ["spotDetail", spotId];
  return JSON.stringify(key);
};

// SWR用のfetcher関数
const spotDetailWrapper = async (key: string): Promise<Spot> => {
  const [, spotId] = JSON.parse(key);
  return await getSpotDetail(spotId);
};

// スポット一覧を取得するhook
export function useSpotDetail(spotId: string) {
  const key = createSpotDetailKey(spotId);

  const { data, error, isLoading, mutate } = useSWR(key, spotDetailWrapper, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1分間のデデュープ
  });

  return {
    spot: data || null,
    isLoading,
    isError: !!error,
    error: error?.message || null,
    mutate, // データを手動で再取得する関数
  };
}
