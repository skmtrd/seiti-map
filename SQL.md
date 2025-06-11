-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  spot_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL CHECK (length(TRIM(BOTH FROM content)) > 0),
  image_url_1 text,
  image_url_2 text,
  image_url_3 text,
  image_url_4 text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT comments_pkey PRIMARY KEY (id),
  CONSTRAINT comments_spot_id_fkey FOREIGN KEY (spot_id) REFERENCES public.spots(id),
  CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.spots (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  work_id uuid,
  name character varying NOT NULL,
  description text,
  scene_description text,
  latitude text NOT NULL,
  longitude text NOT NULL,
  address text,
  prefecture character varying,
  city character varying,
  visit_difficulty integer CHECK (visit_difficulty >= 1 AND visit_difficulty <= 5),
  best_visit_time character varying,
  access_info text,
  submitted_by uuid,
  is_public boolean DEFAULT true,
  view_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  image_url text,
  CONSTRAINT spots_pkey PRIMARY KEY (id),
  CONSTRAINT spots_work_id_fkey FOREIGN KEY (work_id) REFERENCES public.works(id),
  CONSTRAINT spots_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES auth.users(id)
);
CREATE TABLE public.works (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  title_english character varying,
  type USER-DEFINED NOT NULL,
  genre character varying,
  release_year integer,
  description text,
  image_url text,
  official_website text,
  is_public boolean DEFAULT true,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT works_pkey PRIMARY KEY (id),
  CONSTRAINT works_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);