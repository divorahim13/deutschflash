-- Create the cards table
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
    
    -- Ensure user cannot have duplicate German words
    UNIQUE(user_id, kata_jerman)
);

-- Enable Row Level Security
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Policies
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
