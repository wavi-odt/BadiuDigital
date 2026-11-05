import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks/useFetch';
import { memberService } from '@/services/memberService';

export const useMembers = () => {
  const { i18n } = useTranslation();
  return useFetch((opts) => memberService.getAll(opts), [i18n.language]);
};

export const useMember = (slug) => {
  const { i18n } = useTranslation();
  return useFetch((opts) => memberService.getBySlug(slug, opts), [slug, i18n.language]);
};
