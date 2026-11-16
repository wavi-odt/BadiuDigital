import { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { ScrollTrigger } from '@/motion/gsap';
import { useMotion } from '@/app/providers/MotionProvider';
import { preloadPath } from '@/app/routes';
import Curtain from '@/components/Curtain';

const TransitionContext = createContext({ go: () => {}, isNavigating: () => false });

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

/**
 * Troca o DOM dentro de uma View Transition quando o browser suporta
 * (troca atómica + elementos partilhados com view-transition-name);
 * caso contrário troca diretamente. A cortina GSAP tapa a troca nos dois casos.
 */
async function swapDom(update) {
  if (typeof document.startViewTransition === 'function') {
    const vt = document.startViewTransition(update);
    await vt.updateCallbackDone.catch(() => {});
    vt.finished.catch(() => {});
    return;
  }
  update();
}

export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lenis, reduced, scrollTo } = useMotion();
  const curtain = useRef(null);
  const busy = useRef(false);
  const here = useRef(location);
  here.current = location;

  const go = useCallback(
    async (to, { replace = false } = {}) => {
      const url = new URL(to, window.location.origin);
      const target = url.pathname + url.search + url.hash;
      const { pathname, search } = here.current;
      if (busy.current || url.pathname + url.search === pathname + search) return;
      busy.current = true;

      const update = () => flushSync(() => navigate(target, { replace, state: { viaTransition: true } }));
      const load = preloadPath(url.pathname).catch(() => {});

      try {
        if (reduced || !curtain.current) {
          await load;
          await swapDom(update); // reduced motion: só o fade curto da View Transition (ou nada)
          scrollTo(0, { immediate: true, force: true });
          return;
        }
        lenis?.stop();
        await Promise.all([curtain.current.cover(), load]);
        await swapDom(update);
        scrollTo(0, { immediate: true, force: true });
        await nextFrame();
        ScrollTrigger.refresh();
        await curtain.current.reveal();
      } finally {
        lenis?.start();
        busy.current = false;
      }
    },
    [navigate, lenis, reduced, scrollTo],
  );

  const value = useMemo(() => ({ go, isNavigating: () => busy.current }), [go]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <Curtain ref={curtain} />
    </TransitionContext.Provider>
  );
}

export const usePageNavigation = () => useContext(TransitionContext);
