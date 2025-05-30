"use client";

import { useState } from "react";
import { Map as MapGL, Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, MapPin, X } from "lucide-react";

interface Spot {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  description: string;
  category: string;
}

const Home = () => {
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  // 日本語対応マップスタイルのオプション
  const mapStyles = {
    // OpenStreetMap Japan（無料・完全日本語対応）
    osmJapan: "https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json",

    // MapTiler（APIキー必要・多言語対応）
    // mapTilerJa: "https://api.maptiler.com/maps/streets/style.json?key=YOUR_API_KEY&language=ja",

    // 国土地理院ベクトルタイル（日本政府公式）
    // gsiJapan: "https://maps.gsi.go.jp/vector/style.json"
  };

  // 東京の主要観光地
  const tokyoSpots = [
    {
      id: 1,
      name: "東京タワー",
      longitude: 139.7454,
      latitude: 35.6586,
      description: "東京のシンボル的なタワー。333mの高さを誇る赤い電波塔。",
      category: "ランドマーク",
    },
    {
      id: 2,
      name: "東京スカイツリー",
      longitude: 139.8107,
      latitude: 35.7101,
      description: "世界一高い自立式電波塔。634mの高さから東京を一望できる。",
      category: "ランドマーク",
    },
    {
      id: 3,
      name: "浅草寺（雷門）",
      longitude: 139.7967,
      latitude: 35.7148,
      description: "東京最古の寺院。雷門の大きな提灯が有名な観光スポット。",
      category: "寺院・神社",
    },
    {
      id: 4,
      name: "渋谷スクランブル交差点",
      longitude: 139.7016,
      latitude: 35.6598,
      description: "世界で最も有名な交差点。多くの人が行き交う東京の象徴。",
      category: "街・エリア",
    },
    {
      id: 5,
      name: "皇居",
      longitude: 139.7528,
      latitude: 35.6852,
      description: "天皇陛下のお住まい。美しい庭園と歴史ある建物群。",
      category: "歴史・文化",
    },
    {
      id: 6,
      name: "明治神宮",
      longitude: 139.6993,
      latitude: 35.6764,
      description: "明治天皇を祀る神社。都心にありながら豊かな森に囲まれている。",
      category: "寺院・神社",
    },
    {
      id: 7,
      name: "お台場海浜公園",
      longitude: 139.7717,
      latitude: 35.6297,
      description: "東京湾に面した人工島。レインボーブリッジと自由の女神像が見える。",
      category: "公園・自然",
    },
    {
      id: 8,
      name: "新宿都庁",
      longitude: 139.6917,
      latitude: 35.6896,
      description: "東京都の本庁舎。45階の展望室から東京を無料で一望できる。",
      category: "ランドマーク",
    },
    {
      id: 9,
      name: "銀座",
      longitude: 139.7671,
      latitude: 35.6712,
      description: "日本を代表する高級商業地区。ブランドショップやデパートが立ち並ぶ。",
      category: "街・エリア",
    },
    {
      id: 10,
      name: "上野動物園",
      longitude: 139.7712,
      latitude: 35.7167,
      description: "日本最古の動物園。パンダで有名な上野恩賜動物園。",
      category: "動物園・水族館",
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ランドマーク":
        return "bg-red-500 hover:bg-red-600";
      case "寺院・神社":
        return "bg-purple-500 hover:bg-purple-600";
      case "街・エリア":
        return "bg-blue-500 hover:bg-blue-600";
      case "歴史・文化":
        return "bg-amber-500 hover:bg-amber-600";
      case "公園・自然":
        return "bg-green-500 hover:bg-green-600";
      case "動物園・水族館":
        return "bg-orange-500 hover:bg-orange-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "ランドマーク":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "寺院・神社":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "街・エリア":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "歴史・文化":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "公園・自然":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "動物園・水族館":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
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

      <MapGL
        initialViewState={{
          longitude: 139.6917, // 東京の経度
          latitude: 35.6895, // 東京の緯度
          zoom: 10,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyles.osmJapan}
        onClick={() => setSelectedSpot(null)}
      >
        {tokyoSpots.map((spot) => (
          <Marker key={spot.id} longitude={spot.longitude} latitude={spot.latitude} anchor="bottom">
            <Button
              variant="default"
              size="sm"
              className={`${getCategoryColor(spot.category)} h-10 w-10 rounded-full border-2 border-white p-0 shadow-lg transition-all duration-200 hover:scale-110`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSpot(spot);
              }}
              title={spot.name}
            >
              <MapPin className="h-5 w-5 text-white" />
            </Button>
          </Marker>
        ))}

        {selectedSpot && (
          <Popup
            longitude={selectedSpot.longitude}
            latitude={selectedSpot.latitude}
            anchor="top"
            onClose={() => setSelectedSpot(null)}
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
                    <Badge
                      variant="secondary"
                      className={`${getCategoryBadgeColor(selectedSpot.category)} font-medium text-xs`}
                    >
                      {selectedSpot.category}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                    onClick={() => setSelectedSpot(null)}
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-gray-600 text-sm leading-relaxed">
                  <Info className="mr-1 mb-1 inline h-4 w-4" />
                  {selectedSpot.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Popup>
        )}
      </MapGL>
    </div>
  );
};

export default Home;
