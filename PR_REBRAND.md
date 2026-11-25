# Rebrand completo do site (branch `rebrand` → `main`)

Refaz toda a camada visual do site da Badiu Digital com a identidade nova (noite / osso / castanho, Fraunces + Geist) e o sistema de motion do `CLAUDE.md`. Os dados mantêm-se: `src/services/` tem a mesma interface, o router tem as mesmas rotas, e continuam os idiomas PT/EN/KRI, o tema claro/escuro e a pesquisa.

## O que muda

- **Base:** tokens em `tokens.css`, fontes servidas localmente (woff2 com `font-display: swap` e preload), `MotionProvider` (Lenis ligado ao ticker do GSAP, `CustomEase "badiu"`, reduced motion) e `<Logo>` em SVG gerado da geometria, com favicon e apple-touch-icon.
- **Motion global:** preloader com Flip para a navbar, cortina de losangos entre páginas (View Transitions + GSAP), cursor com `mix-blend-mode`, botões magnéticos, navbar que esconde no scroll, progresso de scroll, grão, H2 carácter a carácter, skew por velocidade e etiquetas que decifram.
- **Home:** hero com pano de losangos em WebGL (R3F, instancing, shaders próprios), manifesto com palavras que acendem, serviços pinned com scroll horizontal, lista de projetos com cartão de preview (shader RGB), processo "fio a fio", equipa, CTA com segundo pano e rodapé com hora de Santiago.
- **Páginas interiores:** Serviços, Projetos (filtro animado com Flip), Projeto, Equipa, Membro, Contacto e 404.
- **Pesquisa (Ctrl/⌘ + K) e navegação mobile** refeitas.
- **Mocks:** 4 serviços novos (pt/en/kri), email `ola@badiudigital.com`, capas dos projetos na paleta nova.

## Removido

Todo o código visual antigo: `pages/public`, `components/PublicComponets`, `PageTransitionContext`, hooks de animação antigos, `global.css` e a paleta Petróleo.

## Desempenho e acessibilidade

- CLS medido na home: 0.
- JS principal: 160 kB comprimido; `three` e R3F só carregam quando o pano WebGL aparece; cada página é um chunk.
- Wordmark em subset (4 kB em vez de 182 kB).
- Contraste AA corrigido (manifesto, etiquetas pequenas, tema claro). Reduced motion: sem Lenis, pano, cursor nem scrub; serviços empilhados.

## Por testar antes de fazer merge

- [ ] Lighthouse (LCP < 2.5s) em mobile e desktop.
- [ ] Reduced motion, tema claro e teclado em todas as páginas.
- [ ] Telemóvel real (iOS Safari): pin dos serviços, WebGL, barra de baixo.
- [ ] Revisão do Kriolu (rascunho).
- [ ] Atualizar o seed da `badiu-api` (4 serviços, `ola@`) e o `VITE_API_BASE_URL` na Vercel.

## Não incluído

- Expansão (Flip) da imagem do projeto para a página: a cortina cobre sempre a troca de página.
- Imagens/vídeos reais: o cartão de preview e o slot de vídeo do hero (`<Hero video={{ webm, mp4, poster }} />`) estão prontos para receber ficheiros em `public/media/`.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
