-- Create profiles table that references auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subscriptions table
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null check (status in ('active', 'inactive', 'trial')),
  credits integer not null default 2,
  subscription_type text check (subscription_type in ('free', 'premium')),
  subscription_start_date timestamp with time zone,
  subscription_end_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Create playlist_generations table to track usage
create table if not exists public.playlist_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  emotion_input text not null,
  playlist_name text,
  tracks_count integer not null default 0,
  language text not null default 'es',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.playlist_generations enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Subscriptions policies
create policy "Users can view their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can update their own subscription"
  on public.subscriptions for update
  using (auth.uid() = user_id);

-- Playlist generations policies
create policy "Users can view their own generations"
  on public.playlist_generations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own generations"
  on public.playlist_generations for insert
  with check (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists playlist_generations_user_id_idx on public.playlist_generations(user_id);
