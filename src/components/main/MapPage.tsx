"use client";

import { useMemo } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSpotsWithQuery } from "@/hooks/SWR/useSpots";
import { useGetUserLocation } from "@/hooks/main/getUserLocation";
import { AlertCircle } from "lucide-react";
import { MainMap } from "../main/MainMap";

interface MapPageProps {
  lat: string;
  lng: string;
  openSpotId: string;
}

export const MapPage: React.FC<MapPageProps> = (props) => {
  const { userLocation, locationError, isLoadingLocation } = useGetUserLocation();
  const { spots, isError, error, mutate } = useSpotsWithQuery();

  console.log(spots);

  // デフォルトの表示位置（現在位置があればそれを使用、なければ東京）
  const defaultViewState = useMemo(() => {
    if (props.lat && props.lng) {
      return {
        longitude: Number.parseFloat(props.lng),
        latitude: Number.parseFloat(props.lat),
        zoom: 16,
      };
    }
    return {
      longitude: 139.6917,
      latitude: 35.6895,
      zoom: 10,
    };
  }, [props.lat, props.lng]);

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
      <MainMap
        initialMapState={defaultViewState}
        userLocation={userLocation}
        spots={spots}
        openSpotId={props.openSpotId}
      />
    </div>
  );
};
