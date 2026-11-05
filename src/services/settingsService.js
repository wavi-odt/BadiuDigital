import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { env } from '@/config/env';
import { mockResponse, withDevFallback } from '@/services/mocks/mockClient';
import * as mock from '@/services/mocks/data';

const fromMock = () => mockResponse(mock.settings);

export const settingsService = {
  /** GET /api/settings → SiteSettingsDTO */
  get: (options) =>
    env.useMocks ? fromMock() : withDevFallback(() => api.get(ENDPOINTS.settings, options), fromMock),
};
