# Badiu Digital — Frontend

Site do estúdio Badiu Digital: home com apresentação por fases de scroll, projetos, equipa e um portefólio por colaborador.

**Stack:** React 18 · Vite · Tailwind CSS v4 · React Router · backend Spring Boot + MySQL (repositório separado)

## Começar

```bash
npm install
cp .env.example .env     # ajusta VITE_API_BASE_URL
npm run dev              # http://localhost:5173
```

| Variável | Descrição |
|---|---|
| `VITE_API_BASE_URL` | URL do backend Spring Boot, sem `/api` (ex.: `http://localhost:8080`) |
| `VITE_USE_MOCKS` | `true` usa os dados de `src/services/mocks/data.js`; `false` lê do backend |

Enquanto o backend não estiver pronto, deixa `VITE_USE_MOCKS=true`. Os mocks têm exatamente o formato dos DTOs descritos em [`docs/API.md`](docs/API.md), por isso a troca é só mudar a variável.

## Estrutura

```
src/
├── components/
│   └── PublicComponets/        # componentes das páginas públicas
│       ├── home/               # as 5 fases de scroll da home
│       ├── Header, Footer, PanuLogo, TransitionLink, WipeOverlay, Reveal, RiseText…
│       └── ProjectCard, MemberCard, WorkRow, ContactForm…
├── config/env.js               # leitura das variáveis de ambiente
├── constants/                  # rotas, estados de projeto, textos de recurso
├── context/                    # PageTransitionContext (animação entre páginas)
├── hooks/                      # useFetch + hooks de dados + hooks de animação
├── layouts/PublicLayout.jsx    # header + footer + overlay de transição
├── pages/public/               # Home, Projetos, Projeto, Equipa, Membro, Contacto, 404
├── routes/AppRoutes.jsx
├── services/                   # api.js (cliente HTTP) + um service por domínio + mocks
├── styles/                     # tokens.css + global.css (Tailwind v4 + classes + animações)
└── utils/
```

### Fluxo de dados

`página → hook (useProjects, useMember…) → service (projectService…) → api.js → Spring Boot`

- `api.js` trata do prefixo `/api`, timeout, JSON e erros (`ApiError` com `status`).
- `useFetch` gere `loading / error / data`, cancela pedidos ao desmontar e expõe `reload()`.
- Todos os endpoints estão num só sítio: `src/services/endpoints.js`.

### Animações

- **Home:** cada fase é uma secção alta com conteúdo `sticky`. O hook `useScrollProgress` escreve o progresso na variável CSS `--p` (0 → 1) sem re-render, e o CSS usa `calc()` para animar.
- **Restantes páginas:** animações de entrada com `<Reveal>` (IntersectionObserver) e `<RiseText>`.
- **Transição entre páginas:** `<TransitionLink>` + `PageTransitionContext` (o losango laranja cobre o ecrã, muda a rota e revela a página nova).
- Tudo respeita `prefers-reduced-motion`.

## Rotas

| Rota | Página |
|---|---|
| `/` | Home (fases de scroll) |
| `/projetos` | Lista de projetos com filtros |
| `/projetos/:slug` | Detalhe do projeto |
| `/equipa` | Equipa |
| `/equipa/:slug` | Portefólio do colaborador |
| `/contacto` | Formulário de contacto |

## Deploy

Vercel: o `vercel.json` já faz o rewrite para a SPA. Define `VITE_API_BASE_URL` e `VITE_USE_MOCKS=false` nas variáveis do projeto.

## Adicionar um colaborador

Só no backend: cria o membro na base de dados com um `slug`. A página `/equipa/:slug` é gerada automaticamente.
