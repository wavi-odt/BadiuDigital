# Badiu Digital — site (rebrand 2026)

Badiu Digital é um estúdio digital criativo com raízes em Santiago, Cabo Verde: design, desenvolvimento e infraestrutura de produtos digitais. Este repositório (github.com/wavi-odt/BadiuDigital) está a passar por um **rebrand completo**. Toda a camada visual (páginas públicas, componentes, estilos e animações) é refeita de raiz com a identidade nova. A camada de dados (`src/services/`, mocks, ligação à `badiu-api`) mantém-se. O objetivo é um site que mostra ao máximo as técnicas de frontend e motion design: deve impressionar logo no primeiro segundo e manter-se rápido e fluido.

Domínios: badiudigital.com / badiudigital.cv. Comunicação com o dono do projeto (Wavi) em português de Portugal, informal e direto.

## Regras de trabalho

- Não fazer alterações que não foram pedidas. Em caso de dúvida, perguntar antes.
- Antes de uma tarefa grande, apresentar um plano curto e esperar aprovação.
- Usar as skills `design-taste-frontend` (taste-skill) e `frontend-design` em conjunto para decisões visuais. **Não** usar a skill `premium-frontend`.
- Usar `context7` para documentação atualizada de bibliotecas (GSAP, R3F, Lenis, etc.) em vez de confiar na memória.
- Commits pequenos e com mensagens claras em português.

## Stack

- A stack que o projeto já tem: React 18 + Vite + Tailwind v4 + React Router 6, alias `@/` → `src/`. Manter a linguagem atual (JS/JSX) e não migrar para TypeScript sem pedido.
- Motion: **GSAP** (ScrollTrigger, SplitText, Flip, CustomEase) via `@gsap/react` (`useGSAP`), **Lenis** para scroll suave, ligado ao ticker do GSAP.
- 3D / shaders: **three** + **@react-three/fiber** + **@react-three/drei**, shaders GLSL próprios em `src/gl/`.
- Transições entre páginas: View Transitions API, com fallback GSAP.
- Assets de vídeo e imagem gerados no Higgsfield: `public/media/`, em webm + mp4 (H.264) comprimidos, sempre com `poster` e `preload="metadata"`.

## Estrutura

O trabalho do rebrand é feito no branch `rebrand`. O código visual antigo (`pages/public`, `components/PublicComponets`, os hooks de animação antigos como `useScrollProgress`, `Reveal`, `RiseText` e `PageTransitionContext`) é removido só quando a peça nova que o substitui estiver a funcionar. A estrutura nova da camada visual é esta:

```
src/
  app/            router, layout, providers (Lenis, GSAP, transições)
  pages/          Home, Servicos, Projetos, Projeto, Equipa, Membro, Contacto
  sections/       secções da home (Hero, Manifesto, Servicos, ...)
  components/     UI reutilizável (Logo, Button, Cursor, Marquee, ...)
  motion/         hooks e utilitários de animação (useSplitReveal, useMagnet, easings)
  gl/             cenas R3F e shaders (.glsl)
  services/       camada de API (já existe, não mexer na interface)
  data/           mocks e conteúdo estático
  styles/         tokens.css, globals.css
```

## Backend e dados

- A API é a `badiu-api` (Spring Boot + MySQL). URL em `VITE_API_BASE_URL`. Este valor fica fixo no build, por isso é preciso voltar a fazer deploy na Vercel sempre que mudar.
- A pasta `src/services/` já existe e mantém a mesma interface, incluindo os mocks com `VITE_USE_MOCKS === 'true'` e o fallback `withDevFallback` (só em DEV).
- A secção Equipa, com o portefólio de cada membro, faz parte do site.

---

## Marca

### Cores (tokens em `src/styles/tokens.css`)

| Token | Hex | Uso |
|---|---|---|
| `--noite` | `#0A0A0A` | Fundo principal |
| `--grafite` | `#1A1A1A` | Cartões, superfícies |
| `--pedra` | `#3A3A3A` | Linhas, divisores, o "b" do logo |
| `--nevoa` | `#8C8C8C` | Texto secundário, etiquetas |
| `--osso` | `#F5F5F2` | Texto principal, fundos claros |
| `--castanho` | `#8A5636` | Acento em fundo escuro (botão principal, núcleo do logo) |
| `--castanho-claro` | `#A9714A` | Palavras em itálico nos títulos, em fundo escuro |
| `--cafe` | `#5A3520` | Acento em fundo claro |

Proporção aproximada: 60% pretos, 25% osso, 10% cinzentos, 5% castanho. **O castanho é raro de propósito**: aparece no máximo em 1 ou 2 pontos por ecrã. Não usar gradientes coloridos, néons nem outras cores de acento.

### Tipografia

- **Títulos:** Fraunces 400, com tracking negativo (-0.04em no display, -0.02em no H2). A palavra-chave vai em *itálico* na cor castanho-claro, por exemplo "Software com *raízes.*".
- **Texto e UI:** Geist 400/500/600.
- **Etiquetas:** Geist Mono 13px, maiúsculas, letter-spacing 0.3em, cor névoa.
- **Wordmark do logo:** Bricolage Grotesque 800, tracking -0.045em. É usada **só** no logo.

Escala:

| Nível | Fonte | Tamanho / altura de linha |
|---|---|---|
| Display | Fraunces | clamp(64px, 10vw, 160px) / 0.92 |
| H1 | Fraunces | 72 / 1 |
| H2 | Fraunces | 44 / 1.1 |
| H3 | Geist 600 | 24 |
| Corpo | Geist | 18 / 1.6 |
| Pequeno | Geist | 14 |
| Etiqueta | Geist Mono | 13 |

### Logo

**Símbolo**: a grelha do pano di terra, 13 losangos em forma de losango maior (linhas com 1, 3, 5, 3, 1 losangos).
Geometria num viewBox 100×100:
- espaçamento entre centros: 14;
- centro de cada losango: `cx = 50 + (k - (n-1)/2) * 14`, `cy = 22 + r * 14`, com `r` a linha (0–4) e `k` o índice na linha;
- cada losango tem semi-diagonal 6.2 e é um polígono com os pontos `(cx,cy-d) (cx+d,cy) (cx,cy+d) (cx-d,cy)`, com `stroke-linejoin: round` e o stroke da mesma cor, largura 1.5.

Cores dos losangos:
- **Núcleo** (linha 2, k=2): castanho `#8A5636` em fundo escuro, café `#5A3520` em fundo claro.
- **"b" escondido** (células `1-0`, `2-1`, `3-0`, `2-2`, `3-1`): pedra `#3A3A3A` em fundo escuro, `#D2D2D0` em fundo claro. Atenção: a célula `2-2` é o núcleo e mantém a cor de núcleo.
- **Restantes:** osso em fundo escuro, `#0E0E0E` em fundo claro.

**Wordmark**: "badiu" em minúsculas, Bricolage 800. O "i" usa o ı sem ponto (U+0131). O ponto é um quadrado rodado 45° com 0.16em de lado, na cor do núcleo.

**Versões**: horizontal (símbolo + wordmark), vertical, só símbolo, só wordmark e monocromática.

**Regras**:
- O espaço livre à volta do logo é igual à altura de 3 losangos.
- Tamanho mínimo: símbolo a 24px, horizontal a 90px.
- Abaixo de 24px usa-se a versão favicon: sem o "b", só losangos osso e o núcleo em `#A9714A`.
- Não rodar, não esticar, não trocar as cores, não encher de castanho.

Implementar como `<Logo variant="horizontal|vertical|symbol|wordmark|mono" theme="dark|light" />` em SVG gerado a partir da geometria acima, para o motion poder animar cada losango em separado.

---

## Princípios de motion

- **Ideia central: "tecer".** As coisas constroem-se fio a fio e losango a losango. Os losangos da grelha são a unidade visual de tudo: preloader, transições, cursor, partículas.
- **Easings:**
  - entradas: `expo.out` / `power4.out`, duração entre 0.9 e 1.4s;
  - saídas: `power3.in`, mais curtas;
  - easing próprio da marca: `CustomEase "badiu"` = `M0,0 C0.7,0 0.2,1 1,1`.
- **Texto:** os títulos revelam-se com SplitText, linha a linha com máscara (`overflow:hidden`, yPercent 110 → 0, stagger 0.08). Os títulos grandes revelam-se carácter a carácter.
- **Scroll:** sempre Lenis + ScrollTrigger. Animações ligadas ao scroll com `scrub` entre 0.6 e 1. Usar `pin` só quando há uma razão clara.
- **Desempenho:**
  - animar só `transform` e `opacity`, e clip-path com moderação;
  - nada de animar `top/left/width`;
  - 60fps num portátil médio;
  - WebGL com `dpr={[1, 2]}`, pausado fora do ecrã (`frameloop="demand"` ou IntersectionObserver).
- **Acessibilidade:**
  - com `prefers-reduced-motion`, desligar o scrub, o WebGL pesado e o Lenis, e mostrar o conteúdo estático com fades curtos;
  - o conteúdo tem de ser legível sem JS;
  - contraste AA.
- **Mobile:** versões mais leves das cenas WebGL (menos partículas, sem pós-processamento) e nada de interações que dependam de hover.
- **Métricas:** LCP abaixo de 2.5s, CLS abaixo de 0.05. Lazy-load das cenas 3D e dos vídeos abaixo da dobra.
