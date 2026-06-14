-- InterviewIQ schema
-- Run this once in the Supabase SQL Editor

create table public.users (
  id         text        primary key,          -- Clerk user ID
  email      text        not null,
  name       text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
