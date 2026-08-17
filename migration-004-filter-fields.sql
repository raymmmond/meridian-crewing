-- Run in BOTH Supabase projects — SQL Editor → New query → Run

alter table positions
  add column if not exists wage_min integer;

alter table positions
  add column if not exists contract_months integer;
