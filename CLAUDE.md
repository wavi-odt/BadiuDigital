# Badiu Digital — site do estúdio (frontend)

Site do estúdio Badiu Digital (fundador: Rafael Reis). Serve de portefólio e deve demonstrar competências de frontend: animações, transições e detalhe visual.

## Stack
- React 18 + Vite, Tailwind CSS v4 (`@tailwindcss/vite`), React Router v6
- Backend separado: Spring Boot + MySQL (repo `badiu-api`), contrato em `docs/API.md`
- `.env`: `VITE_API_BASE_URL` (sem `/api`) e `VITE_USE_MOCKS`

## Estrutura (mesma organização do Batuku)
- `src/pages/public/` — páginas (Home, Projetos, Projeto, Equipa, Membro, Contacto, 404)
- `src/components/PublicComponets/` — componentes públicos (o nome da pasta tem esta grafia de propósito, não corrigir)
- `src/components/PublicComponets/home/` — as 5 fases de scroll da home
- `src/hooks/` — `useFetch` + hooks de dados + hooks de animação (`useScrollProgress`, `useInView`)
- `src/services/` — `api.js` (cliente HTTP), `endpoints.js`, um service por domínio, `mocks/`
- `src/context/PageTransitionContext.jsx` — transição entre páginas
- `src/styles/tokens.css` (variáveis) e `src/styles/global.css` (Tailwind, classes e animações)
- Imports com alias `@/` → `src/`

## Identidade visual
- Símbolo: **Panu** (losangos inspirados no pano di terra de Santiago), componente `PanuLogo`
- Paleta Petróleo: petrol `#0D4B57`, ink `#061F25`, sand `#F1E4C3`, sand-light `#F7F0E0`, orange `#F08A4B`, muted `#BFD3CF`
- Classes Tailwind disponíveis: `bg-petrol`, `text-orange`, `bg-ink`, `text-sand`, `text-muted`, etc.
- Tipografia: Bricolage Grotesque (display, 800 nos títulos, letter-spacing negativo) + JetBrains Mono (detalhes)
- Tom: tema escuro e imersivo, cantos muito arredondados, sem bordas cinzentas

## Animações
- **Home:** cada fase é uma secção alta com `.phase__stage` sticky. `useScrollProgress` escreve `--p` (0→1) na secção e o CSS anima com `calc(var(--p) …)`, sem re-render.
- **Outras páginas:** animações de entrada com `<Reveal variant="up|clip|line|vline" delay>` e `<RiseText>`. Os delays começam por volta dos 0.7s por causa da transição de entrada.
- **Transição entre páginas:** usar sempre `<TransitionLink>` em vez de `<Link>` para links internos.
- Tudo tem de respeitar `prefers-reduced-motion` (ver o fim do `global.css`).

## Regras de trabalho
- Não mudar design, cores, layout nem textos que não foram pedidos. Fazer só a alteração pedida.
- Ao corrigir um bug, corrigir só esse bug, sem reestruturar componentes.
- Hovers e animações vão em classes no `global.css`, não em `style={}` inline nas mesmas propriedades (o Tailwind v4 falha quando se misturam).
- Nunca pôr `<button>` ou `<p>` dentro de `<Link>`/`<TransitionLink>` (HTML inválido estraga o routing).
- Novos endpoints: adicionar em `services/endpoints.js` + service + hook, e atualizar `docs/API.md`.
- Correr `npm run build` no fim para confirmar que compila.
