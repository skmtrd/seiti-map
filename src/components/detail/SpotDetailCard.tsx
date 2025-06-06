"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useSpotUpdateForm } from "@/hooks/detail/useSpotUpdateForm";
import type { Spot } from "@/types/database";
import { ExternalLink, FileText, Landmark, Upload, X } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface SpotDetailCardProps {
  spot: Spot;
}

export const SpotDetailCard: React.FC<SpotDetailCardProps> = ({ spot }) => {
  const {
    form,
    handleEditButton,
    handleImageSelect,
    previewUrl,
    isEditMode,
    selectedImage,
    handleCancelButton,
  } = useSpotUpdateForm(spot);

  const getGoogleMapsUrl = () => {
    if (spot.latitude && spot.longitude) {
      return `https://maps.google.com/?q=${spot.latitude},${spot.longitude}`;
    }
    if (spot.address) {
      return `https://maps.google.com/?q=${encodeURIComponent(spot.address)}`;
    }
    return null;
  };

  const currentImageUrl = previewUrl || spot.image_url;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center w-full">
              {!isEditMode && (
                <>
                  <Landmark className="h-5 w-5" />
                  {spot.name}
                </>
              )}
            </CardTitle>

            <div className="flex items-center">
              {isEditMode && (
                <Button size="smIcon" variant="ghost" onClick={handleCancelButton}>
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant={isEditMode ? "default" : "outline"}
                onClick={() => {
                  handleEditButton();
                }}
              >
                {isEditMode ? "保存" : "編集"}
              </Button>
            </div>
          </div>
          {isEditMode && (
            <div className="space-y-2 w-full">
              <Label htmlFor="name" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                スポット名
              </Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="例：神社の鳥居、学校の屋上、東京駅など"
                required
                className="w-full"
              />
            </div>
          )}
        </CardHeader>
        {/* スポット名編集 */}

        <CardContent className="space-y-6">
          {/* 画像 */}
          <div className="space-y-2">
            {currentImageUrl ? (
              <Image
                src={currentImageUrl}
                alt={spot.name}
                width={1200}
                height={1200}
                className="rounded-lg"
              />
            ) : (
              <div className="h-64 w-full bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">画像がまだありません</p>
              </div>
            )}

            {isEditMode && (
              <div className="flex items-center w-full justify-end gap-2">
                {selectedImage && (
                  <p className="text-sm text-gray-600">選択済み: {selectedImage.name}</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image-upload")?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  画像を変更
                </Button>
              </div>
            )}
          </div>

          {/* 詳細説明 */}
          {spot.description && (
            // biome-ignore lint/complexity/noUselessFragments: <explanation>
            <>
              {isEditMode ? (
                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    詳細
                  </Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="作品名、シーン、エピソードなどを詳しく教えてください"
                    rows={4}
                    required
                  />
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="whitespace-pre-wrap">{spot.description}</p>
                </div>
              )}
            </>
          )}

          {/* 埋め込みマップ */}
          {(spot.latitude && spot.longitude) || spot.address ? (
            <div className="space-y-2">
              <Card className="p-0">
                <CardContent className="p-0">
                  <iframe
                    src={`https://maps.google.com/maps?q=${
                      spot.latitude && spot.longitude
                        ? `${spot.latitude},${spot.longitude}`
                        : encodeURIComponent(spot.address || "")
                    }&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="スポット位置"
                    className="rounded-t-lg"
                  />
                  <div className="p-4">
                    {getGoogleMapsUrl() && (
                      <Button asChild variant="default" className="w-full">
                        <a
                          href={getGoogleMapsUrl() || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Google Mapsで開く
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
