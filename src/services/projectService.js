import i18next from 'i18next';
import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { env } from '@/config/env';
import { mockResponse, mockNotFound, withDevFallback } from '@/services/mocks/mockClient';
import { getProjects } from '@/services/mocks/data';

const toSummary = ({ description, team, ...summary }) => summary;

const listFromMock = (filters) => {
  const all = getProjects(i18next.language);
  return mockResponse(
    all
      .filter((p) => !filters.status || p.status === filters.status)
      .filter((p) => filters.featured === undefined || p.featured === filters.featured)
      .map(toSummary),
  );
};

const detailFromMock = (slug) => {
  const project = getProjects(i18next.language).find((p) => p.slug === slug);
  return project ? mockResponse(project) : mockNotFound();
};

export const projectService = {
  /**
   * GET /api/projects?status=&featured= → ProjectSummaryDTO[]
   * @param {{ status?: string, featured?: boolean }} filters
   */
  getAll: (filters = {}, options) =>
    env.useMocks
      ? listFromMock(filters)
      : withDevFallback(() => api.get(ENDPOINTS.projects, { ...options, params: filters }), () => listFromMock(filters)),

  /** GET /api/projects/{slug} → ProjectDetailDTO */
  getBySlug: (slug, options) =>
    env.useMocks
      ? detailFromMock(slug)
      : withDevFallback(() => api.get(ENDPOINTS.project(slug), options), () => detailFromMock(slug)),
};
