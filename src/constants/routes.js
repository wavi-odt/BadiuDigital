export const ROUTES = {
  home: '/',
  projects: '/projetos',
  project: (slug) => `/projetos/${slug}`,
  projectsByTag: (tag) => `/projetos?tag=${encodeURIComponent(tag)}`,
  services: '/servicos',
  team: '/equipa',
  member: (slug) => `/equipa/${slug}`,
  contact: '/contacto',
};
