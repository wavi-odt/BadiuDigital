import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { env } from '@/config/env';
import { mockResponse } from '@/services/mocks/mockClient';

export const contactService = {
  /**
   * POST /api/contact
   * body: ContactRequestDTO { name, email, projectType, message, memberSlug? }
   * → 201 { id, createdAt }
   */
  send: (payload, options) =>
    env.useMocks
      ? mockResponse({ id: Date.now(), createdAt: new Date().toISOString() })
      : api.post(ENDPOINTS.contact, payload, options),
};
