import { useTranslation } from 'react-i18next';
import PanuLogo from './PanuLogo';
import TiltCard from './TiltCard';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

export default function MemberCard({ member }) {
  const { t } = useTranslation();
  const sand = member.theme === 'SAND';
  return (
    <TiltCard to={ROUTES.member(member.slug)} ariaLabel={member.name} className="member-card">
      <div className="flex flex-col gap-4.5">
        <div
          className={cn(
            'member-card__photo relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[28px]',
            sand ? 'bg-sand' : 'bg-petrol',
          )}
        >
          {member.photoUrl ? (
            <img src={member.photoUrl} alt={member.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          ) : (
            <span className={cn('font-mono text-sm', sand ? 'text-[#3B5A60]' : 'text-muted-2')}>{t('ui.photo_placeholder')}</span>
          )}
          <PanuLogo variant="gem" tone={sand ? 'petrol' : 'sand'} size={230} className="member-card__gem absolute -bottom-15 -right-15 opacity-30" />
          <span className={cn('badge absolute left-4.5 top-4.5', sand ? 'badge--petrol' : 'badge--orange')}>{member.role}</span>
        </div>
        <div className="flex items-start justify-between gap-3 px-1">
          <div className="flex flex-col gap-1.5">
            <span className="text-[34px] font-extrabold leading-none tracking-[-0.04em]">{member.name}</span>
            <span className="text-[17px] text-muted">{member.shortBio}</span>
          </div>
          <span className="arrow-nudge text-3xl text-orange">↗</span>
        </div>
      </div>
    </TiltCard>
  );
}
