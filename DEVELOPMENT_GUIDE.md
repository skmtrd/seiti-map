# 🚀 開発ガイド - クイックリファレンス

## 📋 開発前チェックリスト

### ✅ 実装前の判断基準

| 条件 | 実装方法 |
|------|----------|
| ユーザー操作に依存しない | Server Components + Server Actions |
| ユーザー操作に依存する | Client Components + Server Actions + useSWR |
| URL状態が必要 | nuqs |
| フォーム処理 | react-hook-form + zod |
| UIコンポーネント | shadcn/ui |
| アイコン | lucide-react |

## 🛠️ 必須ツール・パッケージ

### 初期セットアップ
```bash
# 1. shadcn/ui セットアップ
npm run ui:init

# 2. 基本パッケージインストール
npm install @supabase/supabase-js swr nuqs
npm install react-hook-form @hookform/resolvers zod
npm install react-map-gl mapbox-gl
npm install lucide-react

# 3. shadcn/ui コンポーネント追加
npm run ui:add button card input dialog
```

### 必要な環境変数
```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.xxx
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

## 📁 フォルダ構成テンプレート

```
src/
├── app/                    # App Router
├── components/
│   ├── ui/                # shadcn/ui コンポーネント
│   ├── map/               # マップ関連
│   ├── forms/             # フォーム
│   └── layout/            # レイアウト
├── lib/
│   ├── supabase.ts        # Supabase設定
│   ├── utils.ts           # ユーティリティ
│   └── validations.ts     # Zodスキーマ
├── types/                 # 型定義
└── constants/             # 定数
```

## 💻 よく使うコードパターン

### Server Component + Server Action
```typescript
// app/spots/page.tsx
async function SpotsPage() {
  const spots = await getSpots();
  return <SpotsList spots={spots} />;
}

// lib/actions.ts
export async function getSpots() {
  'use server';
  const { data } = await supabase.from('spots').select('*');
  return data || [];
}
```

### Client Component + useSWR
```typescript
'use client';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';

function InteractiveComponent() {
  const { data, mutate } = useSWR('/api/spots', fetcher);
  
  const handleAction = async () => {
    mutate(optimisticData, false);
    await serverAction();
    mutate();
  };

  return <Button onClick={handleAction}>Action</Button>;
}
```

### フォーム（react-hook-form + zod）
```typescript
const schema = z.object({
  name: z.string().min(1, '必須'),
});

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <p>{errors.name.message}</p>}
    </form>
  );
}
```

### URL状態管理（nuqs）
```typescript
'use client';
import { useQueryState } from 'nuqs';

function SearchFilters() {
  const [search, setSearch] = useQueryState('q');
  return <input value={search || ''} onChange={e => setSearch(e.target.value)} />;
}
```

## 🚫 禁止パターン

| ❌ Bad | ✅ Good |
|--------|---------|
| `useState` でURL状態 | `nuqs` |
| 自作Button | `shadcn/ui Button` |
| React Icons | `lucide-react` |
| Redux/Zustand | React Context (必要時のみ) |
| 汎用Server Action | 特定用途のServer Action |

## 🔒 セキュリティチェックリスト

### Server Actions
- [ ] 認証チェック (`supabase.auth.getUser()`)
- [ ] 入力検証 (Zodスキーマ)
- [ ] 権限チェック (必要に応じて)
- [ ] RLSポリシー設定済み

### Supabase RLS
```sql
-- 基本パターン
CREATE POLICY "policy_name" ON table_name
FOR operation USING (auth.uid() = user_id);
```

## 🎨 UIコンポーネントクイックリファレンス

### よく使うshadcn/ui
```bash
npm run ui:add button card input dialog sheet
npm run ui:add select dropdown-menu avatar badge
npm run ui:add form label textarea checkbox
```

### よく使うlucide-react
```typescript
import { 
  MapPin, Heart, Star, Search, Menu,
  Plus, Edit, Trash, User, Settings 
} from 'lucide-react';
```

## 🚀 デバッグ・パフォーマンス

### 開発時チェック
- [ ] `'use client'` は最小限か？
- [ ] Suspenseでフォールバック設定済みか？
- [ ] next/image, next/link 使用か？
- [ ] dynamic import で遅延読み込みか？

### よくあるエラー
- RLSポリシー不足 → SQL確認
- 認証エラー → `supabase.auth.getUser()` 確認
- 型エラー → Zodスキーマと型定義確認

---

## 📞 困ったときの参考

- [shadcn/ui ドキュメント](https://ui.shadcn.com/)
- [nuqs ドキュメント](https://nuqs.47ng.com/)
- [SWR ドキュメント](https://swr.vercel.app/)
- [react-hook-form ドキュメント](https://react-hook-form.com/)
- [Zod ドキュメント](https://zod.dev/)

このガイドを参考に、一貫性のある高品質なコードを書きましょう！ 