create table if not exists public.learning_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  xp_points integer not null default 100,
  status text not null default 'pending' check (status in ('pending','completed')),
  created_at timestamptz not null default timezone('utc', now())
);

-- Index untuk mempercepat query berdasarkan user dan waktu
create index if not exists learning_tasks_user_created_idx on public.learning_tasks (user_id, created_at desc);

-- Aktifkan Row Level Security
alter table public.learning_tasks enable row level security;

-- Policy untuk keamanan data (RLS)
drop policy if exists "select own tasks" on public.learning_tasks;
drop policy if exists "insert own tasks" on public.learning_tasks;
drop policy if exists "update own tasks" on public.learning_tasks;
drop policy if exists "delete own tasks" on public.learning_tasks;

create policy "select own tasks" on public.learning_tasks for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert own tasks" on public.learning_tasks for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own tasks" on public.learning_tasks for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete own tasks" on public.learning_tasks for delete to authenticated using ((select auth.uid()) = user_id);
