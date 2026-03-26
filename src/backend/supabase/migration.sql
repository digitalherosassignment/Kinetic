-- KINETIC Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  location TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('essential', 'elite')),
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled')),
  amount DECIMAL(10,2) NOT NULL,
  charity_percentage INTEGER DEFAULT 10 CHECK (charity_percentage >= 10),
  started_at TIMESTAMPTZ DEFAULT now(),
  renewal_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Charities
CREATE TABLE IF NOT EXISTS public.charities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  impact_goal_percent INTEGER DEFAULT 0,
  impact_metric TEXT,
  impact_value TEXT,
  is_featured BOOLEAN DEFAULT false,
  total_raised DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Charity Selections
CREATE TABLE IF NOT EXISTS public.user_charities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
  contribution_percentage INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, charity_id)
);

-- Golf Scores
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  played_at DATE NOT NULL,
  course_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Draws
CREATE TABLE IF NOT EXISTS public.draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_date DATE NOT NULL,
  draw_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'simulated', 'published')),
  draw_type TEXT DEFAULT 'random' CHECK (draw_type IN ('random', 'algorithmic')),
  winning_numbers INTEGER[] NOT NULL DEFAULT '{}',
  total_pool DECIMAL(12,2) DEFAULT 0,
  tier1_pool DECIMAL(12,2) DEFAULT 0,
  tier2_pool DECIMAL(12,2) DEFAULT 0,
  tier3_pool DECIMAL(12,2) DEFAULT 0,
  jackpot_rollover DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- Draw Entries
CREATE TABLE IF NOT EXISTS public.draw_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  numbers INTEGER[] NOT NULL,
  match_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(draw_id, user_id)
);

-- Winners
CREATE TABLE IF NOT EXISTS public.winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_tier INTEGER NOT NULL CHECK (match_tier IN (3, 4, 5)),
  prize_amount DECIMAL(10,2) NOT NULL,
  proof_url TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  created_at TIMESTAMPTZ DEFAULT now(),
  verified_at TIMESTAMPTZ
);

-- Donations
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  source TEXT DEFAULT 'subscription' CHECK (source IN ('subscription', 'independent')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Subscriptions: users see own
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- User charities: users manage own selection
CREATE POLICY "Users can view own charity selection" ON public.user_charities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own charity selection" ON public.user_charities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own charity selection" ON public.user_charities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own charity selection" ON public.user_charities FOR DELETE USING (auth.uid() = user_id);

-- Charities: public read
CREATE POLICY "Charities are viewable by everyone" ON public.charities FOR SELECT USING (true);
CREATE POLICY "Admins can manage charities" ON public.charities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Scores: users see own
CREATE POLICY "Users can view own scores" ON public.scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON public.scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scores" ON public.scores FOR DELETE USING (auth.uid() = user_id);

-- Draws: public read published
CREATE POLICY "Published draws are viewable" ON public.draws FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage draws" ON public.draws FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Draw entries: users see own, admins manage all
CREATE POLICY "Users can view own draw entries" ON public.draw_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage draw entries" ON public.draw_entries FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Winners: public read
CREATE POLICY "Winners are viewable by everyone" ON public.winners FOR SELECT USING (true);
CREATE POLICY "Admins can update winners" ON public.winners FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Donations: users see own, admins manage all
CREATE POLICY "Users can view own donations" ON public.donations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own donations" ON public.donations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage donations" ON public.donations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Seed sample charities
INSERT INTO public.charities (name, description, category, image_url, impact_goal_percent, impact_metric, impact_value, is_featured, total_raised) VALUES
('Ocean Kinetic', 'Removing plastic waste from coastal ecosystems through autonomous recovery technology.', 'Environment', '', 82, 'Tons Recovered', '12,400', true, 42000),
('Root Momentum', 'Restoring critical biodiverse forests in sub-Saharan Africa to combat desertification.', 'Environment', '', 45, 'Trees Planted', '2.1M', false, 28500),
('Alpha Scholar', 'Providing high-performance educational tools to underprivileged STEM students worldwide.', 'Education', '', 68, 'Scholarships', '15,000', true, 35200),
('Kinetic Health Fund', 'Providing critical orthopedic care and physical therapy for athletes in underserved communities.', 'Health', '', 55, 'Patients Treated', '3,200', false, 19800),
('Global Youth Initiative', 'Empowering the next generation through structured mentorship and sports programs.', 'Youth', '', 84, 'Youth Impacted', '8,500', true, 51000);
