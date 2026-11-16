import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/motion/gsap';
import { MQ } from '@/motion/useMediaQuery';
import { DiamondMask } from '@/sections/Team';
import TLink from '@/components/TLink';
import { ROUTES } from '@/constants/routes';

/** Cartão de membro: tilt 3D no hover, foto revelada por máscara de losangos, liga ao portefólio. */
export default function MemberCard({ member: m }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const maskId = `mask-${m.slug.replace(/\W/g, '')}`;

  useGSAP(() => {
    const el = ref.current;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from(el.querySelectorAll('[data-mask-cell]'), { scale: 0, stagger: { each: 0.05, from: 'center' }, duration: 0.9, ease: 'back.out(1.6)', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });
    mm.add(`${MQ.fine} and ${MQ.motion}`, () => {
      const qx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
      const qy = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
      const move = (e) => { const r = el.getBoundingClientRect(); qx(-((e.clientY - r.top) / r.height - 0.5) * 12); qy(((e.clientX - r.left) / r.width - 0.5) * 14); };
      const leave = () => { qx(0); qy(0); };
      el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
      return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <TLink ref={ref} to={ROUTES.member(m.slug)} className="team-card" data-cursor="open">
      <DiamondMask id={maskId} />
      <div className="team-photo" style={{ clipPath: `url(#${maskId})` }}>
        {m.photoUrl ? <img src={m.photoUrl} alt="" loading="lazy" /> : <span className="team-initials">{m.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}</span>}
      </div>
      <div className="team-meta">
        <h3 className="team-name">{m.name}</h3>
        <span className="t-small team-role">{m.role}</span>
        <p className="team-short">{m.shortBio}</p>
        <span className="t-label team-link">{t('homepage.team.portfolio')} ↗</span>
      </div>
    </TLink>
  );
}
