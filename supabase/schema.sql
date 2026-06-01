-- DS Stream — Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: profiles
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  avatar_url TEXT,
  is_kids BOOLEAN DEFAULT FALSE NOT NULL,
  pin TEXT,
  idioma_audio TEXT DEFAULT 'pt-BR' NOT NULL,
  idioma_legenda TEXT DEFAULT 'pt-BR' NOT NULL,
  qualidade TEXT DEFAULT 'auto' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =============================================
-- TABLE: contents
-- =============================================
CREATE TABLE IF NOT EXISTS public.contents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tipo TEXT CHECK (tipo IN ('filme', 'serie')) NOT NULL,
  titulo TEXT NOT NULL,
  sinopse TEXT NOT NULL,
  ano INTEGER NOT NULL,
  duracao_min INTEGER,
  classificacao_etaria TEXT NOT NULL DEFAULT 'L',
  generos TEXT[] DEFAULT '{}' NOT NULL,
  thumbnail_url TEXT NOT NULL,
  backdrop_url TEXT NOT NULL,
  trailer_url TEXT,
  avaliacao NUMERIC(3,1) DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =============================================
-- TABLE: episodes
-- =============================================
CREATE TABLE IF NOT EXISTS public.episodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
  temporada INTEGER NOT NULL DEFAULT 1,
  numero_episodio INTEGER NOT NULL,
  titulo TEXT NOT NULL,
  sinopse TEXT NOT NULL,
  duracao_min INTEGER NOT NULL,
  thumbnail_url TEXT NOT NULL,
  video_url TEXT NOT NULL,
  UNIQUE(content_id, temporada, numero_episodio)
);

-- =============================================
-- TABLE: watch_history
-- =============================================
CREATE TABLE IF NOT EXISTS public.watch_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES public.episodes(id) ON DELETE SET NULL,
  progresso_segundos INTEGER DEFAULT 0 NOT NULL,
  assistido_em TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  concluido BOOLEAN DEFAULT FALSE NOT NULL,
  UNIQUE(profile_id, content_id, episode_id)
);

-- =============================================
-- TABLE: my_list
-- =============================================
CREATE TABLE IF NOT EXISTS public.my_list (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
  adicionado_em TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(profile_id, content_id)
);

-- =============================================
-- TABLE: ratings
-- =============================================
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
  curtiu BOOLEAN NOT NULL,
  avaliado_em TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(profile_id, content_id)
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.my_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only access their own profiles
CREATE POLICY "Users can view own profiles" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profiles" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profiles" ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Contents: publicly readable
CREATE POLICY "Contents are publicly readable" ON public.contents
  FOR SELECT USING (TRUE);

-- Episodes: publicly readable
CREATE POLICY "Episodes are publicly readable" ON public.episodes
  FOR SELECT USING (TRUE);

-- Watch history: profile-level access
CREATE POLICY "Users can view own watch history" ON public.watch_history
  FOR SELECT USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can upsert own watch history" ON public.watch_history
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- My list: profile-level access
CREATE POLICY "Users can view own list" ON public.my_list
  FOR SELECT USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage own list" ON public.my_list
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- Ratings: profile-level access
CREATE POLICY "Users can view own ratings" ON public.ratings
  FOR SELECT USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage own ratings" ON public.ratings
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_episodes_content_id ON public.episodes(content_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_profile_id ON public.watch_history(profile_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_content_id ON public.watch_history(content_id);
CREATE INDEX IF NOT EXISTS idx_my_list_profile_id ON public.my_list(profile_id);
CREATE INDEX IF NOT EXISTS idx_ratings_profile_id ON public.ratings(profile_id);
CREATE INDEX IF NOT EXISTS idx_contents_tipo ON public.contents(tipo);
CREATE INDEX IF NOT EXISTS idx_contents_avaliacao ON public.contents(avaliacao DESC);

-- =============================================
-- STORAGE BUCKET for thumbnails
-- =============================================
-- Run this separately in Supabase Storage settings:
-- Create a bucket named "thumbnails" with public access
-- Create a bucket named "videos" with authenticated access
-- Create a bucket named "subtitles" with authenticated access

COMMENT ON TABLE public.profiles IS 'User profiles — up to 5 per account';
COMMENT ON TABLE public.contents IS 'Movies and series catalog';
COMMENT ON TABLE public.episodes IS 'Episodes for series content';
COMMENT ON TABLE public.watch_history IS 'Per-profile watch progress tracking';
COMMENT ON TABLE public.my_list IS 'Per-profile saved content list';
COMMENT ON TABLE public.ratings IS 'Per-profile content ratings (like/dislike)';
