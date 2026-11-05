import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks/useFetch';
import { projectService } from '@/services/projectService';

export const useProjects = (filters = {}) => {
  const { i18n } = useTranslation();
  return useFetch((opts) => projectService.getAll(filters, opts), [JSON.stringify(filters), i18n.language]);
};

export const useProject = (slug) => {
  const { i18n } = useTranslation();
  return useFetch((opts) => projectService.getBySlug(slug, opts), [slug, i18n.language]);
};
