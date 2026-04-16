-- Add grammar metadata columns to cards table
ALTER TABLE public.cards
ADD COLUMN IF NOT EXISTS article TEXT,
ADD COLUMN IF NOT EXISTS plural TEXT,
ADD COLUMN IF NOT EXISTS regular_or_irregular TEXT,
ADD COLUMN IF NOT EXISTS trennbar_or_untrennbar TEXT,
ADD COLUMN IF NOT EXISTS transitive_or_intransitive TEXT,
ADD COLUMN IF NOT EXISTS grammar_note TEXT,
ADD COLUMN IF NOT EXISTS retrieval_question TEXT,
ADD COLUMN IF NOT EXISTS source_context TEXT;
