import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/motion/gsap';
import { MQ } from '@/motion/useMediaQuery';
import { useProjects } from '@/hooks/useProjects';
import Logo from '@/components/Logo';
import Label from '@/components/Label';
import SplitHeading from '@/components/SplitHeading';
import TLink from '@/components/TLink';
import { ROUTES } from '@/constants/routes';

const DIAMOND = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
const FULL = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
const STATUS_KEY = { LIVE: 'status_live', CLIENT: 'status_client', IN_DEVELOPMENT: 'status_in_dev', COMING_SOON: 'status_coming' };

/**
 * Projetos selecionados: galeria em duas colunas desfasadas.
 * Cada capa abre de um losango até ao retângulo completo ao entrar no ecrã, tem parallax interno
 * e o nome desloca-se ao contrário; a coluna da direita sobe a outra velocidade.
 * No hover o símbolo roda, o nome desliza e aparece uma seta. Em mobile, uma coluna.
 */
export default function Work() {
  const { t } = useTranslation();
  const { data } = useProjects({ featured: true });
  const projects = data ?? [];
  const root = useRef(null);

  useGSAP(() => {
    if (!projects.length) return undefined;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.utils.toArray('[data-wcard]', root.current).forEach((card) => {
        const clip = card.querySelector('[data-clip]');
        gsap.fromTo(clip, { clipPath: DIAMOND }, { clipPath: FULL, duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: card, start: 'top 85%', once: true } });
        gsap.from(card.querySelector('[data-body]'), { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', delay: 0.3, scrollTrigger: { trigger: card, start: 'top 80%', once: true } });
        const scrub = { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.8 };
        gsap.fromTo(card.querySelector('[data-par]'), { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: scrub });
        gsap.fromTo(card.querySelector('[data-name]'), { yPercent: 0 }, { yPercent: -45, ease: 'none', scrollTrigger: scrub });
        gsap.fromTo(card.querySelector('[data-spin]'), { rotate: -25 }, { rotate: 40, ease: 'none', scrollTrigger: scrub });
      });
    });
    mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
      // a coluna da direita sobe a uma velocidade diferente da da esquerda
      gsap.fromTo('[data-col="r"]', { y: 80 }, { y: -80, ease: 'none', scrollTrigger: { trigger: '[data-grid]', start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [projects.length], revertOnUpdate: true });

  const left = projects.filter((_, i) => i % 2 === 0);
  const right = projects.filter((_, i) => i % 2 === 1);

  const card = (p, i, tall) => (
    <TLink key={p.slug} to={ROUTES.project(p.slug)} className={`wcard${tall ? ' is-tall' : ''}`} data-wcard="" data-cursor="open" style={{ '--o': i }}>
      <div className="wcard-media">
        <div className="wcard-clip" data-clip="" style={{ background: p.coverColor, color: p.coverTextColor }}>
          <div className="wcard-par" data-par="">
            {p.coverImageUrl && <img src={p.coverImageUrl} alt="" loading="lazy" />}
            <span className="wcard-mark" data-spin=""><Logo variant="symbol" size={320} decorative theme="dark" style={{ color: p.coverTextColor }} /></span>
          </div>
          <span className="wcard-idx t-label">{String(i + 1).padStart(2, '0')}</span>
          <span className="wcard-arrow" aria-hidden="true">↗</span>
          <span className="wcard-name" data-name="">{p.name}</span>
        </div>
      </div>
      <div className="wcard-body" data-body="">
        <span className="t-label">{t(`projects.${STATUS_KEY[p.status] ?? 'status_coming'}`)} · {(p.tags ?? []).slice(0, 2).join(' · ')}</span>
        <p>{p.summary}</p>
      </div>
    </TLink>
  );

  return (
    <section ref={root} id="trabalho" className="work wrap" aria-labelledby="work-title">
      <div className="work-head">
        <SplitHeading id="work-title" className="t-h2 work-title">
          {t('homepage.work.title_a')} <em>{t('homepage.work.title_b')}</em>
        </SplitHeading>
        <Label>{t('homepage.work.label')}</Label>
      </div>

      {projects.length ? (
        <div className="wgrid" data-grid="">
          <div className="wcol" data-col="l">{left.map((p, k) => card(p, k * 2, k % 2 === 0))}</div>
          <div className="wcol wcol--r" data-col="r">{right.map((p, k) => card(p, k * 2 + 1, k % 2 === 1))}</div>
        </div>
      ) : (
        <p className="t-small" style={{ color: 'var(--muted)' }}>{t('homepage.work.empty')}</p>
      )}

      <div className="work-foot">
        <TLink to={ROUTES.projects} className="button button-outline" data-cursor="view">{t('homepage.work.all')} →</TLink>
      </div>
    </section>
  );
}
