import { useEffect, useState } from "react";

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number; // 位置精度（メートル）
  heading?: number | null; // 向き（度、北を0として時計回り）
  speed?: number | null; // 移動速度（メートル/秒）
  altitude?: number | null; // 高度（メートル）
}

export const useGetUserLocation = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("位置情報がサポートされていません");
      return;
    }

    setIsLoadingLocation(true);

    // watchPositionでリアルタイム位置追跡
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { coords } = position;
        setUserLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          heading: coords.heading, // 向き（移動中のみ取得可能）
          speed: coords.speed, // 速度（移動中のみ取得可能）
          altitude: coords.altitude, // 高度（GPS使用時のみ取得可能）
        });
        setIsLoadingLocation(false);
        setLocationError(null);
      },
      (error) => {
        let errorMessage = "位置情報の取得に失敗しました";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "位置情報の使用が拒否されました";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "位置情報が利用できません";
            break;
          case error.TIMEOUT:
            errorMessage = "位置情報の取得がタイムアウトしました";
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true, // GPS使用で高精度・向き取得
        timeout: 15000, // 15秒タイムアウト
        maximumAge: 60000, // 1分間キャッシュ
      }
    );

    // クリーンアップ関数
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { userLocation, locationError, isLoadingLocation };
};
