import { lazy, Suspense, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, SplitText, useGSAP } from '@/motion/gsap';
import { MQ, useFinePointer, useReducedMotion } from '@/motion/useMediaQuery';
import { useProjects } from '@/hooks/useProjects';
import { usePageNavigation } from '@/app/providers/TransitionProvider';
import Label from '@/components/Label';
import SplitHeading from '@/components/SplitHeading';
import TLink from '@/components/TLink';
import { useVelocitySkew } from '@/motion/velocitySkew';
import { ROUTES } from '@/constants/routes';

const PreviewCard = lazy(() => import('@/gl/PreviewCard'));

/**
 * Projetos selecionados: lista grande de nomes em Fraunces com a categoria à direita.
 * As linhas desenham-se da esquerda para a direita; no hover o nome desliza, fica em itálico
 * castanho-claro e as letras voltam a subir. Um cartão de preview segue o cursor com inércia
 * e inclina-se com a velocidade; a imagem tem distorção RGB e ondulação (shader).
 * Ao clicar, o cartão expande-se para a página do projeto (view-transition-name).
 */
export default function Work() {
  const { t } = useTranslation();
  const { data } = useProjects({ featured: true });
  const projects = data ?? [];
  const root = useRef(null);
  const list = useRef(null);
  const card = useRef(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const { go } = usePageNavigation();
  const [active, setActive] = useState(null);
  const preview = useRef({ src: null, color: '#1A1A1A', velocity: 0, dirX: 1, dirY: 0 }).current;
  useVelocitySkew(list);

  useGSAP(() => {
    if (!projects.length) return undefined;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const rows = gsap.utils.toArray('[data-row]', list.current);
      gsap.from(rows, { y: 60, autoAlpha: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: list.current, start: 'top 85%', once: true } });
      gsap.from(gsap.utils.toArray('[data-line]', list.current), { scaleX: 0, stagger: 0.08, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: list.current, start: 'top 85%', once: true } });

      const splits = rows.map((r) => SplitText.create(r.querySelector('[data-name]'), { type: 'chars', mask: 'chars', charsClass: 'sc', aria: 'auto' }));
      const enters = rows.map((r, i) => () => gsap.fromTo(splits[i].chars, { yPercent: 110 }, { yPercent: 0, stagger: 0.018, duration: 0.6, ease: 'expo.out', overwrite: true }));
      rows.forEach((r, i) => r.addEventListener('pointerenter', enters[i]));
      return () => { rows.forEach((r, i) => r.removeEventListener('pointerenter', enters[i])); splits.forEach((s) => s.revert()); };
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [projects.length], revertOnUpdate: true });

  // cartão que segue o cursor
  useGSAP(() => {
    if (!fine || reduced || !card.current) return undefined;
    const el = card.current;
    const qx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
    const qy = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
    const qr = gsap.quickTo(el, 'rotation', { duration: 0.8, ease: 'power3' });
    let lx = 0, ly = 0, lt = performance.now();
    const move = (e) => {
      const now = performance.now(), dt = Math.max(16, now - lt);
      const dx = e.clientX - lx, dy = e.clientY - ly;
      qx(e.clientX); qy(e.clientY);
      qr(gsap.utils.clamp(-14, 14, dx * 0.6));
      preview.velocity = Math.min(1, Math.hypot(dx, dy) / dt * 1.2);
      const len = Math.hypot(dx, dy) || 1;
      preview.dirX = dx / len; preview.dirY = -dy / len;
      lx = e.clientX; ly = e.clientY; lt = now;
    };
    const decay = () => { preview.velocity *= 0.92; };
    window.addEventListener('pointermove', move, { passive: true });
    gsap.ticker.add(decay);
    return () => { window.removeEventListener('pointermove', move); gsap.ticker.remove(decay); };
  }, { dependencies: [fine, reduced] });

  const showCard = (i) => {
    const p = projects[i];
    setActive(i);
    preview.src = p.coverImageUrl || null;
    preview.color = p.coverColor || '#1A1A1A';
    gsap.to(card.current, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
    gsap.fromTo('[data-card-in]', { yPercent: 8, scale: 1.12 }, { yPercent: 0, scale: 1, duration: 0.7, ease: 'expo.out', overwrite: true });
  };
  const hideCard = () => { setActive(null); gsap.to(card.current, { autoAlpha: 0, scale: 0.6, duration: 0.4, ease: 'power3.in', overwrite: 'auto' }); };

  const open = (e, p) => {
    e.preventDefault();
    // elemento partilhado com a página do projeto (View Transitions)
    if (card.current && active !== null) card.current.style.viewTransitionName = 'project-cover';
    go(ROUTES.project(p.slug));
  };

  return (
    <section ref={root} id="trabalho" className="work wrap" aria-labelledby="work-title">
      <div className="work-head">
        <SplitHeading id="work-title" className="t-h2 work-title">
          {t('homepage.work.title_a')} <em>{t('homepage.work.title_b')}</em>
        </SplitHeading>
        <Label>{t('homepage.work.label')}</Label>
      </div>

      {projects.length ? (
        <ul ref={list} className="work-list" onPointerLeave={fine ? hideCard : undefined}>
          {projects.map((p, i) => (
            <li key={p.slug} data-row="" onPointerEnter={fine ? () => showCard(i) : undefined}>
              <TLink to={ROUTES.project(p.slug)} className="work-row" data-cursor="open" onClick={(e) => open(e, p)}>
                <span className="work-name" data-name="">{p.name}</span>
                <span className="work-cat t-label">{(p.tags ?? []).slice(0, 2).join(' · ') || p.summary}</span>
                <span className="work-line" data-line="" aria-hidden="true" />
              </TLink>
            </li>
          ))}
        </ul>
      ) : (
        <p className="t-small" style={{ color: 'var(--muted)' }}>{t('homepage.work.empty')}</p>
      )}

      <div className="work-foot">
        <TLink to={ROUTES.projects} className="button button-outline" data-cursor="view">{t('homepage.work.all')} →</TLink>
      </div>

      {fine && !reduced && (
        <div ref={card} className="work-card" aria-hidden="true">
          <div className="work-card-in" data-card-in="">
            <Suspense fallback={null}><PreviewCard state={preview} /></Suspense>
            <span className="work-card-name" style={{ color: active !== null ? projects[active]?.coverTextColor : undefined }}>{active !== null ? projects[active]?.name : ''}</span>
          </div>
        </div>
      )}
    </section>
  );
}
