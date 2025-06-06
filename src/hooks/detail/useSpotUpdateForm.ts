"use client";

import { updateSpot } from "@/actions/spot";
import type { Spot } from "@/types/database";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useSpotUpdateForm = (spot: Spot) => {
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
