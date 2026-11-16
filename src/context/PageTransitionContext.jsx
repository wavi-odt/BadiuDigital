// TEMPORÁRIO (rebrand): adaptador para os componentes antigos continuarem a funcionar
// com a transição nova (cortina de losangos). Apagar quando a última página antiga for refeita.
import { usePageNavigation } from '@/app/providers/TransitionProvider';

export function PageTransitionProvider({ children }) {
  return children;
}

export function usePageTransition() {
  const { go } = usePageNavigation();
  return { go, phase: 'idle', onEnterEnd: () => {} };
}
