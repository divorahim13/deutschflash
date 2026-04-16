-- Run this in Supabase SQL Editor to fix the schema cache issue

-- 1. Add infinitiv column (if not already added)
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS infinitiv TEXT;

-- 2. Reload PostgREST schema cache so Supabase picks up the new column
NOTIFY pgrst, 'reload schema';
