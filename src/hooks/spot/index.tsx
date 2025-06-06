"use client";

import { getSpots, updateSpot } from "@/actions/spot";
import type { Spot, SpotWithWork } from "@/types/database";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

export const useSpotUpdate = (spot: Spot) => {
  interface formSchema {
    name: string;
    description: string;
    image: File | null;
  }
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const form = useForm<formSchema>({
    defaultValues: {
      name: spot.name,
      description: spot.description || undefined,
      image: null,
    },
  });

  const onSubmit = async (data: formSchema) => {
    try {
      const submissionFormData = new FormData();
      submissionFormData.set("name", data.name);
      submissionFormData.set("description", data.description || "");
      if (selectedImage) {
        submissionFormData.set("image", selectedImage);
      }
      const result = await updateSpot(spot.id, submissionFormData);
      if (result.success) toast.success("聖地の情報が更新されました！");
    } catch (error) {
      console.error("Error updating spot:", error);
      toast.error("更新に失敗しました");
    }
  };

  const handleEditButton = () => {
    if (isEditMode) {
      form.handleSubmit(onSubmit)();
    }
    setIsEditMode(!isEditMode);
  };

  const handleCancelButton = () => {
    setIsEditMode(false);
    form.reset();
    setPreviewUrl(null);
    setSelectedImage(null);
  };

  return {
    name: spot.name,
    description: spot.description,
    form,
    handleEditButton,
    handleImageSelect,
    previewUrl,
    selectedImage,
    isEditMode,
    handleCancelButton,
  };
};
