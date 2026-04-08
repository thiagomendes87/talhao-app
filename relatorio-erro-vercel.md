# Relatorio - erro de deploy na Vercel

Data de geracao: 2026-04-08

## Contexto inicial

O usuario informou que o deploy para a Vercel falhou e pediu para nao mexer em nada ainda. O log compartilhado mostrava:

- comando executado pela Vercel: `npm run build`
- resultado final: `Command "npm run build" exited with 1`
- o projeto compilava, mas falhava durante a etapa de geracao de paginas estaticas

## Trecho principal do erro compartilhado

O ponto central do log era:

`Error: supabaseUrl is required.`

Esse erro apareceu repetidamente enquanto a Vercel tentava prerenderizar varias paginas:

- `/`
- `/assinar`
- `/cadastro`
- `/dashboard`
- `/entrar`
- `/onboarding`

Tambem apareceu a mensagem:

`Error occurred prerendering page "/assinar".`

E ao final:

- `/assinar/page: /assinar`
- `/cadastro/page: /cadastro`
- `/dashboard/page: /dashboard`
- `/entrar/page: /entrar`
- `/onboarding/page: /onboarding`
- `/page: /`

## Diagnostico inicial explicado ao usuario

Foi explicado que:

- nao era um erro visual de layout
- nao era um erro de compilacao comum do Next.js
- o build estava quebrando por falta de configuracao de ambiente
- a Vercel nao le automaticamente o arquivo local `.env.local`

Foi identificado que o projeto dependia de variaveis do Supabase no ambiente de build, principalmente:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Orientacao dada

Foi explicado que o push automatico para a Vercel continuava funcionando, mas que o deploy falhava porque a configuracao do ambiente estava incompleta.

Resumo passado ao usuario:

- o GitHub recebia o push normalmente
- a Vercel detectava o push automaticamente
- a Vercel tentava rodar o build
- o build quebrava por nao encontrar a URL do Supabase

## Verificacao do arquivo .env.local

Depois, foi feita apenas a leitura do arquivo local `.env.local`, sem alterar nada.

As variaveis encontradas foram:

- `NEXT_PUBLIC_SUPABASE_URL=https://dgiltxwcovtveppuwcwu.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=[valor longo da chave anon do Supabase]`

Com isso, foi confirmado que o ambiente local tinha as variaveis necessarias, mas a Vercel nao.

## Passo a passo orientado no terminal com Vercel CLI

O usuario perguntou se isso podia ser feito pelo terminal. Foi explicado que sim.

Foi orientado o uso do comando:

`npx vercel link`

Durante esse fluxo, foram dadas as seguintes orientacoes:

- aceitar a instalacao do pacote `vercel`
- fazer login pela URL `vercel.com/device`
- aceitar o link com o projeto encontrado
- responder `N` quando a CLI perguntou se deveria sobrescrever o `.env.local`

## Cadastro das variaveis na Vercel

Foi orientado cadastrar as variaveis usando a CLI:

- `npx vercel env add NEXT_PUBLIC_SUPABASE_URL production`
- `npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production`
- `npx vercel env add NEXT_PUBLIC_SUPABASE_URL preview`
- `npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview`

Durante esse processo, o usuario recebeu instrucoes para responder:

- `no` ou `N` quando aparecia `Mark as sensitive?`
- `Leave as is` quando a CLI alertava que `NEXT_PUBLIC_` deixa a variavel visivel no frontend
- deixar o campo da branch em branco no ambiente `preview`

## Confirmacoes feitas pelo usuario

O usuario confirmou no terminal que cadastrou com sucesso:

### Production

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Preview

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Depois disso, o usuario executou:

`npx vercel env ls production`

E o terminal mostrou:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` em `Production`
- `NEXT_PUBLIC_SUPABASE_URL` em `Production`

Depois executou:

`npx vercel env ls preview`

E o terminal mostrou:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` em `Preview`
- `NEXT_PUBLIC_SUPABASE_URL` em `Preview`

## Nova tentativa de deploy

Depois das configuracoes, foi orientado rodar:

`npx vercel --prod --force`

O usuario informou que a Vercel iniciou um novo deploy de producao, mas ainda terminou com:

`Error: Command "npm run build" exited with 1`

## Investigacao local sem alterar codigo

Sem mexer em nada, foi feita uma inspecao do projeto local para entender quais arquivos usavam Supabase e podiam falhar durante o build.

Foi encontrado o arquivo:

`lib/supabase.ts`

Nele, o cliente do Supabase era criado diretamente com:

- `process.env.NEXT_PUBLIC_SUPABASE_URL`
- `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`

Tambem foi encontrado uso de `supabase` nas paginas:

- `app/page.tsx`
- `app/entrar/page.tsx`
- `app/cadastro/page.tsx`
- `app/assinar/page.tsx`
- `app/dashboard/page.tsx`
- `app/onboarding/page.tsx`
- `components/Navbar.tsx`

## Diagnostico mais recente

Com base nisso, foi explicado que:

- o erro ainda parecia ligado ao ambiente da Vercel
- como as variaveis ja existiam em `production` e `preview`, o problema podia estar em como a Vercel estava aplicando essa configuracao no build
- sem alterar codigo ainda, o proximo passo mais seguro seria conferir o `Build Log` do ultimo deploy e a configuracao de `Root Directory` no painel da Vercel

## Estado da conversa no momento deste relatorio

A situacao ficou assim:

- o projeto local tinha as variaveis corretas no `.env.local`
- as variaveis foram cadastradas na Vercel em `Production`
- as variaveis foram cadastradas na Vercel em `Preview`
- o deploy ainda falhava com `npm run build exited with 1`
- a linha central do erro seguia sendo `supabaseUrl is required`
- nenhuma alteracao de codigo foi aplicada nesta etapa da investigacao

## Conclusao resumida

Desde o momento em que o erro da Vercel foi colado na conversa, o entendimento construido foi:

1. O deploy automatico da Vercel estava funcionando.
2. O problema nao era o push para o GitHub.
3. O build quebrava porque o Supabase estava sendo inicializado sem encontrar a URL esperada.
4. As variaveis de ambiente foram cadastradas manualmente na Vercel.
5. Mesmo assim, o deploy continuou falhando, indicando necessidade de checagem mais fina no painel da Vercel ou ajuste posterior de codigo.

