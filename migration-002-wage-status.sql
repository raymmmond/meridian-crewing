-- Run this in BOTH Supabase projects (dev and production) — SQL Editor → New query → Run

alter table positions
  add column if not exists wage text;

alter table applications
  add column if not exists status text not null default 'SUBMITTED'
    check (status in ('SUBMITTED', 'SHORTLISTED', 'OFFERED', 'REJECTED'));
