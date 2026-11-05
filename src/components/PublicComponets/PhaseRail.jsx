import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

export default function PhaseRail({ phases, active, tone, onSelect }) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t('ui.page_phases')} className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-1.5 md:flex">
      {phases.map((phase, i) => (
        <button
          key={phase.id}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={phase.label}
          aria-current={i === active ? 'step' : undefined}
          className="flex h-7 w-11 cursor-pointer items-center justify-end border-none bg-transparent p-0"
        >
          <span
            className={cn(
              'block h-1.5 rounded-full transition-all duration-300',
              i === active ? 'w-7 bg-orange' : cn('w-2.5', tone === 'light' ? 'bg-ink-text/35' : 'bg-sand/40'),
            )}
          />
        </button>
      ))}
    </nav>
  );
}
