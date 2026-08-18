-- Ativa Row Level Security e libera leitura, criação e edição para usuários autenticados.

alter table clients enable row level security;

drop policy if exists "Authenticated users can read clients" on clients;
create policy "Authenticated users can read clients"
  on clients for select to authenticated using (true);

drop policy if exists "Authenticated users can insert clients" on clients;
create policy "Authenticated users can insert clients"
  on clients for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update clients" on clients;
create policy "Authenticated users can update clients"
  on clients for update to authenticated using (true);
