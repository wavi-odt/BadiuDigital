import { PageTransitionProvider } from '@/context/PageTransitionContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { MotionProvider } from '@/app/providers/MotionProvider';
import AppRoutes from '@/routes/AppRoutes';

export default function App() {
  return (
    <ThemeProvider>
      <MotionProvider>
        <PageTransitionProvider>
          <AppRoutes />
        </PageTransitionProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}
