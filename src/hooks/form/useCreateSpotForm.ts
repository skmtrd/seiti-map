"use client";

import { createSpot, updateSpot } from "@/actions/spot";
import { parseGoogleMapsUrl } from "@/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import z from "zod";
import { createWorksKey } from "../SWR/getWorks";

export const useCreateSpotForm = () => {
  const router = useRouter();

  const [isUrlParsing, setIsUrlParsing] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [urlParseError, setUrlParseError] = useState<string | null>(null);
  const [urlParseStatus, setUrlParseStatus] = useState<string>("");

  const handleMapsUrlParse = async () => {
    if (!form.watch("mapsUrl")?.trim()) {
      setUrlParseError("Google Maps URLを入力してください");
      return;
    }

    setIsUrlParsing(true);
    setUrlParseError(null);
    setUrlParseStatus("Google Maps URLを解析中...");

    try {
      const result = await parseGoogleMapsUrl(form.watch("mapsUrl") || "");

      console.log(result);

      if (result.success && result.coordinates) {
        const { latitude, longitude } = result.coordinates;

        form.setValue("latitude", latitude.toString(), { shouldValidate: true });
        form.setValue("longitude", longitude.toString(), { shouldValidate: true });
        form.setValue("mapsUrl", form.watch("mapsUrl"), { shouldValidate: true });

        if (result.address) {
          form.setValue("address", result.address, { shouldValidate: true });
        }
        // フォーム全体のバリデーションを再実行
        form.trigger();

        setShowMap(true);
        setUrlParseError(null);
        setUrlParseStatus("URL解析完了 - 座標と住所を取得しました");
      } else {
        setUrlParseError(result.error || "Google Maps URLから座標を抽出できませんでした。");
        setUrlParseStatus("");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setUrlParseError(`URL解析中にエラーが発生しました: ${errorMessage}`);
      setUrlParseStatus("");
    } finally {
      setIsUrlParsing(false);
    }
  };

  const formSchema = z.object({
    workId: z.string().min(1, { message: "作品を選択してください" }),
    name: z.string().min(1, { message: "聖地名を入力してください" }),
    description: z.string().min(1, { message: "説明を入力してください" }),
    address: z.string().optional(),
    mapsUrl: z.string().min(1, { message: "Google MapsのURLを入力してください" }),
    latitude: z.string(),
    longitude: z.string(),
    image: z.instanceof(File).optional(),
    // 新規作品作成
    newWorkTitle: z.string().optional(),
    newWorkType: z.string().optional(),
    newWorkDescription: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      workId: "",
      name: "",
      description: "",
      address: "",
      mapsUrl: "",
      latitude: "",
      longitude: "",
      image: undefined,
      newWorkTitle: "",
      newWorkType: "anime",
      newWorkDescription: "",
    },
  });

  const handleImageSelect = (file: File | null) => {
    if (file) {
      form.setValue("image", file);
    }
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);

    try {
      const submissionFormData = new FormData();

      // FormDataにStateの値を追加
      submissionFormData.set("work_id", data.workId);
      submissionFormData.set("name", data.name);
      submissionFormData.set("description", data.description);
      submissionFormData.set("latitude", data.latitude || "");
      submissionFormData.set("longitude", data.longitude || "");
      submissionFormData.set("address", data.address || "");
      submissionFormData.set("new_work_title", data.newWorkTitle || "");
      submissionFormData.set("new_work_type", data.newWorkType || "");
      submissionFormData.set("new_work_description", data.newWorkDescription || "");

      // 画像ファイルを追加
      if (data.image) {
        submissionFormData.set("image", data.image);
      }

      const result = await createSpot(submissionFormData);

      if (result.success) {
        form.reset();
        toast.success("聖地が作成されました");
        mutate(createWorksKey());
        router.push("/");
      } else {
        toast.error("聖地の作成に失敗しました");
      }
    } catch (error) {
      toast.error("予期しないエラーが発生しました");
    }
  }

  const isNewWork = form.watch("workId") === "new";

  return {
    form,
    onSubmit,
    handleImageSelect,
    handleMapsUrlParse,
    states: {
      isUrlParsing,
      showMap,
      urlParseError,
      urlParseStatus,
      isNewWork,
    },
  };
};
