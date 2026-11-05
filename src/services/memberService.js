import i18next from 'i18next';
import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { env } from '@/config/env';
import { mockResponse, mockNotFound, withDevFallback } from '@/services/mocks/mockClient';
import { getMembers } from '@/services/mocks/data';

const toSummary = ({ id, slug, name, role, shortBio, photoUrl, founder, theme }) => ({
  id, slug, name, role, shortBio, photoUrl, founder, theme,
});

const listFromMock = () => mockResponse(getMembers(i18next.language).map(toSummary));

const detailFromMock = (slug) => {
  const member = getMembers(i18next.language).find((m) => m.slug === slug);
  return member ? mockResponse(member) : mockNotFound();
};

export const memberService = {
  /** GET /api/members → MemberSummaryDTO[] */
  getAll: (options) =>
    env.useMocks ? listFromMock() : withDevFallback(() => api.get(ENDPOINTS.members, options), listFromMock),

  /** GET /api/members/{slug} → MemberDetailDTO */
  getBySlug: (slug, options) =>
    env.useMocks
      ? detailFromMock(slug)
      : withDevFallback(() => api.get(ENDPOINTS.member(slug), options), () => detailFromMock(slug)),
};
