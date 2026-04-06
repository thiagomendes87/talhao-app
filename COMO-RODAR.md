# Como rodar o Talhão localmente

## 1. Abra o terminal no Cursor
`Ctrl + ` ` (acento grave) — abre o terminal integrado

## 2. Entre na pasta do projeto
```
cd talhao-app
```

## 3. Instale as dependências (só na primeira vez)
```
npm install
```

## 4. Rode o projeto
```
npm run dev
```

## 5. Abra no browser
Acesse: http://localhost:3000

O projeto agora sobe fixo em `localhost` para manter o terminal e o navegador usando o mesmo endereco.

---

## Páginas disponíveis
- `/` → Landing page
- `/entrar` → Login
- `/cadastro` → Cadastro
- `/carteira` → Recarregar créditos
- `/assinar` → Assinar Plano Pro

## Para subir no ar (Vercel)
1. Cria conta em vercel.com
2. Conecta com GitHub
3. Faz push do projeto no GitHub
4. A Vercel detecta e sobe automaticamente
