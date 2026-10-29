-- ClubLedger V1 — run this entire file once in the Supabase SQL Editor.
create extension if not exists pgcrypto;
create type public.user_role as enum ('member', 'treasurer');
create type public.expense_status as enum ('pending', 'approved', 'rejected');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role public.user_role not null default 'member'
);
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 100),
  allocated_budget numeric(12,2) not null check (allocated_budget >= 0),
  current_spent numeric(12,2) not null default 0 check (current_spent >= 0),
  created_at timestamptz not null default now()
);
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  user_id uuid not null references public.users(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  description text not null check (char_length(trim(description)) between 3 and 500),
  receipt_url text,
  status public.expense_status not null default 'pending',
  submitted_at timestamptz not null default now()
);
create index expenses_user_id_idx on public.expenses(user_id);
create index expenses_project_status_idx on public.expenses(project_id, status);
create index expenses_submitted_at_idx on public.expenses(submitted_at desc);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.users (id, email, role) values (new.id, coalesce(new.email, ''), 'member');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_treasurer() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'treasurer');
$$;
revoke all on function public.is_treasurer() from public;
grant execute on function public.is_treasurer() to authenticated;

alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.expenses enable row level security;
create policy "users read own profile or treasurers read all" on public.users for select to authenticated
using (id = auth.uid() or public.is_treasurer());
create policy "authenticated users read projects" on public.projects for select to authenticated using (true);
create policy "treasurers insert projects" on public.projects for insert to authenticated with check (public.is_treasurer());
create policy "treasurers update projects" on public.projects for update to authenticated
using (public.is_treasurer()) with check (public.is_treasurer());
create policy "treasurers delete projects" on public.projects for delete to authenticated using (public.is_treasurer());
create policy "members read own expenses and treasurers read all" on public.expenses for select to authenticated
using (user_id = auth.uid() or public.is_treasurer());
create policy "members submit their own pending expenses" on public.expenses for insert to authenticated
with check (user_id = auth.uid() and status = 'pending' and not public.is_treasurer());
create policy "treasurers update all expenses" on public.expenses for update to authenticated
using (public.is_treasurer()) with check (public.is_treasurer());

create or replace function public.sync_project_spend() returns trigger
language plpgsql security definer set search_path = '' as $$
declare old_delta numeric(12,2) := 0; new_delta numeric(12,2) := 0;
begin
  if tg_op <> 'INSERT' and old.status = 'approved' then old_delta := old.amount; end if;
  if tg_op <> 'DELETE' and new.status = 'approved' then new_delta := new.amount; end if;
  if tg_op = 'UPDATE' and old.project_id <> new.project_id then
    update public.projects set current_spent = greatest(0, current_spent - old_delta) where id = old.project_id;
    update public.projects set current_spent = current_spent + new_delta where id = new.project_id;
  else
    update public.projects set current_spent = greatest(0, current_spent - old_delta + new_delta)
    where id = coalesce(new.project_id, old.project_id);
  end if;
  return coalesce(new, old);
end; $$;
create trigger expenses_sync_project_spend after insert or update or delete on public.expenses
for each row execute procedure public.sync_project_spend();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('receipts', 'receipts', false, 5242880, array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit,
allowed_mime_types = excluded.allowed_mime_types;
create policy "members upload into their receipt folder" on storage.objects for insert to authenticated
with check (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "owners and treasurers view receipts" on storage.objects for select to authenticated
using (bucket_id = 'receipts' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_treasurer()));
create policy "owners delete their receipts" on storage.objects for delete to authenticated
using (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);

-- Push project and expense changes to subscribed dashboards.
alter publication supabase_realtime add table public.projects, public.expenses;

-- Optional seed:
-- insert into public.projects (name, allocated_budget) values
-- ('Orientation Week', 5000), ('Community Outreach', 2500), ('Annual Dinner', 8000);
