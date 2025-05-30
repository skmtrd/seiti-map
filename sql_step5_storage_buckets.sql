-- Step 5: Create Storage buckets and policies
-- 現時点で必要なStorageバケットの作成

-- ===================================
-- CREATE STORAGE BUCKETS
-- ===================================

-- 作品ポスター画像用バケット
insert into storage.buckets (id, name, public)
values ('work-posters', 'work-posters', true);

-- スポット画像用バケット
insert into storage.buckets (id, name, public)
values ('spot-images', 'spot-images', true);

-- ===================================
-- WORK-POSTERS BUCKET POLICIES
-- ===================================

-- SELECT policies for work-posters
-- 匿名ユーザー: 作品ポスター閲覧可能
create policy "allow anon users to view work posters"
on storage.objects
for select
to anon
using (bucket_id = 'work-posters');

-- 認証ユーザー: 作品ポスター閲覧可能
create policy "allow authenticated users to view work posters"
on storage.objects
for select
to authenticated
using (bucket_id = 'work-posters');

-- INSERT policies for work-posters
-- 認証ユーザー: 自分のフォルダに作品ポスターアップロード可能
create policy "allow authenticated users to upload work posters"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'work-posters'
  and (select auth.uid()) = owner
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- UPDATE policies for work-posters
-- 認証ユーザー: 自分がアップロードした作品ポスターのみ更新可能
create policy "allow authenticated users to update their own work posters"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'work-posters'
  and (select auth.uid()) = owner
)
with check (
  bucket_id = 'work-posters'
  and (select auth.uid()) = owner
);

-- DELETE policies for work-posters
-- 認証ユーザー: 自分がアップロードした作品ポスターのみ削除可能
create policy "allow authenticated users to delete their own work posters"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'work-posters'
  and (select auth.uid()) = owner
);

-- ===================================
-- SPOT-IMAGES BUCKET POLICIES
-- ===================================

-- SELECT policies for spot-images
-- 匿名ユーザー: スポット画像閲覧可能
create policy "allow anon users to view spot images"
on storage.objects
for select
to anon
using (bucket_id = 'spot-images');

-- 認証ユーザー: スポット画像閲覧可能
create policy "allow authenticated users to view spot images"
on storage.objects
for select
to authenticated
using (bucket_id = 'spot-images');

-- INSERT policies for spot-images
-- 認証ユーザー: 自分のフォルダにスポット画像アップロード可能
create policy "allow authenticated users to upload spot images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'spot-images'
  and (select auth.uid()) = owner
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- UPDATE policies for spot-images
-- 認証ユーザー: 自分がアップロードしたスポット画像のみ更新可能
create policy "allow authenticated users to update their own spot images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'spot-images'
  and (select auth.uid()) = owner
)
with check (
  bucket_id = 'spot-images'
  and (select auth.uid()) = owner
);

-- DELETE policies for spot-images
-- 認証ユーザー: 自分がアップロードしたスポット画像のみ削除可能
create policy "allow authenticated users to delete their own spot images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'spot-images'
  and (select auth.uid()) = owner
); 