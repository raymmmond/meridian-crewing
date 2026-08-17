-- Run in BOTH Supabase projects — SQL Editor → New query → Run

alter table positions
  add column if not exists filled boolean not null default false;
