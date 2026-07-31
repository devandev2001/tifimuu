-- Tiffimu site content (single JSON document edited by /admin)
-- Run this in Supabase → SQL Editor → New query → Run

create table if not exists public.site_content (
  id text primary key default 'default',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Public website can read content
drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content
  for select
  to anon, authenticated
  using (true);

-- Only signed-in admins can insert/update/delete
drop policy if exists "Authenticated can insert site content" on public.site_content;
create policy "Authenticated can insert site content"
  on public.site_content
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update site content" on public.site_content;
create policy "Authenticated can update site content"
  on public.site_content
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete site content" on public.site_content;
create policy "Authenticated can delete site content"
  on public.site_content
  for delete
  to authenticated
  using (true);
