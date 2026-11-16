import { useSyncExternalStore } from 'react';

/** Subscreve uma media query e devolve se corresponde (atualiza em tempo real). */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** true quando o utilizador pediu menos movimento no sistema. */
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** true com rato/trackpad (cursor e hovers); false em touch. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');

/** Queries partilhadas com gsap.matchMedia() */
export const MQ = {
  reduce: '(prefers-reduced-motion: reduce)',
  motion: '(prefers-reduced-motion: no-preference)',
  fine: '(hover: hover) and (pointer: fine)',
  desktop: '(min-width: 900px)',
  mobile: '(max-width: 899px)',
};
