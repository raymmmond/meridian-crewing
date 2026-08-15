-- Run in BOTH Supabase projects — SQL Editor → New query → Run

-- Step 1: drop the old constraint so existing rows can be updated freely
alter table positions drop constraint if exists positions_rank_check;

-- Step 2: migrate existing rows into the new, more specific categories,
-- inferred from the role title text. This only reclassifies — it never
-- touches the role/vessel/wage/etc. fields themselves.
update positions set rank = 'ENGINE_OFFICER'
  where rank = 'OFFICER' and role ilike '%engineer%';
update positions set rank = 'DECK_OFFICER'
  where rank = 'OFFICER' and role not ilike '%engineer%';
update positions set rank = 'ENGINE_RATING'
  where rank = 'RATING' and (
    role ilike '%motorman%' or role ilike '%oiler%' or
    role ilike '%wiper%' or role ilike '%fitter%'
  );
update positions set rank = 'DECK_RATING'
  where rank = 'RATING' and not (
    role ilike '%motorman%' or role ilike '%oiler%' or
    role ilike '%wiper%' or role ilike '%fitter%'
  );
-- CATERING rows need no change — that category still exists as-is.

-- Step 3: add the new, wider constraint
alter table positions add constraint positions_rank_check
  check (rank in (
    'DECK_OFFICER', 'ENGINE_OFFICER', 'ELECTRO_TECHNICAL',
    'DECK_RATING', 'ENGINE_RATING', 'CATERING'
  ));
