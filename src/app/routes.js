import { lazy } from 'react';
import { matchRoutes } from 'react-router-dom';

/**
 * lazy() com preload: a transição de página começa a descarregar o código
 * da página seguinte enquanto a cortina cobre o ecrã.
 */
function lazyPage(loader) {
  let promise;
  const load = () => (promise ??= loader());
  const Component = lazy(load);
  Component.preload = load;
  return Component;
}

export const pages = {
  home: lazyPage(() => import('@/pages/Home')),
  projects: lazyPage(() => import('@/pages/public/ProjectsPage')),
  project: lazyPage(() => import('@/pages/public/ProjectPage')),
  services: lazyPage(() => import('@/pages/public/ServicesPage')),
  team: lazyPage(() => import('@/pages/public/TeamPage')),
  member: lazyPage(() => import('@/pages/public/MemberPage')),
  contact: lazyPage(() => import('@/pages/public/ContactPage')),
  notFound: lazyPage(() => import('@/pages/public/NotFoundPage')),
  // folha de marca: só em desenvolvimento, fica fora do build de produção
  brand: import.meta.env.DEV ? lazyPage(() => import('@/pages/dev/BrandSheet')) : null,
};

/** Tabela de rotas (paths iguais aos de constants/routes.js) */
export const routeTable = [
  { index: true, page: 'home' },
  { path: 'projetos', page: 'projects' },
  { path: 'projetos/:slug', page: 'project' },
  { path: 'servicos', page: 'services' },
  { path: 'equipa', page: 'team' },
  { path: 'equipa/:slug', page: 'member' },
  { path: 'contacto', page: 'contact' },
  ...(import.meta.env.DEV ? [{ path: '_marca', page: 'brand' }] : []),
  { path: '*', page: 'notFound' },
];

const matchable = [{ path: '/', children: routeTable.map(({ page, ...r }) => ({ ...r, id: page })) }];

/** Descarrega o código da página de um URL (sem a montar). */
export function preloadPath(pathname) {
  const match = matchRoutes(matchable, pathname)?.at(-1);
  return pages[match?.route.id]?.preload?.() ?? Promise.resolve();
}
