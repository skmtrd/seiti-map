"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getGoogleMapsUrl } from "@/functions/formatter";
import { usePreventScroll } from "@/hooks/common/usePreventScroll";
import type { SpotWithWork } from "@/types/database";
import { Film, Landmark, MapPin } from "lucide-react";
import Link from "next/link";
import { Popup } from "react-map-gl/maplibre";
import { ImageEx } from "../common/ImageEx";
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

  return (
    <Popup
      longitude={selectedSpot.longitude}
      latitude={selectedSpot.latitude}
      anchor="top"
      onClose={onClose}
      closeButton={false}
      closeOnClick={false}
      offset={[0, -10]}
      style={{ zIndex: 10 }}
    >
      <Card
        ref={popupRef}
        className="w-52 select-none border-0 p-4 shadow-xl sm:w-96 sm:p-6"
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
            <div className="flex flex-col gap-2">
              <Badge
                variant="secondary"
                className={`${getWorkTypeBadgeColor(selectedSpot.works.type)} text-xs`}
              >
                {getWorkTypeLabel(selectedSpot.works.type)}
              </Badge>
              <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-2">
                <div className="flex items-center gap-2">
                  <Film className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium text-indigo-800 text-sm">
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
              <div className="overflow-hidden rounded-lg">
                <ImageEx
                  src={selectedSpot.image_url}
                  alt="投稿画像"
                  width={1200}
                  height={1200}
                  className="w-full"
                  expandable={false}
                />
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="p-0">
          <div className="flex w-full flex-col items-center justify-center gap-2 sm:flex-row">
            <Button
              asChild
              variant="default"
              className="flex w-full items-center justify-center gap-2 text-base sm:w-1/2"
            >
              <a
                href={getGoogleMapsUrl(
                  selectedSpot.latitude,
                  selectedSpot.longitude,
                  selectedSpot.address || ""
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="h-5 w-5 text-white drop-shadow-sm" />
                <span className="tracking-wide">Google Map</span>
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex w-full items-center justify-center gap-2 text-base sm:w-1/2"
            >
              <Link
                href={`/spot/${selectedSpot.id}?lat=${selectedSpot.latitude}&lng=${selectedSpot.longitude}`}
                rel="noopener noreferrer"
              >
                <span className="tracking-wide">詳細</span>
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Popup>
  );
}
