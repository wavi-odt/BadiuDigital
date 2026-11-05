import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks/useFetch';
import { offeringService } from '@/services/offeringService';

export const useServices = () => {
  const { i18n } = useTranslation();
  return useFetch((opts) => offeringService.getAll(opts), [i18n.language]);
};
