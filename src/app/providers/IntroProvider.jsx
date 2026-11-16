import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const KEY = 'badiu:intro';
const IntroContext = createContext({ mode: 'none', heroReady: true, done: true, cueHero: () => {}, finish: () => {} });

function decideMode() {
  if (typeof window === 'undefined') return 'none';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'none';
  try {
    return sessionStorage.getItem(KEY) ? 'short' : 'full';
  } catch {
    return 'full';
  }
}

/**
 * Estado do preloader (só no primeiro carregamento da app):
 *  - mode: 'full' (1.ª visita) | 'short' (já visto nesta sessão) | 'none' (reduced motion)
 *  - heroReady: o hero pode começar a entrar (o preloader avisa a meio da saída)
 *  - done: o preloader terminou e desmontou
 */
export function IntroProvider({ children }) {
  const [mode] = useState(decideMode);
  const [heroReady, setHeroReady] = useState(mode === 'none');
  const [done, setDone] = useState(mode === 'none');

  const cueHero = useCallback(() => setHeroReady(true), []);
  const finish = useCallback(() => {
    setHeroReady(true);
    setDone(true);
    try { sessionStorage.setItem(KEY, '1'); } catch { /* modo privado */ }
  }, []);

  const value = useMemo(() => ({ mode, heroReady, done, cueHero, finish }), [mode, heroReady, done, cueHero, finish]);
  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);
