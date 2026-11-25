# FinanceFlow

Aplicacao web para acompanhar transacoes, categorias, contas e relatorios financeiros.

## Desenvolvimento local

Requer Node.js 22.

```bash
npm ci
npm run dev
```

Para validar a versao de producao:

```bash
npm run lint
npm run build
```

## Publicacao no GitHub Pages

O workflow `Deploy to GitHub Pages` publica automaticamente a pasta `dist` quando ha
um push para `main`. Ele tambem pode ser iniciado manualmente pela aba **Actions**.

Na primeira publicacao, configure o repositorio em **Settings > Pages > Build and
deployment > Source > GitHub Actions**.

Depois que o workflow terminar com sucesso, o site estara disponivel em:

https://renatofreitasrpf.github.io/FinanceFlow-BETA/

O projeto usa o armazenamento local do navegador; os dados nao sao sincronizados
entre dispositivos ou usuarios.
