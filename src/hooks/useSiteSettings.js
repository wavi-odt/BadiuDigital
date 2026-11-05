import { useFetch } from '@/hooks/useFetch';
import { settingsService } from '@/services/settingsService';

export const useSiteSettings = () => useFetch((opts) => settingsService.get(opts), []);
