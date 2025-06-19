"use client";

import { updateSpot } from "@/actions/spot";
import type { Spot } from "@/types/database";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import z from "zod";
import { createSpotDetailKey } from "../SWR/useSpotDetail";

export const useSpotUpdateForm = (spot: Spot | null, spotId: string) => {
  const formSchema = z.object({
    name: z.string().min(1, { message: "聖地名を入力してください" }),
    description: z.string().optional(),
    image: z.instanceof(File).optional(),
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue("image", file);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: spot?.name || "",
      description: spot?.description || "",
      image: undefined,
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (spot) {
      form.reset({
        name: spot.name,
        description: spot.description || undefined,
      });
    }
  }, [spot]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const submissionFormData = new FormData();
      submissionFormData.set("name", data.name);
      submissionFormData.set("description", data.description || "");
      if (data.image) {
        submissionFormData.set("image", data.image);
      }
      const result = await updateSpot(spot?.id || "", submissionFormData);
      if (result.success) toast.success("聖地の情報が更新されました！");
    } catch (error) {
      console.error("Error updating spot:", error);
      toast.error("更新に失敗しました");
    } finally {
      mutate(createSpotDetailKey(spotId));
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
    form.reset();
  };

  return {
    name: spot?.name || "",
    description: spot?.description || "",
    form,
    handleEditButton,
    handleImageSelect,
    previewUrl,
    isEditMode,
    handleCancelButton,
  };
};
