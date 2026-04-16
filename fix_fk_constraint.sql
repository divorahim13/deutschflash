-- ============================================================
-- FIX FK CONSTRAINT: Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Check what FK constraints currently exist on cards table
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_schema AS foreign_table_schema,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'cards';

-- Step 2: Drop the broken FK constraint
ALTER TABLE public.cards DROP CONSTRAINT IF EXISTS cards_user_id_fkey;

-- Step 3: Recreate the FK referencing auth.users correctly
ALTER TABLE public.cards 
  ADD CONSTRAINT cards_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Step 4: Verify it's correct now
SELECT 
  conname AS constraint_name,
  confrelid::regclass AS references_table
FROM pg_constraint
WHERE conrelid = 'public.cards'::regclass AND contype = 'f';
