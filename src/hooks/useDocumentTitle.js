import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SUFFIX = 'Badiu Digital';

export function useDocumentTitle(title) {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = title ? `${title} | ${SUFFIX}` : `${SUFFIX} | ${t('ui.tagline_suffix')}`;
  }, [title, t]);
}
