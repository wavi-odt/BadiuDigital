import { Route, Routes } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import HomePage from '@/pages/public/HomePage';
import ProjectsPage from '@/pages/public/ProjectsPage';
import ProjectPage from '@/pages/public/ProjectPage';
import TeamPage from '@/pages/public/TeamPage';
import MemberPage from '@/pages/public/MemberPage';
import ContactPage from '@/pages/public/ContactPage';
import NotFoundPage from '@/pages/public/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projetos" element={<ProjectsPage />} />
        <Route path="projetos/:slug" element={<ProjectPage />} />
        <Route path="equipa" element={<TeamPage />} />
        <Route path="equipa/:slug" element={<MemberPage />} />
        <Route path="contacto" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
