import { useTranslation } from 'react-i18next';
import Logo from '@/components/Logo';
import TLink from '@/components/TLink';
import { ROUTES } from '@/constants/routes';

const STATUS_KEY = { LIVE: 'status_live', CLIENT: 'status_client', IN_DEVELOPMENT: 'status_in_dev', COMING_SOON: 'status_coming' };

/** Cartão de projeto: capa na cor do projeto (ou imagem), nome em itálico, resumo e etiquetas. */
export default function ProjectCard({ project: p, ...rest }) {
  const { t } = useTranslation();
  return (
    <TLink to={ROUTES.project(p.slug)} className="pcard" data-cursor="open" {...rest}>
      <div className="pcard-cover" style={{ background: p.coverColor, color: p.coverTextColor }}>
        {p.coverImageUrl && <img src={p.coverImageUrl} alt="" loading="lazy" />}
        <Logo variant="symbol" size={150} decorative theme="dark" className="pcard-mark" style={{ color: p.coverTextColor }} />
        <span className="pcard-name">{p.name}</span>
        <span className="pcard-status t-label">{t(`projects.${STATUS_KEY[p.status] ?? 'status_coming'}`)}</span>
      </div>
      <div className="pcard-body">
        <p className="pcard-sum">{p.summary}</p>
        <span className="t-label pcard-tags">{(p.tags ?? []).join(' · ')}</span>
      </div>
    </TLink>
  );
}
