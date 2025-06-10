# 🗺️ 聖地巡礼マップ

アニメやドラマなどの聖地を地図上で簡単に見つけられる、コミュニティ駆動型の聖地巡礼プラットフォームです。

## ✨ 主な機能

- 📍 **インタラクティブマップ**: 聖地スポットを地図上で視覚的に表示
- 🔍 **絞り込み検索**: アニメ・ドラマ作品別、ジャンル別での検索
- 📝 **ユーザー投稿**: コミュニティによる聖地情報の共有
- ❤️ **お気に入り機能**: 作品やスポットをお気に入りに登録
- 💬 **レビュー機能**: ユーザーによる口コミ・評価の投稿

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 15.3.3, React 19, TypeScript
- **スタイリング**: Tailwind CSS 4
- **地図ライブラリ**: react-map-gl + Mapbox GL JS
- **バックエンド**: Supabase (PostgreSQL + Auth + Storage)
- **開発ツール**: Biome, Lefthook

## 📚 ドキュメント

- [📋 プロジェクト要件定義書](./PROJECT_REQUIREMENTS.md) - 詳細な機能仕様とTO-DOリスト
- [🔧 技術スタック詳細](./TECH_STACK.md) - 使用技術の詳細情報と設定方法
- [🚀 開発ガイド](./DEVELOPMENT_GUIDE.md) - 開発時のクイックリファレンス

## 🚀 開発開始

### 前提条件

- Node.js 18.0.0以上
- npm または yarn
- Git

### セットアップ

1. **リポジトリのクローン**
   ```bash
   git clone <repository-url>
   cd seiti-map
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **環境変数の設定**
   ```bash
   cp .env.example .env.local
   # .env.localを編集して必要なAPIキーを設定
   ```

4. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

   http://localhost:3000 でアプリケーションが起動します。

### 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start

# コードのリント
npm run lint

# コードの自動修正
npm run lint:fix

# コードのフォーマット
npm run format

# TypeScript型チェック
npm run type-check
```

## 🔧 環境変数

プロジェクトで必要な環境変数：

```env
# Mapbox (地図表示用)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token

# Supabase (バックエンドサービス)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# アプリケーション設定
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 📁 プロジェクト構成

```
seiti-map/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # 再利用可能なコンポーネント
│   ├── hooks/              # カスタムReact Hooks
│   ├── lib/                # ユーティリティ・設定
│   ├── types/              # TypeScript型定義
│   └── constants/          # 定数定義
├── public/                 # 静的ファイル
├── docs/                   # プロジェクトドキュメント
├── biome.json             # Biome設定
├── lefthook.yml           # Git Hooks設定
└── package.json
```

## 🎯 開発フロー

1. **機能ブランチの作成**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **開発・コミット**
   ```bash
   git add .
   git commit -m "feat: 新機能の説明"
   ```
   
   > 💡 コミットメッセージは[Conventional Commits](https://www.conventionalcommits.org/)形式で記述してください

3. **プッシュ・プルリクエスト**
   ```bash
   git push origin feature/new-feature
   ```

## 🔍 開発状況

- [x] プロジェクト初期化
- [x] Biome・Lefthook導入
- [ ] Supabase設定
- [ ] 基本UI実装
- [ ] マップ機能実装
- [ ] 認証機能実装

詳細な進捗は[プロジェクト要件定義書](./PROJECT_REQUIREMENTS.md)のTO-DOリストを参照してください。

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 📞 サポート

質問や問題がある場合は、[Issues](../../issues)を作成してください。

---

## 🚀 次のステップ

開発を始める前に以下のドキュメントを確認してください：

1. [📋 プロジェクト要件定義書](./PROJECT_REQUIREMENTS.md) - 全体的な機能要件とTO-DO
2. [🔧 技術スタック詳細](./TECH_STACK.md) - 技術的な詳細と設定方法
3. [🚀 開発ガイド](./DEVELOPMENT_GUIDE.md) - 実装時のクイックリファレンス

Happy coding! 🎉
