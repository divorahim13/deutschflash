-- RUN THIS ENTIRE SCRIPT IN SUPABASE SQL EDITOR
-- This forces the database to recognize the new 'infinitiv' column and adds 'created_at' if missing.

ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS infinitiv TEXT;
NOTIFY pgrst, 'reload schema';
