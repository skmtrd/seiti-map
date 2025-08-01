"use client";

import { useEffect, useState } from "react";
import { Map as MapGL, Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { SpotPopup } from "@/components/main/SpotPopup";
import { Button } from "@/components/ui/button";
import type { UserLocation } from "@/hooks/main/getUserLocation";
import type { SpotWithWork } from "@/types/database";
import { MapPin } from "lucide-react";

interface MainMapProps {
  initialMapState: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  userLocation: UserLocation | null;
  spots: SpotWithWork[];
  openSpotId: string;
}

export const MainMap: React.FC<MainMapProps> = (props) => {
  const [selectedSpot, setSelectedSpot] = useState<SpotWithWork | null>(null);

  const mapStyles = {
    // OpenStreetMap Japan（無料・完全日本語対応）
    osmJapan: "https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json",

    // OpenStreetMap 英語版（無料）
    osmBrightEn: "https://tile.openstreetmap.jp/styles/osm-bright-en/style.json",

    // OpenStreetMap トナー（モノクロ・無料）
    osmToner: "https://tile.openstreetmap.jp/styles/maptiler-toner-ja/style.json",

    // OpenStreetMap ベーシック（シンプル・無料）
    osmBasic: "https://tile.openstreetmap.jp/styles/maptiler-basic-ja/style.json",

    // MapTiler（APIキー必要・多言語対応）
    // mapTilerJa: "https://api.maptiler.com/maps/streets/style.json?key=YOUR_API_KEY&language=ja",

    // Protomaps（無料・オープンソース）
    protomapsLight: "https://api.protomaps.com/styles/v2/light.json",
  };

  useEffect(() => {
    if (props.openSpotId) {
      setSelectedSpot(props.spots.find((spot) => spot.id === props.openSpotId) || null);
    }
  }, [props.openSpotId, props.spots]);

  return (
    <div className="relative flex-1">
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
        initialViewState={props.initialMapState}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyles.osmJapan}
        onClick={() => setSelectedSpot(null)}
      >
        {/* 現在位置のマーカー */}
        {props.userLocation && (
          <Marker
            style={{ zIndex: 10 }}
            longitude={props.userLocation.longitude}
            latitude={props.userLocation.latitude}
            anchor="center"
          >
            <div className="relative">
              {/* メインの位置マーカー */}
              <div className="flex h-8 w-8 flex-col items-center justify-center rounded-full border-2 border-blue-500 bg-white shadow-lg">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
              </div>
            </div>
          </Marker>
        )}

        {/* スポットのマーカー */}
        {props.spots.map((spot) => (
          <Marker
            key={spot.id}
            longitude={spot.longitude}
            latitude={spot.latitude}
            anchor="bottom"
            style={{ zIndex: 9 }}
          >
            <Button
              variant="default"
              size="sm"
              className="h-10 w-10 rounded-full border-2 border-white bg-green-500 p-0 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-green-600"
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
    </div>
  );
};
