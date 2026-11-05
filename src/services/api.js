import i18next from 'i18next';
import { env } from '@/config/env';

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const DEFAULT_TIMEOUT_MS = 10000;

async function request(path, { method = 'GET', body, params, signal, timeout = DEFAULT_TIMEOUT_MS, headers } = {}) {
  const url = new URL(`/api${path}`, env.apiBaseUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort, { once: true });

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const text = await res.text();
    let data = null;
    if (text) {
      try { data = JSON.parse(text); } catch { data = text; }
    }

    if (!res.ok) {
      throw new ApiError(data?.message || i18next.t('error.http', { status: res.status }), res.status, data);
    }
    return data;
  } catch (err) {
    if (signal?.aborted) throw err; // cancelado por quem chamou (ex.: componente desmontado)
    if (err instanceof ApiError) throw err;
    if (err.name === 'AbortError') throw new ApiError(i18next.t('error.timeout'));
    throw new ApiError(i18next.t('error.network'));
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
