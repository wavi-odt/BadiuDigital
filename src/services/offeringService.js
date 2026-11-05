import i18next from 'i18next';
import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { env } from '@/config/env';
import { mockResponse, withDevFallback } from '@/services/mocks/mockClient';
import { getServices } from '@/services/mocks/data';

const fromMock = () => mockResponse(getServices(i18next.language));

// "Serviços" do estúdio (o nome offeringService evita confusão com a pasta services/)
export const offeringService = {
  /** GET /api/services → ServiceDTO[] (ordenados por number) */
  getAll: (options) =>
    env.useMocks ? fromMock() : withDevFallback(() => api.get(ENDPOINTS.services, options), fromMock),
};
