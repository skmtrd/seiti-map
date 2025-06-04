"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { usePreventScroll } from "@/hooks/usePreventScroll";
import type { SpotWithWork } from "@/types/database";
import { Film, Landmark, MapPin } from "lucide-react";
import Image from "next/image";
import { Popup } from "react-map-gl/maplibre";
import { Spacer } from "../common/Spacer";

interface SpotPopupProps {
  selectedSpot: SpotWithWork;
  onClose: () => void;
}

export function SpotPopup({ selectedSpot, onClose }: SpotPopupProps) {
  // カスタムフックでスクロール無効化
  const popupRef = usePreventScroll<HTMLDivElement>({
    wheel: true,
    touch: true,
    keyboard: false, // キーボードスクロールは許可
  });

  // 難易度レベルに応じた色を取得
  const getDifficultyBadgeColor = (level: number) => {
    if (level <= 2) return "bg-green-100 text-green-800 hover:bg-green-200";
    if (level <= 3) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    if (level <= 4) return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    return "bg-red-100 text-red-800 hover:bg-red-200";
  };

  const getDifficultyLabel = (level: number) => {
    if (level <= 2) return "易しい";
    if (level <= 3) return "普通";
    if (level <= 4) return "難しい";
    return "非常に難しい";
  };

  // 作品タイプに応じた色を取得
  const getWorkTypeBadgeColor = (type: string) => {
    switch (type) {
      case "anime":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "manga":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "game":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "movie":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "novel":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "live_action":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getWorkTypeLabel = (type: string) => {
    switch (type) {
      case "anime":
        return "アニメ";
      case "manga":
        return "マンガ";
      case "game":
        return "ゲーム";
      case "movie":
        return "映画";
      case "novel":
        return "小説";
      case "live_action":
        return "実写";
      default:
        return type;
    }
  };

  // Google MapsのURLを生成
  const getGoogleMapsUrl = () => {
    if (selectedSpot.latitude && selectedSpot.longitude) {
      return `https://maps.google.com/?q=${selectedSpot.latitude},${selectedSpot.longitude}`;
    }
    if (selectedSpot.address) {
      return `https://maps.google.com/?q=${encodeURIComponent(selectedSpot.address)}`;
    }
    return "https://maps.google.com";
  };

  return (
    <Popup
      longitude={selectedSpot.longitude}
      latitude={selectedSpot.latitude}
      anchor="top"
      onClose={onClose}
      closeButton={false}
      closeOnClick={false}
      offset={[0, -10]}
    >
      <Card
        ref={popupRef}
        className="w-52 sm:w-96 border-0 shadow-xl select-none p-4 sm:p-6"
        style={{ touchAction: "none" }}
      >
        <CardHeader className="p-0">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            <CardTitle className="font-bold text-gray-900 text-sm sm:text-lg">
              {selectedSpot.name}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* 作品情報の表示 */}
          {selectedSpot.works && (
            <div className="flex gap-2 flex-col">
              <Badge
                variant="secondary"
                className={`${getWorkTypeBadgeColor(selectedSpot.works.type)} text-xs`}
              >
                {getWorkTypeLabel(selectedSpot.works.type)}
              </Badge>
              <div className="p-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Film className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-800">
                    {selectedSpot.works.title}
                  </span>
                </div>
              </div>
            </div>
          )}
          {/* 画像表示セクション */}
          {selectedSpot.image_url && (
            <>
              <Spacer height={4} />
              <div className="rounded-lg overflow-hidden">
                <Image
                  src={selectedSpot.image_url}
                  alt="投稿画像"
                  width={1200}
                  height={1200}
                  className="w-full"
                />
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="p-0">
          <Button
            asChild
            variant="default"
            className="w-full flex items-center justify-center gap-2 text-base"
          >
            <a href={getGoogleMapsUrl()} target="_blank" rel="noopener noreferrer">
              <MapPin className="h-5 w-5 text-white drop-shadow-sm" />
              <span className="tracking-wide">Google Map</span>
            </a>
          </Button>
        </CardFooter>
      </Card>
    </Popup>
  );
}
