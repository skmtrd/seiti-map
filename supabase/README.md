# Supabase データベース設定ガイド

## 🚀 マイグレーション実行手順

### 1. Supabase CLI インストール
```bash
npm install -g supabase
```

### 2. Supabase プロジェクト初期化
```bash
# プロジェクトルートで実行
supabase init

# 既存プロジェクトとリンク
supabase link --project-ref wvrxoutiubnthnhqwsuv
```

### 3. マイグレーション実行
```bash
# ローカル開発環境を起動
supabase start

# マイグレーション実行（開発環境）
supabase db push

# 本番環境へのデプロイ
supabase db push --linked
```

## 📁 マイグレーションファイル詳細

### 実行順序（自動）
1. `20241201120000_create_seiti_map_schema.sql`
2. `20241201120001_create_rls_policies.sql` 
3. `20241201120002_create_storage_setup.sql`
4. `20241201120003_create_triggers.sql`

### 各ファイルの内容

#### 1. メインスキーマ作成
- ENUMタイプ定義
- 9つのテーブル作成
- インデックス作成
- 作品重複チェック関数

#### 2. RLSポリシー設定
- 全テーブルのセキュリティポリシー
- ロール別権限設定（anon/authenticated）
- CRUD操作別ポリシー分離

#### 3. Storage設定
- 3つのバケット作成（spot-images, work-posters, user-avatars）
- ファイルアップロード・アクセス権限設定

#### 4. トリガー設定
- 自動タイムスタンプ更新
- ユーザー統計情報自動更新
- スポット閲覧数自動カウント

## 🛡️ セキュリティチェックリスト

### ✅ 実装済み項目
- [x] Row Level Security (RLS) 全テーブル有効
- [x] ロール別アクセス制御（anon/authenticated）
- [x] ユーザー所有データのみ編集・削除可能
- [x] Storage フォルダ分離セキュリティ
- [x] パスワードハッシュ化（Supabase Auth標準）

### ⚠️ 運用時注意点
- 本番環境での機密データ取り扱い
- APIキーの適切な管理
- RLSポリシーの定期的な見直し
- データバックアップ戦略

## 🔧 トラブルシューティング

### マイグレーション失敗時
```bash
# マイグレーション状態確認
supabase migration list

# 特定マイグレーションをリセット
supabase db reset

# 再実行
supabase db push
```

### 開発環境リセット
```bash
# 完全リセット
supabase stop
supabase start
```

### 本番環境での注意
```bash
# 必ずバックアップ取得後に実行
supabase db dump --linked > backup.sql

# 段階的適用推奨
supabase db push --linked --dry-run  # 事前確認
supabase db push --linked           # 実際の適用
```

## 📊 データベース構成確認

### テーブル一覧確認
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### RLSポリシー確認
```sql
SELECT 
  tablename, 
  policyname, 
  roles, 
  cmd 
FROM pg_policies 
WHERE schemaname = 'public';
```

### Storage バケット確認
```sql
SELECT * FROM storage.buckets;
```

## 🔍 環境変数設定

### 必須環境変数
```env
NEXT_PUBLIC_SUPABASE_URL=https://wvrxoutiubnthnhqwsuv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 取得方法
```bash
# プロジェクト情報表示
supabase status
```

## 📚 関連ドキュメント

- [DATABASE_SCHEMA.md](../DATABASE_SCHEMA.md) - 詳細なスキーマ仕様
- [Supabase 公式ドキュメント](https://supabase.com/docs)
- [PostgreSQL ドキュメント](https://www.postgresql.org/docs/)

## 🆘 サポート

### 問題発生時の連絡先
1. GitHub Issues での報告
2. Supabase Discord コミュニティ
3. プロジェクト開発チーム

---

**作成日**: 2024年12月1日  
**対象スキーマバージョン**: 1.0  
**Supabase CLI 最小バージョン**: 1.100.0 