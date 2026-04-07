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
1. Importe o repositório `thiagomendes87/talhao-app` na Vercel
2. Confirme que a branch de produção é `main`
3. Faça suas mudanças no projeto
4. Rode um build local para validar:

```bash
npm run build
```

5. Envie para produção com:

```bash
git add .
git commit -m "Sua mensagem"
git push origin main
```

6. A Vercel detecta o push e atualiza `https://talhao-app.vercel.app/`
