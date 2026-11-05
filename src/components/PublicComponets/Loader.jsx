import { useTranslation } from 'react-i18next';
import PanuLogo from './PanuLogo';

export default function Loader({ label }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-muted" role="status">
      <PanuLogo variant="gem" size={48} className="spin-slow" />
      <span className="font-mono text-sm">{label ?? t('ui.loading')}</span>
    </div>
  );
}
