-- Rode isto no SQL Editor do Supabase para liberar a exclusão de cadastros
-- (não precisa rodar o supabase_setup.sql inteiro de novo)

drop policy if exists "Authenticated users can delete clients" on clients;
create policy "Authenticated users can delete clients"
  on clients for delete to authenticated using (true);
