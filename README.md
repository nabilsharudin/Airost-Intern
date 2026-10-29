# ClubLedger

A responsive budget and expense tracker for campus societies, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## 1. Create the Supabase backend

1. Create a free Supabase project.
2. Open **SQL Editor**, paste [`supabase/schema.sql`](supabase/schema.sql), and run it once.
3. Promote the first treasurer after they sign up:

   ```sql
   update public.users set role = 'treasurer' where email = 'treasurer@example.edu';
   ```

The script creates the database types, tables, indexes, Auth user trigger, private receipt bucket, row-level security policies, and the trigger that keeps `projects.current_spent` synchronized with approved expenses.

## 2. Configure and run the app

```bash
copy .env.example .env.local
npm install
npm run dev
```

Fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from **Supabase → Project Settings → API**. Never put the service-role key in a browser environment variable.

### Preview without Supabase

You can skip `.env.local` and run `npm run dev` immediately. The dashboard automatically opens in demo mode with sample data, a member/treasurer switcher, and browser-local simulated submissions and approvals. Add the Supabase variables later to activate real authentication, persistence, realtime updates, and receipt storage.

Open [http://localhost:3000](http://localhost:3000). Sign up, confirm the email if email confirmation is enabled, and sign in. New accounts are always created as members; role promotion is deliberately server-controlled.

## Application structure

```text
app/
  (auth)/login, signup       Authentication screens
  dashboard/                Role-aware dashboard route
components/
  auth/                      Login and signup forms
  dashboard/                 Member and treasurer workspaces
  ui/                        Reusable shadcn-style primitives
lib/supabase/                Browser, server, and middleware clients
supabase/schema.sql          Complete PostgreSQL + RLS setup
```

Receipt objects remain private. The UI stores only the object path in `expenses.receipt_url` and produces short-lived signed URLs for authorized viewers.
