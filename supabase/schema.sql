-- Snippet Vault Database Schema

-- 1. Enable Vector Extension (required for AI Semantic Search)
create extension if not exists vector;

-- 2. Create snippets table
create table snippets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  code text not null,
  language text not null,
  tags text[],
  is_favorite boolean default false,
  embedding vector(768),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable Row Level Security (RLS)
alter table snippets enable row level security;

-- 4. Create RLS Policies
create policy "Users can view their own snippets"
  on snippets for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own snippets"
  on snippets for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own snippets"
  on snippets for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own snippets"
  on snippets for delete
  using ( auth.uid() = user_id );

-- 5. Create AI Semantic Search Function (match_snippets)
-- NOTE: security invoker is CRITICAL for RLS to apply to the search results!
create or replace function match_snippets (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid, title text, code text,
  language text, tags text[], similarity float
)
language sql stable
security invoker
set search_path = public
as $$
  select id, title, code, language, tags,
    1 - (embedding <=> query_embedding) as similarity
  from snippets
  where 1 - (embedding <=> query_embedding) > match_threshold
  and user_id = auth.uid()
  order by embedding <=> query_embedding
  limit match_count;
$$;
