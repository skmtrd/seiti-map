# 聖地巡礼マップ - 技術スタック詳細

## 🛠️ 技術スタック一覧

### フロントエンド

#### Next.js 15.3.3
- **用途**: Reactフレームワーク、SSR/SSG、ルーティング
- **公式ドキュメント**: https://nextjs.org/docs
- **設定ファイル**: `next.config.ts`
- **特徴**: App Router, React Server Components対応

#### React 19
- **用途**: UIライブラリ
- **公式ドキュメント**: https://react.dev/
- **新機能**: Concurrent Features, Automatic Batching

#### react-map-gl
- **用途**: Mapbox GL JSのReactラッパー
- **公式ドキュメント**: https://visgl.github.io/react-map-gl/
- **インストール**: `npm install react-map-gl mapbox-gl`
- **必要なAPIキー**: Mapbox Access Token

#### Tailwind CSS 4
- **用途**: CSSフレームワーク
- **公式ドキュメント**: https://tailwindcss.com/docs
- **設定ファイル**: `tailwind.config.js`
- **PostCSS**: `postcss.config.mjs`

#### TypeScript
- **用途**: 型安全性の提供
- **設定ファイル**: `tsconfig.json`
- **公式ドキュメント**: https://www.typescriptlang.org/docs/

### バックエンド

#### Supabase
- **用途**: Backend as a Service
- **公式ドキュメント**: https://supabase.com/docs
- **主要機能**:
  - PostgreSQLデータベース
  - リアルタイム機能
  - 認証（Auth）
  - ストレージ（画像・ファイル）
  - Edge Functions（サーバーレス関数）

#### PostgreSQL
- **用途**: リレーショナルデータベース
- **特徴**: GIS拡張（PostGIS）対応可能
- **Supabase内**: 管理不要

### 開発ツール

#### Biome
- **用途**: リンター・フォーマッター
- **設定ファイル**: `biome.json`
- **公式ドキュメント**: https://biomejs.dev/
- **特徴**: ESLint + Prettierの代替、高速

#### Lefthook
- **用途**: Git Hooks管理
- **設定ファイル**: `lefthook.yml`
- **公式ドキュメント**: https://github.com/evilmartians/lefthook
- **特徴**: 並列実行、設定が簡単

## 📦 必要なパッケージ

### 既にインストール済み
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "15.3.3"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "@biomejs/biome": "^latest",
    "lefthook": "^latest"
  }
}
```

### 今後インストール予定
```bash
# マップ関連
npm install react-map-gl mapbox-gl
npm install @types/mapbox-gl

# Supabase
npm install @supabase/supabase-js

# UI/UX ライブラリ（統一使用）
npm install @radix-ui/react-slot @radix-ui/react-separator
npm install shadcn-ui lucide-react
npm install clsx tailwind-merge
npm install nuqs

# データフェッチング・状態管理
npm install swr

# フォーム管理
npm install react-hook-form @hookform/resolvers zod

# 画像処理・最適化
npm install next-optimized-images
npm install imagemin imagemin-mozjpeg imagemin-pngquant

# ユーティリティ
npm install date-fns
npm install uuid @types/uuid
```

## 📋 開発ガイドライン

### 🗄️ データハンドリング戦略

#### Server Components + Server Actions（推奨）
**適用条件**: ユーザー操作に依存しないデータ取得・更新

```typescript
// ✅ Good: Server Component でのデータ取得
async function SpotsPage() {
  const spots = await getSpots(); // Server Action
  
  return (
    <div>
      {spots.map(spot => <SpotCard key={spot.id} spot={spot} />)}
    </div>
  );
}

// ✅ Good: Server Action での更新
async function createSpot(formData: FormData) {
  'use server';
  
  const data = {
    name: formData.get('name'),
    latitude: formData.get('latitude'),
    // ...
  };
  
  await supabase.from('spots').insert(data);
  revalidatePath('/spots');
}
```

#### Client Components + Server Actions + useSWR
**適用条件**: ユーザー操作に依存するデータ取得・更新

```typescript
// ✅ Good: Client Component での動的データ取得
'use client';

import useSWR from 'swr';

function InteractiveSpotsList() {
  const { data: spots, mutate } = useSWR('/api/spots', fetcher);
  
  const handleLike = async (spotId: string) => {
    // 楽観的更新
    mutate(
      spots?.map(spot => 
        spot.id === spotId ? { ...spot, liked: true } : spot
      ),
      false
    );
    
    // Server Action 実行
    await likeSpot(spotId);
    
    // データ再取得
    mutate();
  };

  return (
    <div>
      {spots?.map(spot => (
        <SpotCard 
          key={spot.id} 
          spot={spot} 
          onLike={() => handleLike(spot.id)} 
        />
      ))}
    </div>
  );
}
```

### 🎨 UI・コンポーネント統一ルール

#### shadcn/ui の統一使用
```bash
# shadcn/ui セットアップ
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
```

```typescript
// ✅ Good: shadcn/ui コンポーネント使用
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ❌ Bad: 自作UIコンポーネント
// const CustomButton = () => <button className="...">
```

#### lucide-react アイコン統一
```typescript
// ✅ Good: lucide-react 使用
import { MapPin, Heart, Star } from 'lucide-react';

function SpotCard({ spot }: { spot: Spot }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {spot.name}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

// ❌ Bad: 他のアイコンライブラリやSVG
// import { FaMapMarker } from 'react-icons/fa';
```

### 🔗 URL状態管理（nuqs統一）

```typescript
// ✅ Good: nuqs でURL状態管理
'use client';

import { useQueryState } from 'nuqs';

function SearchFilters() {
  const [workType, setWorkType] = useQueryState('type', {
    defaultValue: 'all'
  });
  const [region, setRegion] = useQueryState('region');

  return (
    <div>
      <select 
        value={workType} 
        onChange={e => setWorkType(e.target.value)}
      >
        <option value="all">すべて</option>
        <option value="anime">アニメ</option>
        <option value="drama">ドラマ</option>
      </select>
    </div>
  );
}

// ❌ Bad: useState でローカル状態管理
// const [workType, setWorkType] = useState('all');
```

### 🚀 パフォーマンス最適化ルール

#### 1. RSC優先、Client Componentは最小限
```typescript
// ✅ Good: Server Component 優先
async function SpotDetail({ spotId }: { spotId: string }) {
  const spot = await getSpotById(spotId);
  
  return (
    <div>
      <h1>{spot.name}</h1>
      <p>{spot.description}</p>
      {/* 静的コンテンツはServer Componentで */}
      
      {/* インタラクティブな部分のみClient Component */}
      <LikeButton spotId={spotId} />
    </div>
  );
}

// ✅ Good: 必要な部分のみClient Component
'use client';
function LikeButton({ spotId }: { spotId: string }) {
  const [liked, setLiked] = useState(false);
  // ...
}
```

#### 2. 動的import + Suspense
```typescript
// ✅ Good: 遅延読み込み
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/map/InteractiveMap'), {
  ssr: false,
  loading: () => <div>マップを読み込み中...</div>
});

function MapPage() {
  return (
    <Suspense fallback={<div>ページを読み込み中...</div>}>
      <InteractiveMap />
    </Suspense>
  );
}
```

#### 3. Next.js最適化機能の活用
```typescript
// ✅ Good: next/image 使用
import Image from 'next/image';

function SpotImage({ spot }: { spot: Spot }) {
  return (
    <Image
      src={spot.imageUrl}
      alt={spot.name}
      width={400}
      height={300}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}

// ✅ Good: next/link 使用
import Link from 'next/link';

function SpotCard({ spot }: { spot: Spot }) {
  return (
    <Link href={`/spots/${spot.id}`} prefetch={false}>
      <Card>...</Card>
    </Link>
  );
}
```

### 📝 フォーム・バリデーション戦略

#### react-hook-form + Zod
```typescript
// schemas/spot.ts
import { z } from 'zod';

export const spotSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  description: z.string().max(500, '説明は500文字以内で入力してください'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  workId: z.string().uuid(),
});

export type SpotInput = z.infer<typeof spotSchema>;
```

```typescript
// components/forms/SpotForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { spotSchema, type SpotInput } from '@/schemas/spot';

function SpotForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SpotInput>({
    resolver: zodResolver(spotSchema)
  });

  const onSubmit = async (data: SpotInput) => {
    try {
      await createSpot(data); // Server Action
      // 成功処理
    } catch (error) {
      // エラーハンドリング
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        {...register('name')} 
        placeholder="スポット名"
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '保存中...' : '保存'}
      </Button>
    </form>
  );
}
```

### 🔒 セキュリティ・権限管理

#### Server Actions セキュリティ指針
```typescript
// ✅ Good: 特定用途のServer Action
async function createSpotReview(spotId: string, formData: FormData) {
  'use server';
  
  // 1. 認証チェック
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('認証が必要です');
  }
  
  // 2. 入力検証
  const reviewData = reviewSchema.parse({
    comment: formData.get('comment'),
    rating: Number(formData.get('rating')),
  });
  
  // 3. 権限チェック（必要に応じて）
  const spot = await supabase
    .from('spots')
    .select('id')
    .eq('id', spotId)
    .single();
    
  if (!spot.data) {
    throw new Error('スポットが見つかりません');
  }
  
  // 4. データ挿入（RLS により自動的に user.id が設定される）
  const { error } = await supabase
    .from('reviews')
    .insert({
      spot_id: spotId,
      comment: reviewData.comment,
      rating: reviewData.rating,
      // user_id は RLS + auth.uid() により自動設定
    });
    
  if (error) {
    throw new Error('レビューの投稿に失敗しました');
  }
  
  revalidatePath(`/spots/${spotId}`);
}

// ❌ Bad: 汎用的すぎるServer Action
// async function updateDatabase(table: string, data: any, id: string) {
//   'use server';
//   // 危険：任意のテーブルを操作可能
// }
```

#### Supabase RLS設定例
```sql
-- ✅ Good: 適切なRLSポリシー
CREATE POLICY "ユーザーは自分のレビューのみ編集可能"
ON reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "承認済みスポットは全員閲覧可能"
ON spots FOR SELECT
USING (is_approved = true);

CREATE POLICY "ユーザーは自分のスポットを投稿可能"
ON spots FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### 🛡️ エラーハンドリング・品質保証

#### ガード節パターン
```typescript
// ✅ Good: ガード節で早期return
async function getSpotById(id: string) {
  if (!id) {
    return null;
  }
  
  const { data: spot, error } = await supabase
    .from('spots')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Spot fetch error:', error);
    return null;
  }
  
  if (!spot) {
    return null;
  }
  
  // 成功パス
  return {
    ...spot,
    createdAt: new Date(spot.created_at),
    updatedAt: new Date(spot.updated_at),
  };
}

// ❌ Bad: ネストした条件分岐
// async function getSpotById(id: string) {
//   if (id) {
//     const result = await supabase...
//     if (!result.error) {
//       if (result.data) {
//         return result.data;
//       }
//     }
//   }
//   return null;
// }
```

#### アクセシビリティ対応
```typescript
// ✅ Good: アクセシブルなコンポーネント
function SpotCard({ spot }: { spot: Spot }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link 
            href={`/spots/${spot.id}`}
            aria-label={`${spot.name}の詳細を見る`}
          >
            {spot.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{spot.description}</p>
        <Button
          onClick={() => handleLike(spot.id)}
          aria-label={`${spot.name}をお気に入りに追加`}
          aria-pressed={spot.isLiked}
        >
          <Heart className="h-4 w-4" />
          お気に入り
        </Button>
      </CardContent>
    </Card>
  );
}
```

## 🚫 禁止事項・非推奨パターン

### ❌ 使用禁止
- グローバル状態ライブラリ（Redux、Zustand等）
- 自作UIコンポーネント（shadcn/ui優先）
- lucide-react以外のアイコンライブラリ
- useState でのURL状態管理

### ⚠️ 最小限に抑制
- `'use client'` ディレクティブ
- `useEffect`, `useState`
- 汎用的なServer Actions

## 🔧 開発環境設定

### 環境変数（.env.local）
```env
# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# その他
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 必要なアカウント・サービス
1. **Mapbox Account**: https://account.mapbox.com/
2. **Supabase Account**: https://supabase.com/
3. **Vercel Account** (デプロイ用): https://vercel.com/

## 📁 推奨フォルダ構成

```
src/
├── app/                    # App Router（Next.js 13+）
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/            # 認証関連のページ
│   ├── spots/             # スポット関連ページ
│   ├── profile/           # プロフィールページ
│   └── api/               # API Routes
├── components/            # 再利用可能なコンポーネント
│   ├── ui/                # 基本UIコンポーネント
│   ├── map/               # マップ関連コンポーネント
│   ├── forms/             # フォームコンポーネント
│   └── layout/            # レイアウトコンポーネント
├── hooks/                 # カスタムReact Hooks
├── lib/                   # ユーティリティ・設定
│   ├── supabase.ts
│   ├── mapbox.ts
│   └── utils.ts
├── types/                 # TypeScript型定義
└── constants/             # 定数定義
```

## 🗄️ Supabase設定

### 主要テーブル
- `works` - 作品情報
- `spots` - 聖地スポット情報
- `spot_images` - スポット画像
- `reviews` - レビュー・口コミ
- `user_favorite_works` - お気に入り作品
- `user_favorite_spots` - お気に入りスポット

### Row Level Security (RLS)
```sql
-- spotsテーブルのRLSポリシー例
CREATE POLICY "公開されたスポットは誰でも閲覧可能" ON spots
  FOR SELECT USING (is_approved = true);

CREATE POLICY "ユーザーは自分の投稿を編集可能" ON spots
  FOR UPDATE USING (auth.uid() = user_id);
```

### リアルタイム機能
```sql
-- リアルタイム購読を有効化
ALTER PUBLICATION supabase_realtime ADD TABLE spots;
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
```

## 🗺️ Mapbox設定

### 推奨スタイル
- **基本**: `mapbox://styles/mapbox/streets-v11`
- **衛星**: `mapbox://styles/mapbox/satellite-v9`
- **ダーク**: `mapbox://styles/mapbox/dark-v10`

### 地図の初期設定
```typescript
const mapConfig = {
  initialViewState: {
    latitude: 35.6762, // 東京の緯度
    longitude: 139.6503, // 東京の経度
    zoom: 10
  },
  style: 'mapbox://styles/mapbox/streets-v11',
  mapboxAccessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
};
```

## 🎨 UIライブラリ・デザインシステム

### Headless UI + Heroicons
- **用途**: アクセシブルなUIコンポーネント
- **インストール**: `npm install @headlessui/react @heroicons/react`

### カラーパレット（Tailwind）
```css
/* カスタムカラー例 */
:root {
  --primary: #3B82F6;    /* blue-500 */
  --secondary: #8B5CF6;  /* violet-500 */
  --accent: #F59E0B;     /* amber-500 */
  --neutral: #6B7280;    /* gray-500 */
}
```

## 🔍 SEO・メタデータ設定

### Next.js Metadata API
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: '聖地巡礼マップ',
  description: 'アニメ・ドラマの聖地を簡単に見つけられるマップサービス',
  keywords: ['聖地巡礼', 'アニメ', 'ドラマ', 'ロケ地', 'マップ'],
  openGraph: {
    title: '聖地巡礼マップ',
    description: 'アニメ・ドラマの聖地を簡単に見つけられるマップサービス',
    type: 'website',
    url: 'https://your-domain.com',
  }
};
```

## 📱 レスポンシブ対応

### Tailwind ブレークポイント
- `sm`: 640px以上
- `md`: 768px以上
- `lg`: 1024px以上
- `xl`: 1280px以上
- `2xl`: 1536px以上

## 🚀 デプロイ・本番環境

### Vercel設定
1. GitHubリポジトリ連携
2. 環境変数設定
3. 自動デプロイ設定

### パフォーマンス最適化
- Next.js Image Optimization
- Code Splitting（自動）
- Bundle Analyzer使用推奨

---

## 🔗 参考リンク

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Supabase公式ドキュメント](https://supabase.com/docs)
- [react-map-gl公式ドキュメント](https://visgl.github.io/react-map-gl/)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [Mapbox GL JS API](https://docs.mapbox.com/mapbox-gl-js/api/)
- [Biome公式ドキュメント](https://biomejs.dev/)

このドキュメントは技術選定や実装時の参考として活用してください。 