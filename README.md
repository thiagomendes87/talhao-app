# Talhão.ai

Plataforma web para encontrar qualquer fazenda no Brasil usando dados do CAR/SICAR, baixar KML e gerenciar propriedades rurais.

## Features

- 🗺 Mapeamento de todos os CAR do Brasil
- 📥 Download de KML, SIGEF e arquivos georeferenciados
- 🔲 Múltiplas camadas de análise (satélite, topografia, SNCR)
- 💳 Sistema de créditos pré-pago (R$3,50 por download)
- 🔐 Autenticação segura com múltiplos provedores
- 📊 Dashboard de propriedades e análises

## Stack Técnico

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (preparado para integração com Supabase)
- **Autenticação**: Clerk (planejado)
- **Banco de Dados**: Supabase PostgreSQL + PostGIS (planejado)
- **Mapa**: Mapbox/Google Maps (planejado)
- **Pagamentos**: Stripe/Asaas PIX (planejado)
- **Hosting**: Vercel

## Como rodar localmente

```bash
# Instalar dependências
npm install

# Rodar dev server
npm run dev

# Abrir no browser
# http://localhost:3000
```

## Páginas disponíveis

- `/` → Landing page
- `/entrar` → Login
- `/cadastro` → Cadastro
- `/carteira` → Recarregar créditos
- `/assinar` → Assinar Plano Pro

## Deployment

O site é automaticamente deploiado no Vercel quando você faz push para a branch `main` no GitHub.

[Acessar site ao vivo](https://talhao.ai)
