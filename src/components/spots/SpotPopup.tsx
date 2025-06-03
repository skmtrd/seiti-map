"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SpotWithWork } from "@/types/database";
import { Film, Info, MapPin, X } from "lucide-react";
import { Popup } from "react-map-gl/maplibre";

interface SpotPopupProps {
  selectedSpot: SpotWithWork;
  onClose: () => void;
}

export function SpotPopup({ selectedSpot, onClose }: SpotPopupProps) {
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
      <Card className="w-80 border-0 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="mb-2 font-bold text-gray-900 text-lg">
                {selectedSpot.name}
              </CardTitle>

              {/* 作品情報の表示 */}
              {selectedSpot.works && (
                <div className="mb-3 p-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Film className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-800">
                      {selectedSpot.works.title}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${getWorkTypeBadgeColor(selectedSpot.works.type)} text-xs`}
                  >
                    {getWorkTypeLabel(selectedSpot.works.type)}
                  </Badge>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500">
                  {selectedSpot.prefecture} {selectedSpot.city}
                </span>
              </div>
              {selectedSpot.address && (
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedSpot.address}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={onClose}
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {selectedSpot.description && (
            <CardDescription className="text-gray-600 text-sm leading-relaxed mb-3">
              <Info className="mr-1 mb-1 inline h-4 w-4" />
              {selectedSpot.description}
            </CardDescription>
          )}
        </CardContent>
      </Card>
    </Popup>
  );
}
