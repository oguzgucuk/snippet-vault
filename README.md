# Snippet Vault

A personal, AI-powered code snippet manager. Save your code once, find it instantly — even if you don't remember the exact words.

**[Live Demo](https://snippet-vault.vercel.app)**

---

## Features

- **Semantic Search** — Describe what you're looking for in plain language. No need to remember exact file names or keywords.
- **Auto-Tagging** — Tags are generated automatically when you save a snippet. No manual categorization needed.
- **Syntax Highlighting** — Code editor with real-time highlighting for all major languages.
- **Per-user isolation** — Each user sees only their own snippets, enforced at the database level.
- **No separate backend** — All data and AI operations run as secure Server Actions on the server.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) — App Router, Server Actions |
| Database & Auth | [Supabase](https://supabase.com/) — PostgreSQL, RLS |
| Vector Search | [pgvector](https://github.com/pgvector/pgvector) — Cosine similarity |
| AI | [Google Gemini API](https://ai.google.dev/) — `gemini-embedding-2`, `gemini-2.5-flash` |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) |
| Deployment | [Vercel](https://vercel.com/) |

---

## How Semantic Search Works

1. When a snippet is saved, the title and code are sent to `gemini-embedding-2`, which returns a 768-dimensional vector representing the semantic meaning of the content.
2. This vector is stored in Supabase using the `pgvector` extension.
3. On search, the query is embedded using the same model.
4. A Postgres function (`match_snippets`) computes cosine similarity between the query vector and all stored vectors, returning the closest matches.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key

### 1. Clone the repository

```bash
git clone https://github.com/your-username/snippet-vault.git
cd snippet-vault
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Set up the database

Run the following in your Supabase SQL Editor:

```sql
-- Enable vector extension
create extension if not exists vector;

-- Snippets table
create table snippets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  code text not null,
  language text,
  tags text[],
  embedding vector(768),
  created_at timestamp with time zone default now()
);

-- Row Level Security
alter table snippets enable row level security;

create policy "Users can manage their own snippets"
on snippets for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Semantic search function
create or replace function match_snippets (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid, title text, code text,
  language text, tags text[], similarity float
)
language sql stable as $$
  select id, title, code, language, tags,
    1 - (embedding <=> query_embedding) as similarity
  from snippets
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── auth/actions.ts         # Authentication (sign in, sign up, sign out)
│   ├── dashboard/
│   │   ├── actions.ts          # Snippet CRUD + semantic search
│   │   └── page.tsx
│   ├── login/page.tsx
│   └── register/page.tsx
├── components/
│   └── snippets/
│       ├── snippet-list.tsx    # Snippet cards and search bar
│       ├── code-editor.tsx     # Syntax-highlighted editor
│       └── add-snippet-modal.tsx
└── lib/
    ├── ai/gemini.ts            # Gemini AI — tag generation and embeddings
    └── supabase/               # Supabase client helpers
```

---

## License

MIT


---

## ✨ Features

- **🤖 AI-Powered Semantic Search** — Don't just search by keyword. Describe what you need in plain language and the AI will find the most relevant snippet, even if the exact words don't match.
- **🏷️ Auto-Tagging** — When you save a snippet, Gemini AI automatically reads your code and generates relevant tags for you.
- **🎨 Syntax Highlighting** — A beautiful code editor with real-time syntax highlighting for all major languages.
- **🔐 Secure by Default** — Every user can only see and manage their own snippets. Powered by Supabase Row Level Security (RLS).
- **⚡ Fast & Modern** — Built with Next.js 16 App Router and Server Actions for a seamless, full-stack experience.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router + Server Actions) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + RLS) |
| **Vector Search** | [pgvector](https://github.com/pgvector/pgvector) (Cosine Similarity) |
| **AI / Embeddings** | [Google Gemini API](https://ai.google.dev/) (`gemini-embedding-2`, `gemini-2.5-flash`) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🧠 How Semantic Search Works

This project uses **vector embeddings** to enable meaning-based search:

1. When you save a snippet, the code + title is sent to the `gemini-embedding-2` model, which converts it into a **768-dimensional vector** (a mathematical representation of its meaning).
2. This vector is stored in Supabase alongside your snippet using the `pgvector` extension.
3. When you search with the ✨ button, your query is also converted into a vector.
4. A PostgreSQL function (`match_snippets`) calculates the **cosine similarity** between your query vector and all stored vectors, returning the most semantically similar results.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account
- A [Google AI Studio](https://aistudio.google.com) API key

### 1. Clone the repository
```bash
git clone https://github.com/your-username/snippet-vault.git
cd snippet-vault
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy the example file and fill in your own keys:
```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Set up the database
Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable the vector extension
create extension if not exists vector;

-- Create the snippets table
create table snippets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  code text not null,
  language text,
  tags text[],
  embedding vector(768),
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table snippets enable row level security;

-- Create RLS policies
create policy "Users can manage their own snippets"
on snippets for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Create the semantic search function
create or replace function match_snippets (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid, title text, code text,
  language text, tags text[], similarity float
)
language sql stable as $$
  select id, title, code, language, tags,
    1 - (embedding <=> query_embedding) as similarity
  from snippets
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/actions.ts       # Sign in, sign up, sign out
│   ├── dashboard/
│   │   ├── actions.ts        # CRUD operations + AI search
│   │   └── page.tsx          # Main dashboard page
│   ├── login/page.tsx
│   └── register/page.tsx
├── components/
│   └── snippets/
│       ├── snippet-list.tsx  # Snippet cards + search bar
│       ├── code-editor.tsx   # Syntax-highlighted editor
│       └── add-snippet-modal.tsx
└── lib/
    ├── ai/gemini.ts          # Gemini AI (tags + embeddings)
    └── supabase/             # Supabase client setup
```

---

## 📄 License

MIT License — feel free to use this project as a reference or template.
