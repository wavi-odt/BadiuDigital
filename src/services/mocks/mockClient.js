import i18next from 'i18next';
import { ApiError } from '@/services/api';

const DELAY_MS = 350;

export const mockResponse = (data) =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), DELAY_MS));

export const mockNotFound = () =>
  new Promise((_, reject) => setTimeout(() => reject(new ApiError(i18next.t('error.not_found'), 404)), DELAY_MS));

/**
 * Em desenvolvimento, se o backend não estiver a correr (erro de rede),
 * usa os dados de exemplo em vez de deixar a página vazia.
 * Em produção os erros passam sempre para a página.
 */
export async function withDevFallback(request, fallback) {
  try {
    return await request();
  } catch (err) {
    if (import.meta.env.DEV && err instanceof ApiError && err.status === 0) {
      console.warn('[badiu] Backend indisponível — a usar dados de exemplo.', err.message);
      return fallback();
    }
    throw err;
  }
}
