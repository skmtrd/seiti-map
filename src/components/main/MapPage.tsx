"use client";

import { useMemo } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { CreateSpotButton } from "@/components/main/CreateSpotButton";
import { UserMenu } from "@/components/main/UserMenu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUserLocation } from "@/hooks/main/getUserLocation";
import { useSpotsWithQuery } from "@/hooks/spot/useSpots";
import { AlertCircle, Loader2, MapPin, Navigation } from "lucide-react";
import { MainMap } from "../main/MainMap";

interface MapPageProps {
  userAuthenticated: boolean;
}

export function MapPage(props: MapPageProps) {
  const { userLocation, locationError, isLoadingLocation } = useGetUserLocation();
  const { spots, isError, error, mutate } = useSpotsWithQuery();

  // デフォルトの表示位置（現在位置があればそれを使用、なければ東京）
  const defaultViewState = useMemo(() => {
    if (userLocation) {
      return {
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
        zoom: 12,
      };
    }
    return {
      longitude: 139.6917, // 東京の経度
      latitude: 35.6895, // 東京の緯度
      zoom: 10,
    };
  }, [userLocation]);

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
      <MainMap initialMapState={defaultViewState} userLocation={userLocation} spots={spots} />
      {/* 浮遊配置系ボタン */}
      <CreateSpotButton />
      <UserMenu userAuthenticated={props.userAuthenticated} />
    </div>
  );
}
