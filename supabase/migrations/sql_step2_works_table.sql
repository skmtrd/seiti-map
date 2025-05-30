-- Step 2: Create works table (basic version)
-- 作品テーブルの作成（基本版）

create table works (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  title_english varchar(255),
  type work_type not null,
  genre varchar(100),
  release_year integer,
  description text,
  image_url text,
  official_website text,
  is_public boolean default true,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS有効化
alter table works enable row level security;

-- 基本的なインデックス
create index idx_works_type on works(type);
create index idx_works_public on works(is_public); 