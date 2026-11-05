// Todos os endpoints do backend Spring Boot (prefixo /api adicionado em api.js)
export const ENDPOINTS = {
  settings: '/settings',
  services: '/services',
  projects: '/projects',
  project: (slug) => `/projects/${encodeURIComponent(slug)}`,
  members: '/members',
  member: (slug) => `/members/${encodeURIComponent(slug)}`,
  contact: '/contact',
};
