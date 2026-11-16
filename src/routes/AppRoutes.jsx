import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import HomePage from '@/pages/public/HomePage';
import ProjectsPage from '@/pages/public/ProjectsPage';
import ProjectPage from '@/pages/public/ProjectPage';
import TeamPage from '@/pages/public/TeamPage';
import MemberPage from '@/pages/public/MemberPage';
import ServicesPage from '@/pages/public/ServicesPage';
import ContactPage from '@/pages/public/ContactPage';
import NotFoundPage from '@/pages/public/NotFoundPage';
// Folha de marca (só em dev, fica fora do build de produção)
const BrandSheet = import.meta.env.DEV ? lazy(() => import('@/pages/dev/BrandSheet')) : null;

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projetos" element={<ProjectsPage />} />
        <Route path="projetos/:slug" element={<ProjectPage />} />
        <Route path="servicos" element={<ServicesPage />} />
        <Route path="equipa" element={<TeamPage />} />
        <Route path="equipa/:slug" element={<MemberPage />} />
        <Route path="contacto" element={<ContactPage />} />
        {import.meta.env.DEV && <Route path="_marca" element={<Suspense fallback={null}><BrandSheet /></Suspense>} />}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
