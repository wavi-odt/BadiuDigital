import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '@/app/Layout';
import { pages, routeTable } from '@/app/routes';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {routeTable.map(({ page, ...r }) => {
          const Page = pages[page];
          const element = (
            <Suspense fallback={null}>
              <Page />
            </Suspense>
          );
          return r.index
            ? <Route key="index" index element={element} />
            : <Route key={r.path} path={r.path} element={element} />;
        })}
      </Route>
    </Routes>
  );
}
