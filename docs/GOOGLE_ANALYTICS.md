# Google Analytics 設定ガイド

本プロジェクトにはGoogle Analytics 4 (GA4) が統合されており、ページビューと カスタムイベントの追跡が可能です。

## 🔧 初期設定

### 1. Google Analytics プロパティの作成

1. [Google Analytics](https://analytics.google.com/) にアクセス
2. 新しいプロパティを作成
3. 測定IDを取得（例：G-XXXXXXXXXX）

### 2. 環境変数の設定

`.env.local` ファイルに以下を追加：

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. 本番環境での設定

本番環境（Vercel等）でも同様に環境変数を設定してください。

## 📊 自動追跡機能

### ページビュー追跡

ページの遷移は自動的に追跡されます。`usePageView` フックが Next.js の App Router と連携して、ルート変更時に自動でページビューイベントを送信します。

## 🎯 カスタムイベント追跡

### 基本的な使用方法

```tsx
import { event } from '@/lib/gtag';

// ボタンクリックイベント
const handleClick = () => {
  event({
    action: 'click',
    category: 'engagement',
    label: 'header-cta-button',
  });
};

// 検索イベント
const handleSearch = (query: string) => {
  event({
    action: 'search',
    category: 'engagement',
    label: query,
  });
};

// スポット詳細表示イベント
const handleSpotView = (spotId: string) => {
  event({
    action: 'spot_view',
    category: 'content',
    label: spotId,
  });
};
```

### 推奨イベント例

```tsx
// お気に入り追加
event({
  action: 'favorite_add',
  category: 'engagement',
  label: spotId,
});

// コメント投稿
event({
  action: 'comment_submit',
  category: 'engagement',
  label: 'spot_comment',
});

// マップフィルター使用
event({
  action: 'filter_apply',
  category: 'interaction',
  label: filterType,
});

// スポット作成
event({
  action: 'spot_create',
  category: 'content',
  label: workTitle,
});
```

## 🛠️ 実装の詳細

### ファイル構成

```
src/
├── lib/
│   └── gtag.ts              # GA設定・ユーティリティ関数
├── components/common/
│   ├── GoogleAnalytics.tsx  # GAスクリプト読み込み
│   └── AnalyticsProvider.tsx # ページビュー追跡プロバイダー
└── hooks/common/
    └── usePageView.ts       # ページビュー追跡フック
```

### 主要コンポーネント

- **GoogleAnalytics**: GA スクリプトの読み込みを管理
- **AnalyticsProvider**: アプリ全体でページビュー追跡を有効化
- **usePageView**: ルート変更を監視してページビューを送信

## 🚀 本番環境での確認

### Real-time レポート

1. Google Analytics ダッシュボードにアクセス
2. 「リアルタイム」セクションで即座にトラフィックを確認
3. ページビューとイベントが正しく送信されているか確認

### 開発環境での確認

開発環境では GA が無効化されています。本番環境でのみデータが送信されます。

## 📈 活用方法

### 重要指標の追跡

- **ページビュー**: 人気のあるページや経路を分析
- **スポット表示**: どの聖地スポットが人気かを把握
- **検索クエリ**: ユーザーがどのような作品を探しているかを分析
- **お気に入り**: エンゲージメントの高いコンテンツを特定

### カスタムダッシュボード

Google Analytics で以下のようなカスタムレポートを作成することを推奨します：

1. **エンゲージメント分析**: お気に入り、コメント、共有の状況
2. **コンテンツ分析**: 人気スポット、作品、カテゴリ
3. **ユーザー行動**: 検索パターン、経路分析

## 🔧 トラブルシューティング

### データが表示されない場合

1. 環境変数 `NEXT_PUBLIC_GA_ID` が正しく設定されているか確認
2. 本番環境（またはプレビュー環境）でテストしているか確認
3. ブラウザの広告ブロッカーが無効になっているか確認
4. GA プロパティの設定が正しいか確認

### デバッグ方法

```tsx
// 開発環境でのデバッグ用（本番では使用しない）
if (process.env.NODE_ENV === 'development') {
  console.log('GA Event:', { action, category, label });
}
```

## 📝 プライバシー対応

本実装では以下のプライバシー対応を行っています：

- 個人を特定できる情報（PII）は送信しない
- IP匿名化は GA4 でデフォルトで有効
- ユーザーエージェント情報のみを使用

必要に応じて、Cookie同意バナーやプライバシーポリシーの実装も検討してください。 