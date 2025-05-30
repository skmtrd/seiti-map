-- Step 1: Create ENUM types for seiti-map
-- 必要なENUMタイプの定義

-- 作品タイプのENUM
create type work_type as enum (
  'anime', 'drama', 'movie', 'game', 'novel', 'manga', 'other'
);

-- 画像タイプのENUM（後で使用）
create type image_type_enum as enum (
  'official', 'user_photo', 'comparison', 'scene_reference'
); 