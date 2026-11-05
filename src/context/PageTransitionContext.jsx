import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const LEAVE_MS = 550;
const PageTransitionContext = createContext(null);

/**
 * Controla a transição entre páginas: o losango laranja cobre o ecrã (leave),
 * a rota muda, e o losango encolhe para revelar a página nova (enter).
 */
export function PageTransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState('enter');
  const timer = useRef(null);

  const go = useCallback(
    (to) => {
      if (to === location.pathname) return;
      if (reducedMotion) {
        navigate(to);
        return;
      }
      setPhase('leave');
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        navigate(to);
        setPhase('enter');
      }, LEAVE_MS);
    },
    [navigate, location.pathname, reducedMotion],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  const value = useMemo(
    () => ({ phase, go, onEnterEnd: () => setPhase('idle') }),
    [phase, go],
  );

  return <PageTransitionContext.Provider value={value}>{children}</PageTransitionContext.Provider>;
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) throw new Error('usePageTransition tem de ser usado dentro de <PageTransitionProvider>');
  return ctx;
}
