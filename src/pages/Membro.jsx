import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/motion/gsap';
import { MQ } from '@/motion/useMediaQuery';
import { useMember } from '@/hooks/useMembers';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PageHero, Reveal, H2, Loading, ErrorView, PageCta } from '@/components/page';
import { DiamondMask } from '@/sections/Team';
import Label from '@/components/Label';
import TLink from '@/components/TLink';
import { ROUTES } from '@/constants/routes';

const buildLinks = (l = {}, t) => [
  l.cv && { label: t('member.link_cv'), href: l.cv, primary: true },
  l.portfolio && { label: t('member.link_portfolio'), href: l.portfolio, primary: true },
  l.github && { label: 'GitHub', href: l.github },
  l.linkedin && { label: 'LinkedIn', href: l.linkedin },
  l.email && { label: l.email, href: `mailto:${l.email}` },
].filter(Boolean);

/** Portefólio do membro: foto com máscara de losangos, projetos, stack e percurso com linha que se desenha. */
export default function Membro() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { data: m, loading, error, reload } = useMember(slug);
  useDocumentTitle(m?.name);
  const root = useRef(null);

  useGSAP(() => {
    if (!m) return undefined;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('[data-mask-cell]', { scale: 0, stagger: { each: 0.05, from: 'center' }, duration: 1, ease: 'back.out(1.6)', delay: 0.3 });
      gsap.utils.toArray('[data-prow]', root.current).forEach((r) => {
        gsap.from(r.querySelector('[data-line]'), { scaleX: 0, duration: 1.2, ease: 'expo.inOut', scrollTrigger: { trigger: r, start: 'top 90%', once: true } });
      });
      gsap.fromTo('[data-tl-line]', { scaleY: 0 }, { scaleY: 1, ease: 'none', transformOrigin: '50% 0%', scrollTrigger: { trigger: '[data-tl]', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 } });
      gsap.from('[data-tl-item]', { x: -30, autoAlpha: 0, stagger: 0.15, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '[data-tl]', start: 'top 75%', once: true } });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [m?.slug], revertOnUpdate: true });

  if (loading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={reload} />;

  const maskId = `mask-m-${m.slug.replace(/\W/g, '')}`;
  const [first, ...rest] = m.name.split(' ');
  const links = buildLinks(m.links, t);

  return (
    <div ref={root}>
      <div className="mhero wrap">
        <div className="mhero-photo">
          <DiamondMask id={maskId} />
          <div className="team-photo" style={{ clipPath: `url(#${maskId})` }}>
            {m.photoUrl ? <img src={m.photoUrl} alt={m.name} /> : <span className="team-initials">{m.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}</span>}
          </div>
          <span className="t-label">{m.location}</span>
        </div>
        <div className="mhero-txt">
          <PageHero label={`${t('member.breadcrumb')} / ${m.role}`} title={<>{first} <em>{rest.join(' ')}.</em></>} lead={m.headline} size="h1" />
          <Reveal className="mhero-more">
            {m.availability && <p className="mavail"><i className="state-dot" aria-hidden="true" />{m.availability}</p>}
            <p className="about-desc">{m.bio}</p>
            <div className="row">
              {links.map((l) => (
                <a key={l.label} href={l.href} target={l.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" className={`button ${l.primary ? 'button-primary' : 'button-outline'}`} data-cursor="open">{l.label}</a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {m.projects?.length > 0 && (
        <section className="wrap msec">
          <Label>{`(${String(m.projects.length).padStart(2, '0')})`}</Label>
          <H2>{t('member.projects_heading')}</H2>
          <ul className="work-list">
            {m.projects.map((p) => (
              <li key={p.slug} data-prow="">
                <TLink to={ROUTES.project(p.slug)} className="work-row" data-cursor="open">
                  <span className="work-name">{p.name}</span>
                  <span className="work-cat t-label">{p.role}</span>
                  <span className="work-line" data-line="" aria-hidden="true" />
                </TLink>
              </li>
            ))}
          </ul>
        </section>
      )}

      {m.skills?.length > 0 && (
        <section className="wrap msec">
          <H2>{t('member.stack_heading')}</H2>
          <p className="phero-lead">{t('member.stack_description')}</p>
          <Reveal as="ul" className="skills" stagger={0.1}>
            {m.skills.map((g) => (
              <li key={g.group} className="skill">
                <span className="t-label">{g.group}</span>
                <ul>{g.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </li>
            ))}
          </Reveal>
        </section>
      )}

      {m.timeline?.length > 0 && (
        <section className="wrap msec">
          <H2>{t('member.timeline_heading')}</H2>
          <ol className="tl" data-tl="">
            <span className="tl-line" data-tl-line="" aria-hidden="true" />
            {m.timeline.map((e, i) => (
              <li key={`${e.title}-${i}`} className="tl-item" data-tl-item="">
                <i className="tl-dot" aria-hidden="true" />
                <span className="t-label">{e.period}</span>
                <h3 className="t-h3">{e.title}</h3>
                <p>{e.place}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <PageCta title={t('member.cta_heading')} button={m.links?.email ?? t('nav.contact')} to={ROUTES.contact} />
    </div>
  );
}
