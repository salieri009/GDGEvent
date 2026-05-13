-- =============================================================
-- Doggie Doodles - Supabase Schema
-- Run this in the Supabase SQL Editor to set up the database.
-- =============================================================

-- -------------------------
-- PETS TABLE
-- -------------------------
create table if not exists public.pets (
  id          text primary key,
  name        text not null,
  quote       text,
  description text,
  image_url   text,
  age         text,
  breed       text,
  likes       text[]     default '{}',
  tags        text[]     default '{}',
  status      text       not null default 'available'
                         check (status in ('available', 'pending', 'adopted')),
  ref_id      text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Row Level Security
alter table public.pets enable row level security;

-- Anyone can read pets
create policy "Public read pets"
  on public.pets for select
  using (true);

-- Only authenticated service role can insert/update/delete
create policy "Service role full access on pets"
  on public.pets for all
  using (auth.role() = 'service_role');

-- -------------------------
-- ADOPTION APPLICATIONS TABLE
-- -------------------------
create table if not exists public.adoption_applications (
  id            uuid primary key default gen_random_uuid(),
  pet_id        text not null references public.pets(id) on delete cascade,
  applicant_name text not null,
  favorite_snack text,
  promise_given  boolean not null default false,
  status         text not null default 'pending'
                 check (status in ('pending', 'approved', 'rejected')),
  created_at     timestamptz not null default now()
);

alter table public.adoption_applications enable row level security;

-- Anyone can submit an adoption application
create policy "Anyone can insert adoption application"
  on public.adoption_applications for insert
  with check (true);

-- Only service role can read/update/delete applications
create policy "Service role full access on applications"
  on public.adoption_applications for all
  using (auth.role() = 'service_role');

-- -------------------------
-- AUTO-UPDATE updated_at
-- -------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pets_updated_at
  before update on public.pets
  for each row execute procedure public.set_updated_at();

-- -------------------------
-- SEED DATA
-- -------------------------
insert into public.pets (id, name, quote, description, image_url, age, breed, likes, tags, status, ref_id)
values
  (
    'buster', 'Buster', 'Very Wiggly',
    'Buster is a professional shoe-stealer and champion tail-wagger. He enjoys chasing things that don''t exist and barking at his own reflection in the water bowl.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB8InHcQ2rc65IVAtvNwa0KJdFCMFwAQYsHmsLvFw8QDm9JDl669FKCAD7F7Paa3Wt51Q72yVF2a8J6dyVvyW08blLmrXsPHAI9GO_uyUhlYwf5l68rd9yMLTL5mcnEqGnfjXWgQctHmPC1S6bLuT01G2jlBHI-KVzHZXoyMK4hpi6_5tVUzaxeZDZd4Rd0rbL479x9sE6R6tXl8OF_u6tkNq2I3ShHdwPitWECFMEAa4ZWCVZpOlgxjgJPEgBmNMOLALvY9_6VS3CK',
    '3 Years Old (approx)', 'Golden-ish Retriever',
    ARRAY['Shoes','Dirt','Air'], ARRAY['Big Ears','Very Wiggly'],
    'available', 'DOG-001-MSPAINT'
  ),
  (
    'luna', 'Luna', 'Expert Napper',
    'Luna can sleep through a thunderstorm but will wake up if a single cracker is touched three rooms away.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDxsh8FnBpTFR91RnYLwL1Q-36u26UsHxFpadhKvPuUcUtASwxeUMDoPovbh7cqnn8gQIRvsMzjIytl5DTnjkbkPmTFBDJKYDAu3Z5UYr_VgnSt9TEWQ5QEHJLcbv6zCwMFamjZDQx32bT1rer0TefU6wCF92ZHClHdbhLkBTOUskrnZRpIsAlW39tNiUja173IwZTSlZ4pdGPVkm4u9MjHeGFDiPWIsu8BItLKTnGUDfmh2EJE3jDx3VzXmJrcdYEpK6S_tb6Nr4Z0',
    '2 Years Old', 'Cloud Terrier',
    ARRAY['Naptime','Crackers','Soft Blankets'], ARRAY['Expert Napper','Small'],
    'available', 'DOG-002-SOFT'
  ),
  (
    'cloud', 'Cloud', 'Loves Socks',
    'Mostly fluff, 100% chaos. Cloud is a white ball of energy that somehow always finds the muddiest puddle.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAHVJ1b_X4zeIAbO5_w1ZmKbnvnS8kzg63sc_sST7RWMJ3J6o1Etw-ghmjURTyjX5oBdAKZWkJpfiVa2Sq-bWMhZZhULkGYJIukT_kkt_S0mCs3rqXMMeW8NJNHMy6I5w2wSClu8JyvLXUylGzGPJ8uzekUuxvH8qTfrli4G_PdMu7XZYUI8I30XfAR_lnNpFSTUsp3_czvlefmC25PQaoN4S-617vIt3j1AUTZgBR1AWChVGN5c8vxZ83GTRyPpJVO5CS5vNofAuYr',
    '1 Year Old', 'Bichon-esque Samoyed',
    ARRAY['Socks','Mud','Zoomies'], ARRAY['Chaos','Fluffy'],
    'available', 'DOG-003-FLUFF'
  ),
  (
    'daisy', 'Daisy', 'Gentle Soul',
    'Daisy is the kind of dog who will sit on your foot just to make sure you''re still there. She is terrified of toasters but loves vacuum cleaners.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAbGW5dzX78d5rRmSDOllkHcZOJGp0K3D5LL71OWpJWFcxPnL-21UceC_xRj4MTNrX4MbbG1bDos105WesXEX_CP3go1BudhYPZkI6P9dvS9RanXeX30vLgzApPsNYSSvR_YGmh6KkITUbkxw94vw1hsolRoqQqnE8rSotFbZL7FY-daVPqo1mD9vLehLsrENAocNuqHmT2lCNNrOUDlNpJdASidKdudn5Wf-QjpkeHoCD9-KJZdgq1J3Mg7JYc-53CO_5xgSXb2Uk9',
    '5 Years Old', 'Golden Retriever (Mostly)',
    ARRAY['Feet','Vacuums','Quiet Moments'], ARRAY['Sweet Soul','Gentle'],
    'available', 'DOG-004-GOLD'
  )
on conflict (id) do nothing;
