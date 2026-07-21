-- RSVP table for the wedding invitation site
-- Run this in your Supabase SQL editor

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  guests integer not null default 1 check (guests >= 1 and guests <= 10),
  attending text not null check (attending in ('yes', 'no', 'maybe')),
  message text,
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;

create policy "Allow public inserts"
  on public.rsvps
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow owners to read"
  on public.rsvps
  for select
  to authenticated
  using (true);
