"use client";

import { getCitiesByPrefecture, getPrefectures, getSpots } from "@/app/actions/spot";
import type { SpotWithWork } from "@/types/database";
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

const prefecturesWrapper = async (): Promise<string[]> => {
  return await getPrefectures();
};

const citiesWrapper = async (prefecture: string): Promise<string[]> => {
  return await getCitiesByPrefecture(prefecture);
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

// 都道府県一覧を取得するhook
export function usePrefectures() {
  const { data, error, isLoading, mutate } = useSWR("prefectures", prefecturesWrapper, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    // 都道府県は頻繁に変わらないので長時間キャッシュ
    dedupingInterval: 300000, // 5分間のデデュープ
  });

  return {
    prefectures: data || [],
    isLoading,
    isError: !!error,
    error: error?.message || null,
    mutate,
  };
}

// 指定した都道府県の市区町村一覧を取得するhook
export function useCitiesByPrefecture(prefecture: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    prefecture ? `cities-${prefecture}` : null,
    prefecture ? () => citiesWrapper(prefecture) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      // 市区町村も頻繁に変わらないので長時間キャッシュ
      dedupingInterval: 300000, // 5分間のデデュープ
    }
  );

  return {
    cities: data || [],
    isLoading,
    isError: !!error,
    error: error?.message || null,
    mutate,
  };
}

// 複数の都道府県の市区町村を一度に取得するhook
export function useMultipleCities(prefectures: string[]) {
  const results = prefectures.map((prefecture) => useCitiesByPrefecture(prefecture));

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);
  const errors = results.filter((result) => result.error).map((result) => result.error);

  const citiesByPrefecture = prefectures.reduce(
    (acc, prefecture, index) => {
      acc[prefecture] = results[index].cities;
      return acc;
    },
    {} as Record<string, string[]>
  );

  return {
    citiesByPrefecture,
    isLoading,
    isError,
    errors,
    mutate: () => {
      for (const result of results) {
        result.mutate();
      }
    },
  };
}
