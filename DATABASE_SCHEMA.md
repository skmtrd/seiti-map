# データベーススキーマ定義書

このドキュメントは、seiti-mapプロジェクトのSupabaseデータベースの完全な構造とマイグレーション内容をまとめたものです。

## 📋 目次

1. [概要](#概要)
2. [ENUM定義](#enum定義)
3. [テーブル構造](#テーブル構造)
4. [RLSポリシー](#rlsポリシー)
5. [ストレージ設定](#ストレージ設定)
6. [マイグレーション履歴](#マイグレーション履歴)
w
## 概要

seiti-mapは、アニメ・ドラマ・映画などの聖地巡礼スポットを共有するサービスです。ユーザーは作品に関連するスポットを投稿し、コメントや画像付きで情報を共有できます。

## ENUM定義

### work_type（作品タイプ）
```sql
create type work_type as enum (
  'anime',    -- アニメ
  'drama',    -- ドラマ
  'movie',    -- 映画
  'game',     -- ゲーム
  'novel',    -- 小説
  'manga',    -- 漫画
  'artists',  -- アーティスト（歌手、バンドなど）
  'other'     -- その他
);
```

### image_type_enum（画像タイプ）
```sql
create type image_type_enum as enum (
  'official',       -- 公式画像
  'user_photo',     -- ユーザー撮影写真
  'comparison',     -- 比較画像
  'scene_reference' -- シーン参照画像
);
```

## テーブル構造

### 1. works（作品テーブル）

**目的**: アニメ、ドラマ、映画などの作品情報を管理

```sql
create table works (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,              -- 作品タイトル
  title_english varchar(255),               -- 英語タイトル
  type work_type not null,                  -- 作品タイプ
  genre varchar(100),                       -- ジャンル
  release_year integer,                     -- 公開年
  description text,                         -- 作品説明
  image_url text,                          -- 作品画像URL
  official_website text,                   -- 公式サイト
  is_public boolean default true,          -- 公開状態
  created_by uuid references auth.users(id), -- 作成者
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

**インデックス**:
- `idx_works_type`: 作品タイプでの検索最適化
- `idx_works_public`: 公開状態での検索最適化

### 2. spots（スポットテーブル）

**目的**: 聖地巡礼スポットの詳細情報を管理

```sql
create table spots (
  id uuid primary key default gen_random_uuid(),
  work_id uuid references works(id) on delete cascade,
  name varchar(255) not null,              -- スポット名
  description text,                        -- スポット説明
  scene_description text,                  -- シーン説明
  
  -- 位置情報
  latitude decimal(10, 8) not null,        -- 緯度
  longitude decimal(11, 8) not null,       -- 経度
  address text,                           -- 住所
  prefecture varchar(50),                 -- 都道府県
  city varchar(100),                      -- 市区町村
  
  -- 訪問情報
  visit_difficulty integer check (visit_difficulty >= 1 and visit_difficulty <= 5), -- 訪問難易度（1-5）
  best_visit_time varchar(100),           -- 最適訪問時間
  access_info text,                       -- アクセス情報
  
  -- 画像
  image_url text,                         -- スポット画像URL
  
  -- 管理情報
  submitted_by uuid references auth.users(id), -- 投稿者
  is_public boolean default true,         -- 公開状態
  view_count integer default 0,           -- 閲覧数
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

**インデックス**:
- `idx_spots_work_id`: 作品IDでの検索最適化
- `idx_spots_location`: 位置情報での検索最適化
- `idx_spots_prefecture`: 都道府県での検索最適化
- `idx_spots_public`: 公開状態での検索最適化
- `idx_spots_has_image`: 画像付きスポットでの検索最適化

### 3. comments（コメントテーブル）

**目的**: スポットに対するユーザーコメントと画像投稿を管理

```sql
create table comments (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid references spots(id) on delete cascade not null, -- 対象スポット
  user_id uuid references auth.users(id) on delete cascade not null, -- コメント投稿者
  content text not null,                   -- コメント内容
  
  -- 画像サポート（最大4枚まで）
  image_url_1 text,
  image_url_2 text,
  image_url_3 text,
  image_url_4 text,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  -- 制約
  constraint content_not_empty check (length(trim(content)) > 0)
);
```

**インデックス**:
- `idx_comments_spot_id`: スポットIDでの検索最適化
- `idx_comments_user_id`: ユーザーIDでの検索最適化
- `idx_comments_created_at`: 作成日時での並び替え最適化

**自動更新機能**:
- `update_comments_updated_at()`: updated_atカラムの自動更新関数
- `update_comments_updated_at_trigger`: 更新時のトリガー

## RLSポリシー

### works テーブル

**閲覧権限**:
- 匿名ユーザー: 公開作品のみ閲覧可能
- 認証ユーザー: 公開作品のみ閲覧可能

**操作権限**:
- 作成: 認証ユーザーが自分の作品として作成可能
- 更新: 作成者のみ編集可能
- 削除: 作成者のみ削除可能

### spots テーブル

**閲覧権限**:
- 匿名ユーザー: 公開スポットのみ閲覧可能
- 認証ユーザー: 公開スポットのみ閲覧可能

**操作権限**:
- 作成: 認証ユーザーが自分のスポットとして投稿可能
- 更新: 投稿者のみ編集可能
- 削除: 投稿者のみ削除可能

### comments テーブル

**閲覧権限**:
- 匿名ユーザー: すべてのコメントを閲覧可能
- 認証ユーザー: すべてのコメントを閲覧可能

**操作権限**:
- 作成: 認証ユーザーが自分のコメントとして投稿可能
- 更新: コメント投稿者のみ編集可能
- 削除: コメント投稿者のみ削除可能

## ストレージ設定

### comment-images バケット

**目的**: コメントに添付する画像ファイルの保存

**設定**:
- 公開バケット: true
- ファイルサイズ制限: 5MB
- 許可フォーマット: JPEG, PNG, WebP, GIF

**アクセス権限**:
- 閲覧: 一般公開
- アップロード: 認証ユーザーが自分のフォルダに限定
- 更新・削除: 認証ユーザーが自分のファイルに限定

**フォルダ構造**: `/{user_id}/{filename}`

## マイグレーション履歴

### 初期設定ファイル（順序実行推奨）

1. **sql_step1_enums.sql** - ENUM型の定義
2. **sql_step2_works_table.sql** - worksテーブル作成
3. **sql_step3_spots_table.sql** - spotsテーブル作成
4. **sql_step4_rls_policies.sql** - RLSポリシー設定

### 機能追加マイグレーション（日付順）

1. **20241206120000_add_image_url_to_spots.sql** (2024/12/06 12:00)
   - spotsテーブルにimage_urlカラム追加
   - 画像有無でのインデックス追加

2. **20241206150000_add_comments_table.sql** (2024/12/06 15:00)
   - commentsテーブル作成
   - comment-imagesストレージバケット作成
   - RLSポリシー設定
   - 自動更新機能の実装

3. **20241206160000_add_artists_to_work_type.sql** (2024/12/06 16:00)
   - work_type ENUMに'artists'値を追加

## 使用時の注意事項

### セキュリティ
- すべてのテーブルでRLSが有効
- ユーザーは自分が作成したコンテンツのみ編集・削除可能
- 匿名ユーザーは閲覧のみ可能

### パフォーマンス
- 地理的検索用のインデックスが設定済み
- 頻繁な検索条件（タイプ、公開状態等）にインデックス適用済み

### データ整合性
- 外部キー制約により参照整合性を保証
- CASCADE削除により関連データの一貫性を維持

### ストレージ
- 画像ファイルは5MB制限
- ユーザーごとのフォルダ分離でセキュリティ確保

## AIへの指示例

このスキーマを使用してクエリやコードを生成する際は、以下の点を考慮してください：

1. **RLSポリシー**: すべてのテーブルでRLSが有効なため、Supabaseクライアントでの認証状態を考慮
2. **地理的検索**: latitude/longitudeカラムを使用した位置ベース検索の実装
3. **画像処理**: コメントの複数画像（最大4枚）とストレージのフォルダ構造
4. **ENUM値**: work_typeやimage_type_enumの正確な値を使用
5. **インデックス**: 既存インデックスを活用した効率的なクエリ設計 