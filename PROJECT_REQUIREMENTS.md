# 聖地巡礼マップ - プロジェクト要件定義書

## 📖 プロジェクト概要

「聖地巡礼マップ」は、アニメやドラマなどの聖地となっている場所を地図上で視覚的に確認できるWebアプリケーションです。ユーザーが聖地を簡単に発見し、詳細情報を確認し、自らも聖地情報を投稿できるコミュニティ駆動型のプラットフォームを目指します。

## 🎯 プロジェクトの目的

- アニメ・ドラマファンが聖地を効率的に発見できる
- ユーザーコミュニティによる聖地情報の共有と拡充
- 聖地巡礼の体験を向上させる総合的なプラットフォーム提供

## 👥 ターゲットユーザー

- アニメ・ドラマファン
- 聖地巡礼を趣味とする人
- 旅行好きの人
- ロケ地情報に興味のある人

## 🗺️ 主要機能一覧

### 🔍 閲覧機能（ログイン不要）
- [ ] インタラクティブマップの表示
- [ ] 聖地スポットのマーカー表示
- [ ] アニメ・ドラマ作品による絞り込み検索
- [ ] ジャンル・カテゴリー別フィルタリング
- [ ] 地域別検索
- [ ] スポット詳細情報の表示
- [ ] 基本情報（住所、説明、写真）表示
- [ ] ユーザー口コミ・レビューの閲覧

### 🔐 ユーザー機能（ログイン必要）
- [ ] ユーザー登録・ログイン機能
- [ ] お気に入り作品の登録
- [ ] お気に入りスポットの保存
- [ ] 新規聖地スポットの投稿
- [ ] スポット情報の編集・更新
- [ ] 口コミ・レビューの投稿
- [ ] 写真のアップロード
- [ ] マイページでの投稿管理

### 🛠️ 管理機能
- [ ] 管理者による聖地情報の承認・削除
- [ ] 不適切なコンテンツのモデレーション
- [ ] 作品データベースの管理

## 🏗️ 技術仕様

### フロントエンド
- **フレームワーク**: Next.js 15.3.3
- **UI ライブラリ**: React 19
- **地図ライブラリ**: react-map-gl
- **スタイリング**: Tailwind CSS 4
- **型安全性**: TypeScript
- **状態管理**: React Hooks + Context API（必要に応じて）

### バックエンド
- **BaaS**: Supabase
- **データベース**: PostgreSQL (Supabase)
- **認証**: Supabase Auth
- **ストレージ**: Supabase Storage（画像アップロード）
- **API**: Supabase Client / REST API

### 開発ツール
- **リンター・フォーマッター**: Biome
- **Git Hooks**: Lefthook
- **パッケージマネージャー**: npm

## 📊 データベース設計（案）

### テーブル構成
```sql
-- 作品テーブル
CREATE TABLE works (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  type VARCHAR NOT NULL, -- 'anime', 'drama', 'movie', etc.
  genre VARCHAR,
  release_year INTEGER,
  description TEXT,
  image_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 聖地スポットテーブル
CREATE TABLE spots (
  id SERIAL PRIMARY KEY,
  work_id INTEGER REFERENCES works(id),
  name VARCHAR NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address VARCHAR,
  scene_description TEXT,
  user_id UUID REFERENCES auth.users(id),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- スポット画像テーブル
CREATE TABLE spot_images (
  id SERIAL PRIMARY KEY,
  spot_id INTEGER REFERENCES spots(id),
  image_url VARCHAR NOT NULL,
  caption TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- レビュー・口コミテーブル
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  spot_id INTEGER REFERENCES spots(id),
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- お気に入り作品テーブル
CREATE TABLE user_favorite_works (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  work_id INTEGER REFERENCES works(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, work_id)
);

-- お気に入りスポットテーブル
CREATE TABLE user_favorite_spots (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  spot_id INTEGER REFERENCES spots(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, spot_id)
);
```

## 📝 開発TO-DOリスト

### Phase 1: 基盤構築
- [x] プロジェクト初期化
- [x] Biome・Lefthook導入
- [ ] Supabaseプロジェクト作成
- [ ] データベーススキーマ設計・実装
- [ ] 認証機能の基本設定
- [ ] 環境変数設定
- [ ] shadcn/ui セットアップ
- [ ] 必要パッケージインストール（swr, nuqs, react-hook-form, zod）
- [ ] フォルダ構成整備（components, lib, types, constants）
- [ ] 基本的な型定義作成

### Phase 2: 基本UI実装
- [ ] トップページレイアウト作成（Server Component）
- [ ] ヘッダー・ナビゲーション実装（shadcn/ui使用）
- [ ] フッター実装
- [ ] レスポンシブデザイン対応
- [ ] ダークモード対応（shadcn/ui theme切替）
- [ ] 基本的なUIコンポーネント設定（Button, Card, Input等）

### Phase 3: マップ機能実装
- [ ] react-map-gl セットアップ
- [ ] 基本マップ表示（dynamic import + Suspense）
- [ ] マーカー表示機能（Server Component + Client Component分離）
- [ ] マーカークリック時のポップアップ（shadcn/ui Dialog使用）
- [ ] マップ操作（ズーム、パン）
- [ ] 現在地取得機能（オプション）
- [ ] マップフィルタリング（nuqs使用）

### Phase 4: データ表示機能
- [ ] 聖地スポット一覧表示（Server Component）
- [ ] 作品別フィルタリング機能（nuqs + useSWR）
- [ ] 検索機能実装（Server Actions + useSWR）
- [ ] スポット詳細ページ作成（Server Component）
- [ ] 画像表示機能（next/image最適化）
- [ ] レビュー表示機能（Server Component）

### Phase 5: 認証・ユーザー機能
- [ ] ログイン・サインアップページ（react-hook-form + zod）
- [ ] 認証状態管理（Supabase Auth + Server Components）
- [ ] マイページ実装（Server Component + Client Component分離）
- [ ] お気に入り機能（Server Actions + useSWR楽観的更新）
- [ ] ユーザープロフィール管理

### Phase 6: 投稿機能
- [ ] スポット投稿フォーム（react-hook-form + zod + Server Actions）
- [ ] 画像アップロード機能（Supabase Storage + Server Actions）
- [ ] レビュー投稿機能（Server Actions + RLS）
- [ ] 投稿データの検証（クライアント・サーバー両方）
- [ ] 投稿内容のプレビュー

### Phase 7: 管理機能
- [ ] 管理者ダッシュボード
- [ ] 投稿承認システム
- [ ] コンテンツモデレーション
- [ ] 統計情報表示

### Phase 8: UX向上・最適化
- [ ] ローディング状態の改善
- [ ] エラーハンドリング強化
- [ ] パフォーマンス最適化
- [ ] SEO対策
- [ ] アクセシビリティ向上

### Phase 9: テスト・デプロイ
- [ ] ユニットテスト実装
- [ ] E2Eテスト実装
- [ ] CI/CDパイプライン構築
- [ ] Vercelデプロイ設定
- [ ] 本番環境設定

## 🚀 MVP（最小viable product）定義

最初のリリースで必要な最小限の機能：

1. **マップ表示**: 基本的な地図とマーカー表示
2. **スポット情報表示**: 基本情報と画像表示
3. **作品別フィルタリング**: 簡単な絞り込み機能
4. **レスポンシブ対応**: モバイル・デスクトップ両対応

## 📏 非機能要件

- **パフォーマンス**: 初期ロード時間 < 3秒
- **レスポンシブ**: スマートフォン・タブレット・デスクトップ対応
- **ブラウザ対応**: Chrome, Firefox, Safari, Edge 最新版
- **アクセシビリティ**: WCAG 2.1 AA準拠
- **SEO**: 基本的なSEO対策実装

## 🔄 今後の拡張予定

- [ ] Progressive Web App（PWA）対応
- [ ] オフライン機能
- [ ] プッシュ通知
- [ ] ソーシャル機能（ユーザーフォロー等）
- [ ] AR機能（聖地での拡張現実体験）
- [ ] 多言語対応
- [ ] API公開

## 📋 開発における注意点

### セキュリティ
- ユーザー投稿コンテンツの適切な検証
- SQLインジェクション対策
- XSS対策
- 画像アップロードのセキュリティ

### パフォーマンス
- 大量のマーカー表示時のパフォーマンス最適化
- 画像の適切な圧縮・最適化
- データベースクエリの最適化

### UX/UI
- 直感的なマップ操作
- モバイルファーストデザイン
- アクセシビリティ配慮

---

## 📞 次のアクション

1. Supabaseプロジェクトの作成
2. データベーススキーマの実装
3. 基本的なページレイアウトの作成
4. react-map-glの導入とマップ表示

このドキュメントは開発進行に合わせて随時更新していきます。 