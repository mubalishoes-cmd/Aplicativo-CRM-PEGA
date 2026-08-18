# Migrations do banco (Supabase)

Esta pasta guarda, em ordem, todo script SQL já aplicado no banco do ROTA CRM.
Cada arquivo é um passo — não edite um arquivo já aplicado; se precisar mudar algo,
crie um novo arquivo numerado (ex: `005_...sql`).

| Arquivo | O que faz |
|---|---|
| `001_create_clients_table.sql` | Cria a tabela `clients` com todos os campos do cadastro. |
| `002_enable_rls_and_base_policies.sql` | Ativa Row Level Security e libera leitura, criação e edição para usuários autenticados. |
| `003_seed_initial_clients.sql` | Importa as 171 empresas que já existiam no app antes da migração para o Supabase. |
| `004_add_delete_policy.sql` | Libera a exclusão de cadastros para usuários autenticados. |

## Se você já rodou tudo isso antes (banco já existe)

Não precisa rodar nada de novo — esses arquivos já foram aplicados manualmente
no SQL Editor do Supabase durante a configuração inicial do projeto. Eles ficam
aqui só como **registro histórico**, versionado junto com o código.

## Se você for criar um banco novo do zero

(ex: um ambiente de teste separado, ou recriando o projeto)
Rode os arquivos nesta pasta **na ordem numérica**, um de cada vez, no SQL Editor
do Supabase. Todos são seguros de rodar mais de uma vez (usam `if not exists` e
`drop policy if exists` antes de criar), então não tem problema rodar de novo por engano.

## Próxima alteração no banco

Quando precisar mudar o schema ou as permissões de novo, crie um novo arquivo aqui
(ex: `005_add_algo.sql`), aplique no Supabase, e depois faça commit do arquivo —
assim o histórico do banco fica registrado junto com o histórico do código no Git.
