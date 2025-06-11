-- Add 'artists' to existing work_type enum
-- アーティスト（歌手、バンドなど）を作品タイプに追加

ALTER TYPE work_type ADD VALUE 'artists'; 