-- 1. Adiciona plan_type na tabela payments
alter table payments add column if not exists plan_type text;

-- 2. Cria tabela de assinaturas
create table if not exists subscriptions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  plan_type    text not null check (plan_type in ('pro_mensal', 'pro_anual')),
  status       text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  payment_id   uuid,
  started_at   timestamptz default now(),
  expires_at   timestamptz not null,
  created_at   timestamptz default now()
);

alter table subscriptions enable row level security;

create policy "users can view own subscriptions"
  on subscriptions for select
  using (auth.uid() = user_id);
