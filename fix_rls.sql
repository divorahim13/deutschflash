-- ============================================
-- FIX SCRIPT: Run this in Supabase SQL Editor
-- ============================================

-- 1. Create cards table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    kata_jerman TEXT NOT NULL,
    arti_indo TEXT NOT NULL,
    front TEXT,
    back TEXT,
    tags TEXT[] DEFAULT '{}',
    easiness FLOAT DEFAULT 2.5,
    interval_days INTEGER DEFAULT 1,
    next_review TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reps INTEGER DEFAULT 0,
    lapses INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    article TEXT,
    plural TEXT,
    regular_or_irregular TEXT,
    trennbar_or_untrennbar TEXT,
    transitive_or_intransitive TEXT,
    grammar_note TEXT,
    retrieval_question TEXT,
    source_context TEXT,
    UNIQUE(user_id, kata_jerman)
);

-- 2. Add new columns if table already exists (safe to run multiple times)
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS article TEXT;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS plural TEXT;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS regular_or_irregular TEXT;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS trennbar_or_untrennbar TEXT;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS transitive_or_intransitive TEXT;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS grammar_note TEXT;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS retrieval_question TEXT;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS source_context TEXT;

-- 3. Enable Row Level Security
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies (to avoid conflicts) and recreate
DROP POLICY IF EXISTS "Users can create their own cards" ON public.cards;
DROP POLICY IF EXISTS "Users can view their own cards" ON public.cards;
DROP POLICY IF EXISTS "Users can update their own cards" ON public.cards;
DROP POLICY IF EXISTS "Users can delete their own cards" ON public.cards;

-- 5. Recreate policies correctly
CREATE POLICY "Users can create their own cards" 
ON public.cards FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own cards" 
ON public.cards FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards" 
ON public.cards FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards" 
ON public.cards FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
