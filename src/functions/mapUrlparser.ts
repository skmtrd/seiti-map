import { fetchUrl } from "@/actions/common";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface ParseResult {
  success: boolean;
  coordinates?: Coordinates;
  error?: string;
  address?: string;
  urlType?: "short" | "long";
}

const COORDINATE_PATTERNS = {
  jsArray: /\[null,null,([0-9]+\.[0-9]+),([0-9]+\.[0-9]+)\]/g,
  jsonLocation: /"location":\{"lat":([0-9]+\.[0-9]+),"lng":([0-9]+\.[0-9]+)\}/g,
  basicPair: /([0-9]{2}\.[0-9]+),([0-9]{3}\.[0-9]+)/g,
};

const ADDRESS_PATTERNS = [
  /〒[0-9-]+\s*([^"]+)/,
  /"formatted_address":"([^"]+)"/,
  /address":"([^"]+)"/,
];

const ERROR_MESSAGES: Record<string, string> = {
  "408": "リクエストがタイムアウトしました。時間をおいて再度お試しください。",
  "429": "アクセス制限に達しました。しばらく待ってから再度お試しください。",
  "403": "アクセスが拒否されました。URLが正しいか確認してください。",
  "404": "指定されたURLが見つかりませんでした。",
  timeout: "リクエストがタイムアウトしました。時間をおいて再度お試しください。",
  "rate limit": "アクセス制限に達しました。しばらく待ってから再度お試しください。",
  forbidden: "アクセスが拒否されました。URLが正しいか確認してください。",
  "not found": "指定されたURLが見つかりませんでした。",
  abort: "処理がタイムアウトしました。ネットワーク接続を確認してください。",
  network: "ネットワークエラーが発生しました。接続を確認してください。",
  fetch: "ネットワークエラーが発生しました。接続を確認してください。",
};

/**
 * 長いGoogle Maps URLから座標情報を抽出する関数
 * @param url 長いGoogle Maps URL
 * @returns 座標情報とパース結果
 */
function parseLongGoogleMapsUrl(url: string): ParseResult {
  try {
    // 場所名の抽出
    let placeName: string | undefined;
    const placeMatch = url.match(/\/place\/([^\/]+)/);
    if (placeMatch) {
      placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
    }

    // メイン座標の抽出（@lat,lng,zoomパターン）
    const coordMatch = url.match(/@([0-9.-]+),([0-9.-]+),([0-9.-]+)z/);
    if (!coordMatch) {
      return {
        success: false,
        error: "URLから座標情報を抽出できませんでした。",
        urlType: "long",
      };
    }

    const latitude = Number.parseFloat(coordMatch[1]);
    const longitude = Number.parseFloat(coordMatch[2]);

    // 座標の妥当性チェック
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return {
        success: false,
        error: "抽出された座標が無効です。",
        urlType: "long",
      };
    }

    // 大まかな地球座標範囲チェック
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return {
        success: false,
        error: "座標が有効な範囲外です。",
        urlType: "long",
      };
    }

    return {
      success: true,
      coordinates: {
        latitude,
        longitude,
      },
      address: placeName,
      urlType: "long",
    };
  } catch (error) {
    console.error("Long URL parsing error:", error);
    return {
      success: false,
      error: `長いURL解析中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      urlType: "long",
    };
  }
}

function extractCoordinatesFromHtml(htmlContent: string): Coordinates | null {
  for (const pattern of Object.values(COORDINATE_PATTERNS)) {
    const matches = Array.from(htmlContent.matchAll(pattern));

    for (const match of matches) {
      const lat = Number.parseFloat(match[1]);
      const lng = Number.parseFloat(match[2]);

      if (isJapanCoordinate(lat, lng)) {
        return { latitude: lat, longitude: lng };
      }
    }
  }

  return null;
}

function extractAddressFromHtml(htmlContent: string): string | undefined {
  for (const pattern of ADDRESS_PATTERNS) {
    const match = htmlContent.match(pattern);
    if (match) {
      return match[1].replace(/\\u[0-9a-fA-F]{4}/g, (match) => {
        return String.fromCharCode(Number.parseInt(match.replace("\\u", ""), 16));
      });
    }
  }
  return undefined;
}

function getUserFriendlyError(error: Error): string {
  const errorMessage = error.message;

  for (const [key, message] of Object.entries(ERROR_MESSAGES)) {
    if (errorMessage.includes(key)) {
      return message;
    }
  }

  return `短縮URL解析中にエラーが発生しました: ${errorMessage}`;
}

/**
 * 短縮Google Maps URLから座標情報を抽出する関数
 * @param url Google Maps短縮URL
 * @returns 座標情報とパース結果
 */
async function parseShortGoogleMapsUrl(url: string): Promise<ParseResult> {
  try {
    ("use server");
    const htmlContent = await fetchUrl(url);
    const coordinates = extractCoordinatesFromHtml(htmlContent);

    if (!coordinates) {
      return {
        success: false,
        error: "座標情報を抽出できませんでした。URLが正しいか確認してください。",
        urlType: "short",
      };
    }

    const address = extractAddressFromHtml(htmlContent);

    return {
      success: true,
      coordinates,
      address,
      urlType: "short",
    };
  } catch (error) {
    console.error("Short URL parsing error:", error);
    return {
      success: false,
      error: error instanceof Error ? getUserFriendlyError(error) : "不明なエラーが発生しました。",
      urlType: "short",
    };
  }
}

/**
 * URL形式を判別する関数
 * @param url 判別対象のURL
 * @returns URL形式の種類
 */
function detectGoogleMapsUrlType(url: string): "short" | "long" | "invalid" {
  const cleanUrl = url.trim();

  // 短縮URL形式のチェック
  if (cleanUrl.includes("maps.app.goo.gl") || cleanUrl.includes("goo.gl")) {
    return "short";
  }

  // 長いURL形式のチェック
  if (cleanUrl.includes("google.com/maps") && cleanUrl.includes("@")) {
    return "long";
  }
  if (cleanUrl.includes("google.co.jp/maps") && cleanUrl.includes("@")) {
    return "long";
  }

  return "invalid";
}

/**
 * Google Maps URL（短縮・長い形式両方対応）から座標情報を抽出する統合関数
 * @param url Google Maps URL（短縮形式または長い形式）
 * @returns 座標情報とパース結果
 */
export async function parseGoogleMapsUrl(url: string): Promise<ParseResult> {
  try {
    // 入力チェック
    if (!url || typeof url !== "string") {
      return {
        success: false,
        error: "有効なURLを入力してください。",
      };
    }

    const cleanUrl = url.trim();
    if (!cleanUrl) {
      return {
        success: false,
        error: "URLが空です。Google Maps URLを入力してください。",
      };
    }

    // URL形式を自動判別
    const urlType = detectGoogleMapsUrlType(cleanUrl);

    switch (urlType) {
      case "short":
        // 短縮URL形式を検出
        return await parseShortGoogleMapsUrl(cleanUrl);

      case "long":
        // 長いURL形式を検出
        return parseLongGoogleMapsUrl(cleanUrl);

      case "invalid":
        return {
          success: false,
          error:
            "サポートされていないURL形式です。Google Maps の短縮URL（maps.app.goo.gl）または長いURL（google.com/maps）を入力してください。",
        };

      default:
        return {
          success: false,
          error: "URL形式を判別できませんでした。",
        };
    }
  } catch (error) {
    console.error("URL parsing error:", error);
    return {
      success: false,
      error: `URL解析中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Google Maps URLから座標のみを抽出するシンプルな関数
 * @param url Google Maps URL（短縮形式または長い形式）
 * @returns 座標情報（取得できない場合はnull）
 */
export async function extractCoordinates(url: string): Promise<Coordinates | null> {
  const result = await parseGoogleMapsUrl(url);
  return result.success && result.coordinates ? result.coordinates : null;
}

/**
 * 座標が有効な範囲内かチェックする関数
 * @param latitude 緯度
 * @param longitude 経度
 * @returns 有効な場合true
 */
export function isValidCoordinate(latitude: number, longitude: number): boolean {
  return (
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/**
 * 日本国内の座標かチェックする関数
 * @param latitude 緯度
 * @param longitude 経度
 * @returns 日本国内の場合true
 */
export function isJapanCoordinate(latitude: number, longitude: number): boolean {
  return latitude >= 24 && latitude <= 46 && longitude >= 122 && longitude <= 154;
}
