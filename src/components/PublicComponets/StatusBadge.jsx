import { useTranslation } from 'react-i18next';
import { PROJECT_STATUS } from '@/constants/projectStatus';
import { cn } from '@/utils/cn';

const STATUS_KEY = {
  LIVE: 'status_live',
  CLIENT: 'status_client',
  IN_DEVELOPMENT: 'status_in_dev',
  COMING_SOON: 'status_coming',
};

export default function StatusBadge({ status, className }) {
  const { t } = useTranslation();
  const badge = PROJECT_STATUS[status]?.badge ?? 'badge--sand';
  const label = STATUS_KEY[status] ? t(`projects.${STATUS_KEY[status]}`) : (status ?? '');
  return <span className={cn('badge', badge, className)}>{label}</span>;
}
