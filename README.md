# Snippet Vault 🚀

> An AI-Powered Semantic Code Snippet Manager built with Next.js 15, Supabase, and Google Gemini.

Snippet Vault is a modern, developer-centric application designed to securely store, organize, and intelligently retrieve your code snippets. Stop relying on exact keywords—our AI-powered semantic search understands the *meaning* of your code, so you can find what you need by simply asking naturally.

---

## ✨ Features

- **🧠 AI Semantic Search**: Powered by Google Gemini embeddings and Supabase Vector (pgvector). Search for "how to fetch data" and it will find your `axios.get` snippet even if the words don't match.
- **🎨 Beautiful UI**: Built with Tailwind CSS, Shadcn UI, and Lucide icons. Features a stunning dark mode glassmorphism aesthetic.
- **📝 Syntax Highlighting**: Integrated `prismjs` for beautiful, editable code blocks supporting 10+ languages (TypeScript, Python, Bash, SQL, etc.).
- **🔐 Secure & Private**: Complete authentication and Row Level Security (RLS) via Supabase. Your snippets are strictly yours.
- **📱 Responsive Design**: Fully responsive with a dedicated mobile navigation bar for on-the-go access.
- **⚡ Next.js 15 App Router**: Utilizing the latest React 19 features like `useActionState` and Server Actions for lightning-fast performance without client-side waterfalls.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + pgvector)
- **AI / Embeddings**: [Google GenAI SDK](https://ai.google.dev/) (Gemini `text-embedding-004`)
- **Validation**: [Zod](https://zod.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v18 or higher)
- A Supabase account (Free tier is perfect)
- A Google Gemini API Key

### 2. Clone the repository

```bash
git clone https://github.com/yourusername/snippet-vault.git
cd snippet-vault
```

### 3. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 4. Setup Environment Variables

Create a `.env.local` file in the root directory and add your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 5. Setup Database Schema (Supabase)

Go to your Supabase project dashboard, open the **SQL Editor**, and paste the contents of `supabase/schema.sql` to initialize your tables, RLS policies, and Vector Search functions.

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🛡️ Security

This project employs strict security measures:
- **XSS Prevention**: React's safe rendering combined with validated Prism.js injections.
- **SQLi Protection**: Parameterized queries via Supabase JS Client.
- **Data Privacy**: PostgreSQL Row Level Security (RLS) ensures users can only read/write/delete their own data, even at the AI search level (`security invoker`).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
