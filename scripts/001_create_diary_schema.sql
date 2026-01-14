-- Create diary_entries table
create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  content text not null,
  word_count int default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, entry_date)
);

-- Enable RLS on diary_entries
alter table public.diary_entries enable row level security;

-- RLS policies for diary_entries
create policy "Users can view their own entries"
  on public.diary_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own entries"
  on public.diary_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own entries"
  on public.diary_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own entries"
  on public.diary_entries for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists idx_diary_entries_user_date on public.diary_entries(user_id, entry_date);
