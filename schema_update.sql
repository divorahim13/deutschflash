-- Create review logs for tracking progress over time
CREATE TABLE IF NOT EXISTS public.review_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.review_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own logs" 
ON public.review_logs FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own logs" 
ON public.review_logs FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- NOTE: Ensure 'cards' and 'review_logs' are added to the 'supabase_realtime' publication 
-- in your Supabase Dashboard under Database -> Replication.
