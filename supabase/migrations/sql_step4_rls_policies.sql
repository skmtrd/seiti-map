-- Step 4: Create RLS policies for works and spots tables
-- Supabase公式ルール完全準拠のRLSポリシー定義

-- ===================================
-- WORKS TABLE POLICIES
-- ===================================

-- SELECT policies for works
-- 匿名ユーザー: 公開作品のみ閲覧可能
create policy "allow anon users to view public works"
on works
for select
to anon
using (is_public = true);

-- 認証ユーザー: 公開作品のみ閲覧可能
create policy "allow authenticated users to view public works"
on works
for select
to authenticated
using (is_public = true);

-- INSERT policies for works
-- 認証ユーザー: 自分の作品として作成可能
create policy "allow authenticated users to create works"
on works
for insert
to authenticated
with check (
  (select auth.uid()) = created_by
);

-- UPDATE policies for works
-- 認証ユーザー: 自分が作成した作品のみ編集可能
create policy "allow authenticated users to update their own works"
on works
for update
to authenticated
using ((select auth.uid()) = created_by)
with check ((select auth.uid()) = created_by);

-- DELETE policies for works
-- 認証ユーザー: 自分が作成した作品のみ削除可能
create policy "allow authenticated users to delete their own works"
on works
for delete
to authenticated
using ((select auth.uid()) = created_by);

-- ===================================
-- SPOTS TABLE POLICIES
-- ===================================

-- SELECT policies for spots
-- 匿名ユーザー: 公開スポットのみ閲覧可能
create policy "allow anon users to view public spots"
on spots
for select
to anon
using (is_public = true);

-- 認証ユーザー: 公開スポットのみ閲覧可能
create policy "allow authenticated users to view public spots"
on spots
for select
to authenticated
using (is_public = true);

-- INSERT policies for spots
-- 認証ユーザー: 自分のスポットとして投稿可能
create policy "allow authenticated users to create spots"
on spots
for insert
to authenticated
with check (
  (select auth.uid()) = submitted_by
);

-- UPDATE policies for spots
-- 認証ユーザー: 自分が投稿したスポットのみ編集可能
create policy "allow authenticated users to update their own spots"
on spots
for update
to authenticated
using ((select auth.uid()) = submitted_by)
with check ((select auth.uid()) = submitted_by);

-- DELETE policies for spots
-- 認証ユーザー: 自分が投稿したスポットのみ削除可能
create policy "allow authenticated users to delete their own spots"
on spots
for delete
to authenticated
using ((select auth.uid()) = submitted_by); 