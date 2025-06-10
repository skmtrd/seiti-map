"use client";

import { getUser } from "@/actions/auth";
import useSWR from "swr";

// SWR用のキー生成関数
const createUserKey = () => {
  const key = ["user"];
  return JSON.stringify(key);
};

// SWR用のfetcher関数
const userWrapper = async (key: string) => {
  return await getUser();
};

// スポット一覧を取得するhook
export function useGetUser() {
  const key = createUserKey();

  const { data, error, isLoading, mutate } = useSWR(key, userWrapper, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1分間のデデュープ
  });

  return {
    user: data || null,
    isLoading,
    isError: !!error,
    error: error?.message || null,
    mutate, // データを手動で再取得する関数
  };
}
