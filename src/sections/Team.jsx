import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/motion/gsap';
import { MQ } from '@/motion/useMediaQuery';
import { useMembers } from '@/hooks/useMembers';
import { CELLS } from '@/components/Logo';
import Label from '@/components/Label';
import SplitHeading from '@/components/SplitHeading';
import TLink from '@/components/TLink';
import { ROUTES } from '@/constants/routes';

/** Máscara de losangos (SVG) que revela a foto do centro para fora. */
export function DiamondMask({ id }) {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <clipPath id={id} clipPathUnits="objectBoundingBox">
        {CELLS.map((c) => {
          const cx = (c.cx - 50) / 56 + 0.5, cy = (c.cy - 50) / 56 + 0.5, d = 0.148;
          return <polygon key={c.id} data-mask-cell="" data-dist={c.dist.toFixed(2)} points={`${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}`} style={{ transformOrigin: `${cx}px ${cy}px` }} />;
        })}
      </clipPath>
    </svg>
  );
}

/** Equipa: cartões com hover 3D (tilt) e foto revelada por uma máscara de losangos. Cada cartão liga ao portefólio. */
export default function Team() {
  const { t } = useTranslation();
  const { data } = useMembers();
  const members = data ?? [];
  const root = useRef(null);

  useGSAP(() => {
    if (!members.length) return undefined;
    const mm = gsap.matchMedia();
    const cards = () => gsap.utils.toArray('[data-member]', root.current);
    mm.add(MQ.motion, () => {
      cards().forEach((c, i) => {
        gsap.from(c, { y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', delay: i * 0.1, scrollTrigger: { trigger: c, start: 'top 88%', once: true } });
        gsap.from(c.querySelectorAll('[data-mask-cell]'), {
          scale: 0, stagger: { each: 0.05, from: 'center' }, duration: 0.9, ease: 'back.out(1.6)',
          scrollTrigger: { trigger: c, start: 'top 80%', once: true },
        });
      });
    });
    mm.add(`${MQ.fine} and ${MQ.motion}`, () => {
      const cleanups = cards().map((c) => {
        const qx = gsap.quickTo(c, 'rotationX', { duration: 0.6, ease: 'power3' });
        const qy = gsap.quickTo(c, 'rotationY', { duration: 0.6, ease: 'power3' });
        const move = (e) => {
          const r = c.getBoundingClientRect();
          qx(-((e.clientY - r.top) / r.height - 0.5) * 12);
          qy(((e.clientX - r.left) / r.width - 0.5) * 14);
        };
        const leave = () => { qx(0); qy(0); };
        c.addEventListener('pointermove', move);
        c.addEventListener('pointerleave', leave);
        return () => { c.removeEventListener('pointermove', move); c.removeEventListener('pointerleave', leave); };
      });
      return () => cleanups.forEach((f) => f());
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [members.length], revertOnUpdate: true });

  if (!members.length) return null;

  return (
    <section ref={root} id="equipa" data-phase="" className="team wrap" aria-labelledby="team-title">
      <div className="team-head">
        <div>
          <Label>{t('homepage.team.label')}</Label>
          <SplitHeading id="team-title" className="t-h2 team-title">
            {t('homepage.team.title_a')} <em>{t('homepage.team.title_b')}</em>
          </SplitHeading>
        </div>
        <TLink to={ROUTES.team} className="button button-outline" data-cursor="view">{t('homepage.team.all')} →</TLink>
      </div>
      <ul className="team-grid">
        {members.map((m) => {
          const maskId = `mask-${m.slug.replace(/\W/g, '')}`;
          return (
            <li key={m.slug}>
              <TLink to={ROUTES.member(m.slug)} className="team-card" data-member="" data-cursor="open">
                <DiamondMask id={maskId} />
                <div className="team-photo" style={{ clipPath: `url(#${maskId})` }}>
                  {m.photoUrl
                    ? <img src={m.photoUrl} alt="" loading="lazy" />
                    : <span className="team-initials">{m.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}</span>}
                </div>
                <div className="team-meta">
                  <h3 className="team-name">{m.name}</h3>
                  <span className="t-small team-role">{m.role}</span>
                  <span className="t-label team-link">{t('homepage.team.portfolio')} ↗</span>
                </div>
              </TLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
