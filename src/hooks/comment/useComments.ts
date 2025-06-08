"use client";

import { getComments } from "@/actions/comments";
import type { Comment } from "@/types/database";
import useSWR from "swr";

// SWR用のキー生成関数
export const createCommentsKey = (spotId: string) => {
  const key = ["comments", spotId];
  return JSON.stringify(key);
};

// SWR用のfetcher関数
const commentsWrapper = async (key: string): Promise<Comment[]> => {
  const [, spotId] = JSON.parse(key);
  return await getComments({ spotId });
};

// スポット一覧を取得するhook
export function useComments(spotId: string) {
  const key = createCommentsKey(spotId);

  const { data, error, isLoading, mutate } = useSWR(key, commentsWrapper, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1分間のデデュープ
  });

  return {
    comments: data || null,
    isLoading,
    isError: !!error,
    error: error?.message || null,
    mutate, // データを手動で再取得する関数
  };
}
