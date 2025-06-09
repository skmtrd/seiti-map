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

    // MapTiler（APIキー必要・多言語対応）
    // mapTilerJa: "https://api.maptiler.com/maps/streets/style.json?key=YOUR_API_KEY&language=ja",

    // 国土地理院ベクトルタイル（日本政府公式）
    // gsiJapan: "https://maps.gsi.go.jp/vector/style.json"
  };

  useEffect(() => {
    if (props.openSpotId) {
      setSelectedSpot(props.spots.find((spot) => spot.id === props.openSpotId) || null);
    }
  }, [props.openSpotId, props.spots]);

  return (
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
              <div className="flex flex-col items-center justify-center bg-white rounded-full w-8 h-8 shadow-lg border-2 border-blue-500">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
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
    </div>
  );
};
