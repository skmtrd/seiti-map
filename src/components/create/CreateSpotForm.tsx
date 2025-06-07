"use client";

import { createSpot } from "@/actions/spot";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseGoogleMapsUrl } from "@/functions";
import { useWorks } from "@/hooks/work/getWorks";
import { Camera, Check, FileText, Link, Loader2, MapPin, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { toast } from "sonner";

interface FormData {
  work_id: string;
  name: string;
  description: string;
  address: string;
  mapsUrl: string;
  latitude: string;
  longitude: string;
  image: File | null;
}

export function CreateSpotForm() {
  const { works, isLoading, isError, error, mutate } = useWorks();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isNewWork, setIsNewWork] = useState(false);
  const router = useRouter();

  // 新しい機能用のstate
  const [formData, setFormData] = useState<FormData>({
    work_id: "",
    name: "",
    description: "",
    address: "",
    mapsUrl: "",
    latitude: "",
    longitude: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUrlParsing, setIsUrlParsing] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [urlParseError, setUrlParseError] = useState<string | null>(null);
  const [urlParseStatus, setUrlParseStatus] = useState<string>("");
  const [extractedAddress, setExtractedAddress] = useState<string>("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "mapsUrl") {
      setUrlParseError(null);
      setUrlParseStatus("");
      setExtractedAddress("");
    }

    if (name === "work_id") {
      setIsNewWork(value === "new");
    }
  };

  const handleCoordinateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const updatedFormData = { ...formData, [name]: value };
    if (updatedFormData.latitude && updatedFormData.longitude) {
      setShowMap(true);
    }
  };

  const handleImageChange = (file: File | null) => {
    if (!file) return;

    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMapsUrlParse = async () => {
    if (!formData.mapsUrl.trim()) {
      setUrlParseError("Google Maps URLを入力してください");
      return;
    }

    setIsUrlParsing(true);
    setUrlParseError(null);
    setUrlParseStatus("Google Maps URLを解析中...");
    setExtractedAddress("");

    try {
      const result = await parseGoogleMapsUrl(formData.mapsUrl);

      if (result.success && result.coordinates) {
        const { latitude, longitude } = result.coordinates;

        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          address: result.address || prev.address,
        }));

        setShowMap(true);
        setUrlParseError(null);
        setUrlParseStatus("URL解析完了 - 座標と住所を取得しました");

        if (result.address) {
          setExtractedAddress(result.address);
        }
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const form = e.target as HTMLFormElement;
      const submissionFormData = new FormData(form);

      // FormDataにStateの値を追加
      submissionFormData.set("work_id", formData.work_id);
      submissionFormData.set("name", formData.name);
      submissionFormData.set("description", formData.description);
      submissionFormData.set("latitude", formData.latitude);
      submissionFormData.set("longitude", formData.longitude);
      submissionFormData.set("address", formData.address);

      // 画像ファイルを追加
      if (formData.image) {
        submissionFormData.set("image", formData.image);
      }

      const result = await createSpot(submissionFormData);

      if (result.success) {
        setMessage({ type: "success", text: "スポットが正常に作成されました！" });
        // フォームをリセット
        setFormData({
          work_id: "",
          name: "",
          description: "",
          address: "",
          mapsUrl: "",
          latitude: "",
          longitude: "",
          image: null,
        });
        setImagePreview(null);
        setIsNewWork(false);
        setShowMap(false);
        setUrlParseStatus("");
        setExtractedAddress("");
        // HTMLフォームもリセット
        form.reset();
      } else {
        setMessage({ type: "error", text: result.error || "エラーが発生しました" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "予期しないエラーが発生しました" });
    } finally {
      toast.success("聖地が作成されました");
      setIsSubmitting(false);
      router.push("/");
    }
  }

  const isFormValid =
    formData.work_id &&
    formData.name &&
    formData.description &&
    (formData.address || (formData.latitude && formData.longitude));

  const getMapQuery = () => {
    if (formData.latitude && formData.longitude) {
      return `${formData.latitude},${formData.longitude}`;
    }
    return encodeURIComponent(formData.address);
  };

  const shouldShowMap = showMap && (formData.address || (formData.latitude && formData.longitude));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            スポット情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 作品選択 */}
            <div>
              <label htmlFor="work_id" className="block text-sm font-medium mb-2">
                作品 *
              </label>
              <select
                id="work_id"
                name="work_id"
                value={formData.work_id}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">作品を選択してください</option>
                <option value="new" className="font-bold text-blue-600">
                  + 新しい作品を登録
                </option>
                {works.map((work) => (
                  <option key={work.id} value={work.id}>
                    {work.title} ({work.type})
                  </option>
                ))}
              </select>
            </div>

            {/* 新規作品作成フィールド */}
            {isNewWork && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium mb-4 text-blue-900">新しい作品の情報</h3>

                {/* 作品名 */}
                <div className="mb-4">
                  <label
                    htmlFor="new_work_title"
                    className="block text-sm font-medium mb-2 text-blue-800"
                  >
                    作品名 *
                  </label>
                  <input
                    type="text"
                    id="new_work_title"
                    name="new_work_title"
                    required={isNewWork}
                    className="w-full p-3 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 君の名は。"
                  />
                </div>

                {/* 作品タイプ */}
                <div className="mb-4">
                  <label
                    htmlFor="new_work_type"
                    className="block text-sm font-medium mb-2 text-blue-800"
                  >
                    作品の種類 *
                  </label>
                  <select
                    id="new_work_type"
                    name="new_work_type"
                    required={isNewWork}
                    className="w-full p-3 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">種類を選択してください</option>
                    <option value="anime">アニメ</option>
                    <option value="drama">ドラマ</option>
                    <option value="movie">映画</option>
                    <option value="game">ゲーム</option>
                    <option value="novel">小説</option>
                    <option value="manga">漫画</option>
                    <option value="other">その他</option>
                  </select>
                </div>

                {/* 作品説明（任意） */}
                <div className="mb-4">
                  <label
                    htmlFor="new_work_description"
                    className="block text-sm font-medium mb-2 text-blue-800"
                  >
                    作品の説明（任意）
                  </label>
                  <textarea
                    id="new_work_description"
                    name="new_work_description"
                    rows={3}
                    className="w-full p-3 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="作品についての簡単な説明"
                  />
                </div>

                {/* 公開年（任意） */}
                <div>
                  <label
                    htmlFor="new_work_year"
                    className="block text-sm font-medium mb-2 text-blue-800"
                  >
                    公開年（任意）
                  </label>
                  <input
                    type="number"
                    id="new_work_year"
                    name="new_work_year"
                    min="1900"
                    max={new Date().getFullYear() + 5}
                    className="w-full p-3 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 2016"
                  />
                </div>
              </div>
            )}

            {/* スポット名 */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                スポット名 *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="例：神社の鳥居、学校の屋上、東京駅など"
                required
              />
            </div>

            {/* 説明 */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                詳細説明 *
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="作品名、シーン、エピソードなどを詳しく教えてください"
                rows={4}
                required
              />
            </div>

            {/* Google Maps URL */}
            <div className="space-y-2">
              <Label htmlFor="mapsUrl" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                Google Maps URL *
                {isUrlParsing && (
                  <span className="flex items-center gap-1 text-green-600 text-sm">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    解析中...
                  </span>
                )}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="mapsUrl"
                  name="mapsUrl"
                  value={formData.mapsUrl}
                  onChange={handleInputChange}
                  placeholder="短縮URL: https://maps.app.goo.gl/xxx または 長いURL: https://www.google.com/maps/place/xxx"
                  className="flex-1"
                  required
                />
                <Button
                  type="button"
                  onClick={handleMapsUrlParse}
                  disabled={!formData.mapsUrl.trim() || isUrlParsing}
                  variant="outline"
                  className="shrink-0"
                >
                  {isUrlParsing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Link className="mr-1 h-4 w-4" />
                      URL解析
                    </>
                  )}
                </Button>
              </div>
              {urlParseStatus && <p className="text-blue-600 text-sm">{urlParseStatus}</p>}
              {extractedAddress && extractedAddress !== formData.address && (
                <p className="text-green-600 text-sm">抽出された住所: {extractedAddress}</p>
              )}
              {urlParseError && <p className="text-red-500 text-sm">{urlParseError}</p>}
              <div className="space-y-1 text-muted-foreground text-sm">
                <p>両方の形式に対応しています：</p>
                <p>• 短縮URL: スマホのGoogle Mapsから「共有」→「リンクをコピー」</p>
                <p>• 長いURL: PCのGoogle Mapsから場所のURLをコピー</p>
              </div>
            </div>

            {/* 住所 */}
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                住所 (任意)
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="例：東京都千代田区外神田2丁目16-2（URL解析で自動入力されます）"
                className="flex-1"
              />
            </div>

            {/* 位置情報 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  緯度
                </Label>
                <Input
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleCoordinateChange}
                  placeholder="35.681236"
                  readOnly
                  className="bg-gray-50"
                />
                <p className="text-muted-foreground text-xs">URL解析で自動入力</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  経度
                </Label>
                <Input
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleCoordinateChange}
                  placeholder="139.767125"
                  readOnly
                  className="bg-gray-50"
                />
                <p className="text-muted-foreground text-xs">URL解析で自動入力</p>
              </div>
            </div>

            {/* 位置プレビュー */}
            {shouldShowMap && (
              <div className="space-y-2">
                <Card className="p-0">
                  <CardContent className="p-0">
                    <iframe
                      src={`https://maps.google.com/maps?q=${getMapQuery()}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="位置プレビュー"
                      className="rounded-t-lg"
                    />
                    <div className="space-y-2 p-4">
                      <p className="text-muted-foreground text-xs">
                        <MapPin className="mr-1 inline h-3 w-3" />
                        <a
                          href={`https://maps.google.com/?q=${getMapQuery()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline hover:text-blue-700"
                        >
                          Google Mapsで開く
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 画像アップロード */}
            <ImageUpload
              onImageChange={handleImageChange}
              label="画像"
              placeholder="聖地の画像をアップロード"
              maxSize={5}
            />

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
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? "投稿中..." : "スポットを投稿"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-1 text-center text-muted-foreground text-sm">
        <p>* マークの付いた項目は必須です</p>
        <p>Google Maps URLから座標と住所を自動取得します</p>
        <p>登録された聖地は即座に公開されます</p>
      </div>
    </div>
  );
}
