-- Create user_settings table for PIN and other preferences
create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  pin_hash text, -- bcrypt hash of the PIN
  pin_enabled boolean default false,
  display_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on user_settings
alter table public.user_settings enable row level security;

-- RLS policies for user_settings
create policy "Users can view their own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own settings"
  on public.user_settings for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists idx_user_settings_user_id on public.user_settings(user_id);

-- Function to update updated_at timestamp
create or replace function update_user_settings_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at
create trigger user_settings_updated_at
  before update on public.user_settings
  for each row
  execute function update_user_settings_updated_at();
