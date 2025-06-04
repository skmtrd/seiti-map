"use client";

import { getSpots } from "@/app/actions/spot";
import type { SpotWithWork } from "@/types/database";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";

interface GetSpotsOptions {
  prefecture?: string;
  city?: string;
  search?: string;
  limit?: number;
  workIds?: string[]; // 作品IDの配列で絞り込み
}

// SWR用のキー生成関数
const createSpotsKey = (options: GetSpotsOptions = {}) => {
  const key = ["spots", options];
  return JSON.stringify(key);
};

// SWR用のfetcher関数
const spotsWrapper = async (key: string): Promise<SpotWithWork[]> => {
  const [, options] = JSON.parse(key);
  return await getSpots(options);
};

// スポット一覧を取得するhook
export function useSpots(options: GetSpotsOptions = {}) {
  const key = createSpotsKey(options);

  const { data, error, isLoading, mutate } = useSWR(key, spotsWrapper, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1分間のデデュープ
  });

  return {
    spots: data || [],
    isLoading,
    isError: !!error,
    error: error?.message || null,
    mutate, // データを手動で再取得する関数
  };
}

export const useSpotsWithQuery = () => {
  const searchParams = useSearchParams();
  // URLクエリパラメータからworksを取得してworkIdsに変換
  const workIdsFromUrl = useMemo(() => {
    const worksParam = searchParams.get("works");
    if (!worksParam) return undefined;

    // カンマ区切りで分割し、空文字列を除外
    return worksParam.split(",").filter((id) => id.trim().length > 0);
  }, [searchParams]);

  const { spots, isError, error, mutate } = useSpots({ workIds: workIdsFromUrl });

  return { spots, isError, error, mutate };
};
