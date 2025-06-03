"use client";

import { useState } from "react";
import { Map as MapGL, Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { CreateSpotButton } from "@/components/map/CreateSpotButton";
import { SpotPopup } from "@/components/spots/SpotPopup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSpots } from "@/hooks/spot";
import type { SpotWithWork } from "@/types/database";
import { AlertCircle, Loader2, MapPin } from "lucide-react";

interface FilterOptions {
  prefecture?: string;
  city?: string;
  search?: string;
  limit?: number;
}

const RootPage = () => {
  const [selectedSpot, setSelectedSpot] = useState<SpotWithWork | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ limit: 50 });

  const { spots, isLoading, isError, error, mutate } = useSpots(filterOptions);

  // 日本語対応マップスタイルのオプション
  const mapStyles = {
    // OpenStreetMap Japan（無料・完全日本語対応）
    osmJapan: "https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json",

    // MapTiler（APIキー必要・多言語対応）
    // mapTilerJa: "https://api.maptiler.com/maps/streets/style.json?key=YOUR_API_KEY&language=ja",

    // 国土地理院ベクトルタイル（日本政府公式）
    // gsiJapan: "https://maps.gsi.go.jp/vector/style.json"
  };

  // 難易度レベルに応じた色を取得
  const getDifficultyColor = (level: number) => {
    if (level <= 2) return "bg-green-500 hover:bg-green-600";
    if (level <= 3) return "bg-yellow-500 hover:bg-yellow-600";
    if (level <= 4) return "bg-orange-500 hover:bg-orange-600";
    return "bg-red-500 hover:bg-red-600";
  };

  const getDifficultyLabel = (level: number) => {
    if (level <= 2) return "易しい";
    if (level <= 3) return "普通";
    if (level <= 4) return "難しい";
    return "非常に難しい";
  };

  // デフォルトの表示位置（日本の中心付近）
  const defaultViewState = {
    longitude: 139.6917, // 東京の経度
    latitude: 35.6895, // 東京の緯度
    zoom: spots.length > 0 ? 8 : 5, // スポットがある場合はズームイン
  };

  // フィルター変更ハンドラー
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
  };

  // エラー状態の表示
  if (isError) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-6 w-6" />
                エラーが発生しました
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{error || "スポットの読み込みに失敗しました"}</p>
              <Button onClick={() => mutate()} variant="outline" className="w-full">
                再試行
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* メインマップエリア */}
      <div className="flex-1 relative">
        {/* Popup のデフォルトスタイルをオーバーライド */}
        <style>{`
          .maplibregl-popup-content {
            background: transparent !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
            max-width: none !important;
          }
          .maplibregl-popup-tip {
            display: none !important;
          }
          .maplibregl-popup-close-button {
            display: none !important;
          }
        `}</style>

        {/* ローディング表示 */}
        {isLoading && (
          <div className="absolute top-4 right-4 z-10">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">スポットを読み込み中...</span>
              </div>
            </Card>
          </div>
        )}

        <MapGL
          initialViewState={defaultViewState}
          style={{ width: "100%", height: "100%" }}
          mapStyle={mapStyles.osmJapan}
          onClick={() => setSelectedSpot(null)}
        >
          {spots.map((spot) => (
            <Marker
              key={spot.id}
              longitude={spot.longitude}
              latitude={spot.latitude}
              anchor="bottom"
            >
              <Button
                variant="default"
                size="sm"
                className="bg-green-500 hover:bg-green-600 h-10 w-10 rounded-full border-2 border-white p-0 shadow-lg transition-all duration-200 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSpot(spot);
                }}
              >
                <MapPin className="h-5 w-5 text-white" />
              </Button>
            </Marker>
          ))}

          {selectedSpot && (
            <SpotPopup selectedSpot={selectedSpot} onClose={() => setSelectedSpot(null)} />
          )}
        </MapGL>

        {/* 新規スポット作成ボタン */}
        <CreateSpotButton />
      </div>
    </div>
  );
};

export default RootPage;
