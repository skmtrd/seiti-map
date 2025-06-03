"use client";

import { createSpot } from "@/app/actions/spot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Work } from "@/types/database";
import { useState } from "react";

interface CreateSpotFormProps {
  works: Work[];
}

export function CreateSpotForm({ works }: CreateSpotFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const spotData = {
        work_id: formData.get("work_id") as string,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        latitude: Number(formData.get("latitude")),
        longitude: Number(formData.get("longitude")),
        prefecture: formData.get("prefecture") as string,
        city: formData.get("city") as string,
        address: formData.get("address") as string,
      };

      const result = await createSpot(spotData);

      if (result.success) {
        setMessage({ type: "success", text: "スポットが正常に作成されました！" });
        // フォームをリセット
        const form = document.getElementById("spot-form") as HTMLFormElement;
        form?.reset();
      } else {
        setMessage({ type: "error", text: result.error || "エラーが発生しました" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "予期しないエラーが発生しました" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>スポット情報</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="spot-form" action={handleSubmit} className="space-y-6">
          {/* 作品選択 */}
          <div>
            <label htmlFor="work_id" className="block text-sm font-medium mb-2">
              作品 *
            </label>
            <select
              id="work_id"
              name="work_id"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">作品を選択してください</option>
              {works.map((work) => (
                <option key={work.id} value={work.id}>
                  {work.title} ({work.type})
                </option>
              ))}
            </select>
          </div>

          {/* スポット名 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              スポット名 *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例: 東京駅"
            />
          </div>

          {/* 説明 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              説明
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="このスポットについて説明してください"
            />
          </div>

          {/* 位置情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium mb-2">
                緯度 *
              </label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                step="any"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="35.6762"
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium mb-2">
                経度 *
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                step="any"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="139.6503"
              />
            </div>
          </div>

          {/* 住所情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="prefecture" className="block text-sm font-medium mb-2">
                都道府県 *
              </label>
              <input
                type="text"
                id="prefecture"
                name="prefecture"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="東京都"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">
                市区町村 *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="千代田区"
              />
            </div>
          </div>

          {/* 住所 */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-2">
              住所
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="東京都千代田区丸の内1丁目"
            />
          </div>

          {/* メッセージ表示 */}
          {message && (
            <div
              className={`p-4 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* 送信ボタン */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "投稿中..." : "スポットを投稿"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
