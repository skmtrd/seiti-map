-- =====================================================
-- Comments Table and Storage Bucket Creation Migration
-- Purpose: Add comments functionality with image support (up to 4 images per comment)
-- Affected: comments table, comment-images storage bucket
-- =====================================================

-- Step 1: Create comments table
-- コメントテーブルの作成（スポットに紐づく、最大4枚の画像対応）
create table comments (
  id uuid primary key default gen_random_uuid(),
  
  -- Foreign keys
  spot_id uuid references spots(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  
  -- Content
  content text not null,
  
  -- Image support (up to 4 images)
  -- 画像URL（最大4枚まで）
  image_url_1 text,
  image_url_2 text,
  image_url_3 text,
  image_url_4 text,
  
  -- Metadata
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  -- Constraints
  constraint content_not_empty check (length(trim(content)) > 0)
);

-- Step 2: Enable Row Level Security
-- RLSの有効化
alter table comments enable row level security;

-- Step 3: Create indexes for performance optimization
-- パフォーマンス最適化のためのインデックス作成
create index idx_comments_spot_id on comments(spot_id);
create index idx_comments_user_id on comments(user_id);
create index idx_comments_created_at on comments(created_at desc);

-- Step 4: Create RLS policies
-- RLSポリシーの作成

-- Allow anonymous users to view all comments
-- 匿名ユーザーによるコメント閲覧を許可
create policy "allow anon users to view comments" on comments
for select 
to anon 
using (true);

-- Allow authenticated users to view all comments
-- 認証ユーザーによるコメント閲覧を許可
create policy "allow authenticated users to view comments" on comments
for select 
to authenticated 
using (true);

-- Allow authenticated users to create comments (only their own)
-- 認証ユーザーによるコメント作成を許可（自分のもののみ）
create policy "allow authenticated users to create comments" on comments
for insert 
to authenticated 
with check ((select auth.uid()) = user_id);

-- Allow authenticated users to update their own comments
-- 認証ユーザーによる自分のコメント更新を許可
create policy "allow authenticated users to update own comments" on comments
for update 
to authenticated 
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Allow authenticated users to delete their own comments
-- 認証ユーザーによる自分のコメント削除を許可
create policy "allow authenticated users to delete own comments" on comments
for delete 
to authenticated 
using ((select auth.uid()) = user_id);

-- Step 5: Create storage bucket for comment images
-- コメント画像用のストレージバケット作成
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'comment-images',
  'comment-images',
  true,
  5242880, -- 5MB limit per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Step 6: Create storage policies for comment images bucket
-- コメント画像バケット用のストレージポリシー作成

-- Allow public access to view comment images
-- コメント画像の公開閲覧を許可
create policy "allow public access to view comment images" on storage.objects
for select 
to public 
using (bucket_id = 'comment-images');

-- Allow authenticated users to upload images to their own folder
-- 認証ユーザーによる自分のフォルダへの画像アップロードを許可
create policy "allow authenticated users to upload comment images" on storage.objects
for insert 
to authenticated 
with check (
  bucket_id = 'comment-images' 
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- Allow authenticated users to update images in their own folder
-- 認証ユーザーによる自分のフォルダ内画像の更新を許可
create policy "allow authenticated users to update own comment images" on storage.objects
for update 
to authenticated 
using (
  bucket_id = 'comment-images' 
  and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id = 'comment-images' 
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- Allow authenticated users to delete images in their own folder
-- 認証ユーザーによる自分のフォルダ内画像の削除を許可
create policy "allow authenticated users to delete own comment images" on storage.objects
for delete 
to authenticated 
using (
  bucket_id = 'comment-images' 
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- Step 7: Create function to update updated_at timestamp
-- updated_atタイムスタンプ更新用の関数作成
create or replace function update_comments_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Update the updated_at column on row modification
  new.updated_at := now();
  return new;
end;
$$;

-- Step 8: Create trigger for automatic updated_at updates
-- 自動updated_at更新用のトリガー作成
create trigger update_comments_updated_at_trigger
before update on public.comments
for each row
execute function update_comments_updated_at(); 