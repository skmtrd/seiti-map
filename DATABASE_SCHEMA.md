# 聖地巡礼マップ - データベーススキーマ仕様書

## 📋 概要

このドキュメントは聖地巡礼マップアプリケーションのSupabaseデータベーススキーマの完全な仕様書です。**Supabase公式ルールに完全準拠**した設計となっています。

## 🏗️ マイグレーションファイル構成

### 実行順序
1. `20241201120000_create_seiti_map_schema.sql` - メインスキーマ作成
2. `20241201120001_create_rls_policies.sql` - RLSポリシー設定
3. `20241201120002_create_storage_setup.sql` - Storageバケット設定
4. `20241201120003_create_triggers.sql` - トリガー関数設定

## 📊 データベース構造

### ENUMタイプ

#### work_type
```sql
'anime', 'drama', 'movie', 'game', 'novel', 'manga', 'other'
```

#### image_type_enum
```sql
'official', 'user_photo', 'comparison', 'scene_reference'
```

### テーブル一覧

| テーブル名 | 説明 | 主要カラム |
|-----------|------|-----------|
| `works` | 作品情報 | title, type, genre, release_year |
| `spots` | 聖地スポット | name, latitude, longitude, work_id |
| `spot_images` | スポット画像 | image_url, spot_id, image_type |
| `reviews` | レビュー | rating, comment, spot_id, user_id |
| `user_favorite_works` | お気に入り作品 | user_id, work_id |
| `user_favorite_spots` | お気に入りスポット | user_id, spot_id |
| `user_profiles` | ユーザープロフィール | display_name, bio, statistics |
| `tags` | タグマスタ | name, color |
| `spot_tags` | スポット-タグ関連 | spot_id, tag_id |

## 🔄 テーブル詳細仕様

### works テーブル
```sql
- id: uuid (PK)
- title: varchar(255) NOT NULL
- title_english: varchar(255)
- type: work_type NOT NULL
- genre: varchar(100)
- release_year: integer
- description: text
- image_url: text
- official_website: text
- is_public: boolean DEFAULT true
- created_by: uuid (FK to auth.users)
- created_at: timestamptz
- updated_at: timestamptz
```

**制約**:
- `unique_work_title_type`: 同一タイトル・タイプの重複防止

### spots テーブル
```sql
- id: uuid (PK)
- work_id: uuid (FK to works)
- name: varchar(255) NOT NULL
- description: text
- scene_description: text
- latitude: decimal(10, 8) NOT NULL
- longitude: decimal(11, 8) NOT NULL
- address: text
- prefecture: varchar(50)
- city: varchar(100)
- visit_difficulty: integer (1-5)
- best_visit_time: varchar(100)
- access_info: text
- submitted_by: uuid (FK to auth.users)
- is_public: boolean DEFAULT true
- view_count: integer DEFAULT 0
- created_at: timestamptz
- updated_at: timestamptz
```

### reviews テーブル
```sql
- id: uuid (PK)
- spot_id: uuid (FK to spots)
- user_id: uuid (FK to auth.users)
- rating: integer (1-5)
- title: varchar(255)
- comment: text
- accuracy_rating: integer (1-5)
- accessibility_rating: integer (1-5)
- atmosphere_rating: integer (1-5)
- visited_at: date
- visit_season: varchar(20)
- visit_time: varchar(20)
- helpful_count: integer DEFAULT 0
- created_at: timestamptz
- updated_at: timestamptz
```

**制約**:
- `unique(spot_id, user_id)`: 同一ユーザーの重複レビュー防止

### user_profiles テーブル
```sql
- id: uuid (PK, FK to auth.users)
- display_name: varchar(100)
- avatar_url: text
- bio: text
- location: varchar(100)
- website: text
- total_spots_submitted: integer DEFAULT 0
- total_reviews_written: integer DEFAULT 0
- pilgrimage_count: integer DEFAULT 0
- is_public: boolean DEFAULT true
- email_notifications: boolean DEFAULT true
- created_at: timestamptz
- updated_at: timestamptz
```

## 🛡️ セキュリティ設定

### Row Level Security (RLS)

**全テーブルでRLS有効化済み**

#### 主要なセキュリティポリシー

##### 公開データアクセス
- 未認証ユーザー（`anon`）: 公開データの閲覧のみ
- 認証ユーザー（`authenticated`）: 公開データ + 自分のデータ

##### 作成・編集・削除
- **作品・スポット**: 作成者のみ編集・削除可能
- **レビュー**: レビュー投稿者のみ編集・削除可能
- **お気に入り**: 自分のお気に入りのみ操作可能
- **プロフィール**: 自分のプロフィールのみ操作可能

### ポリシー命名規則
```
"allow [role] users to [action] [description]"
```

例: `"allow authenticated users to create works"`

## 📁 Storage設定

### バケット構成

| バケット名 | 用途 | 公開設定 |
|-----------|------|---------|
| `spot-images` | スポット画像 | Public |
| `work-posters` | 作品ポスター | Public |
| `user-avatars` | ユーザーアバター | Public |

### フォルダ構造
```
bucket/
├── {user_id}/
│   ├── image1.jpg
│   ├── image2.png
│   └── ...
```

**セキュリティ**:
- ユーザーは自分のフォルダ（`{user_id}/`）内のみアップロード可能
- 全ての画像は公開読み取り可能

## ⚡ パフォーマンス最適化

### インデックス設定

#### works テーブル
```sql
- idx_works_title_search: GIN(to_tsvector('japanese', title))
- idx_works_type: type
- idx_works_public: is_public
```

#### spots テーブル
```sql
- idx_spots_work_id: work_id
- idx_spots_location: (latitude, longitude)
- idx_spots_prefecture: prefecture
- idx_spots_public: is_public
```

#### reviews テーブル
```sql
- idx_reviews_spot_id: spot_id
- idx_reviews_user_id: user_id
- idx_reviews_rating: rating
```

## 🤖 自動化機能

### トリガー機能

#### updated_at自動更新
- `works`, `spots`, `reviews`, `user_profiles`で自動実行

#### ユーザー統計自動更新
- `total_spots_submitted`: スポット投稿時に自動増減
- `total_reviews_written`: レビュー投稿時に自動増減

#### スポット閲覧数
- レビュー投稿時に`view_count`自動増加

## 🔍 検索・重複チェック機能

### 作品重複チェック関数
```sql
check_work_similarity(input_title, input_type)
```

**機能**:
- pg_trgm拡張使用
- 類似度0.7以上で重複候補検出
- 完全一致・高類似度順でソート

## 📝 使用例

### 作品重複チェック
```typescript
const { data: similarWorks } = await supabase
  .rpc('check_work_similarity', {
    input_title: '新しい作品タイトル',
    input_type: 'anime'
  });
```

### スポット検索（位置情報）
```typescript
const { data: nearbySpots } = await supabase
  .from('spots')
  .select('*')
  .gte('latitude', minLat)
  .lte('latitude', maxLat)
  .gte('longitude', minLng)
  .lte('longitude', maxLng)
  .eq('is_public', true);
```

## ✅ Supabase公式ルール準拠チェック

### 完全準拠項目
- [x] マイグレーションファイル命名規則 (`YYYYMMDDHHmmss_description.sql`)
- [x] SQL小文字記述
- [x] 全テーブルRLS有効化
- [x] RLSポリシーCRUD操作別分離
- [x] `anon`/`authenticated`ロール別分離
- [x] 関数`SECURITY INVOKER`設定
- [x] `search_path = ''`設定
- [x] `auth.uid()`使用
- [x] 豊富なコメント記載

### セキュリティベストプラクティス
- [x] `(select auth.uid())`でパフォーマンス最適化
- [x] 最小権限の原則
- [x] データ整合性制約
- [x] カスケード削除設定

## 🚀 次のステップ

### 実装推奨順序
1. **認証機能実装** - Supabase Auth設定
2. **基本CRUD操作** - works, spots テーブル
3. **画像アップロード** - Storage連携
4. **検索機能** - 全文検索・位置検索
5. **レビューシステム** - reviews テーブル活用
6. **お気に入り機能** - favorite テーブル活用

### 開発時の注意点
- RLSポリシーによる権限チェック必須
- 画像アップロード時のファイル形式・サイズ制限
- 位置情報の精度管理
- レビューの重複防止
- パフォーマンス監視（特に検索機能）

## 📚 関連ドキュメント
- [PROJECT_REQUIREMENTS.md](./PROJECT_REQUIREMENTS.md) - プロジェクト要件
- [TECH_STACK.md](./TECH_STACK.md) - 技術スタック詳細
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - 開発ガイドライン

---

**最終更新**: 2024年12月1日  
**スキーマバージョン**: 1.0  
**Supabase準拠**: ✅ 完全準拠 