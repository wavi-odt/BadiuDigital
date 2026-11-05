import { useTranslation } from 'react-i18next';
import ErrorState from '@/components/PublicComponets/ErrorState';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function NotFoundPage() {
  const { t } = useTranslation();
  useDocumentTitle('404');
  return (
    <div className="pt-20">
      <ErrorState error={{ status: 404, message: t('error.not_found_msg') }} />
    </div>
  );
}
