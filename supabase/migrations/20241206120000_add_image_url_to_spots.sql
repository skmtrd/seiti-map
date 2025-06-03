-- Add image_url column to spots table
-- スポットテーブルにimage_urlカラムを追加

-- Purpose: Allow spots to have associated image URLs for uploaded photos
-- Affected table: spots
-- Type: Non-destructive column addition

-- Add image_url column to spots table
alter table spots 
add column image_url text;

-- Add comment to describe the column purpose
comment on column spots.image_url is 'URL of the uploaded image for this spot';

-- Create index for performance when filtering by image presence
create index idx_spots_has_image on spots(image_url) where image_url is not null; 