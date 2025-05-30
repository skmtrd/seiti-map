-- Step 3: Create spots table
-- スポットテーブルの作成

create table spots (
  id uuid primary key default gen_random_uuid(),
  work_id uuid references works(id) on delete cascade,
  name varchar(255) not null,
  description text,
  scene_description text,
  -- 位置情報
  latitude decimal(10, 8) not null,
  longitude decimal(11, 8) not null,
  address text,
  prefecture varchar(50),
  city varchar(100),
  -- メタデータ
  visit_difficulty integer check (visit_difficulty >= 1 and visit_difficulty <= 5),
  best_visit_time varchar(100),
  access_info text,
  -- 管理情報
  submitted_by uuid references auth.users(id),
  is_public boolean default true,
  -- 統計
  view_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS有効化
alter table spots enable row level security;

-- 基本的なインデックス
create index idx_spots_work_id on spots(work_id);
create index idx_spots_location on spots(latitude, longitude);
create index idx_spots_prefecture on spots(prefecture);
create index idx_spots_public on spots(is_public); 