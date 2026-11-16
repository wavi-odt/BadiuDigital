import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ErrorView } from '@/components/page';

export default function NotFound() {
  const { t } = useTranslation();
  useDocumentTitle('404');
  return <ErrorView error={{ status: 404, message: t('error.not_found_msg') }} />;
}
