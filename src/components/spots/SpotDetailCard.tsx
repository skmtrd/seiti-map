import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Spot } from "@/types/database";
import {
  Camera,
  Divide,
  ExternalLink,
  FileText,
  Landmark,
  Map as MapIcon,
  MapPin,
} from "lucide-react";
import Image from "next/image";

interface SpotDetailCardProps {
  spot: Spot;
}

export const SpotDetailCard: React.FC<SpotDetailCardProps> = ({ spot }) => {
  const getGoogleMapsUrl = () => {
    if (spot.latitude && spot.longitude) {
      return `https://maps.google.com/?q=${spot.latitude},${spot.longitude}`;
    }
    if (spot.address) {
      return `https://maps.google.com/?q=${encodeURIComponent(spot.address)}`;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            {spot.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 画像 */}
          {spot.image_url ? (
            <Image
              src={spot.image_url}
              alt={spot.name}
              width={1200}
              height={1200}
              className="rounded-lg"
            />
          ) : (
            <div className="h-64 w-full bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">画像がまだありません</p>
            </div>
          )}

          {/* 詳細説明 */}
          {spot.description && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="whitespace-pre-wrap">{spot.description}</p>
            </div>
          )}

          {/* 埋め込みマップ */}
          {(spot.latitude && spot.longitude) || spot.address ? (
            <div className="space-y-2">
              <Card className="p-0">
                <CardContent className="p-0">
                  <iframe
                    src={`https://maps.google.com/maps?q=${
                      spot.latitude && spot.longitude
                        ? `${spot.latitude},${spot.longitude}`
                        : encodeURIComponent(spot.address || "")
                    }&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="スポット位置"
                    className="rounded-t-lg"
                  />
                  <div className="p-4">
                    {getGoogleMapsUrl() && (
                      <Button asChild variant="default" className="w-full">
                        <a
                          href={getGoogleMapsUrl() || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Google Mapsで開く
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
