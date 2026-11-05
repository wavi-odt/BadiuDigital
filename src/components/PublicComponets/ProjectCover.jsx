import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

export default function ProjectCover({ project, label, className, textClassName }) {
  const { t } = useTranslation();
  const { coverImageUrl, coverColor, coverTextColor, name } = project;
  if (coverImageUrl) {
    return <img src={coverImageUrl} alt={t('ui.project_cover_alt', { name })} className={cn('object-cover', className)} loading="lazy" />;
  }
  return (
    <div className={cn('flex items-end', className)} style={{ background: coverColor || '#0D4B57' }}>
      <span
        className={cn('font-extrabold tracking-[-0.05em] leading-[0.85]', textClassName)}
        style={{ color: coverTextColor || '#F1E4C3' }}
      >
        {label ?? name}
      </span>
    </div>
  );
}
