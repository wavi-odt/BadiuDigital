import { useTheme } from '@/hooks/useTheme';
import { useMediaQuery } from '@/motion/useMediaQuery';
import LazyGrainGradient from '@/gl/LazyGrainGradient';

/**
 * Fundo gratinado de todo o site: uma só camada fixa atrás do conteúdo.
 * O foco quente desce pela página com o scroll. Mais leve em mobile (menos resolução).
 */
export default function SiteBackground() {
  const { theme } = useTheme();
  const small = useMediaQuery('(max-width: 899px)');
  return (
    <LazyGrainGradient
      className="site-bg"
      palette={theme === 'light' ? 'siteLight' : 'site'}
      grain={theme === 'light' ? 0.12 : 0.17}
      spread={0.85}
      flow={0.04}
      follow
      adaptive
      dpr={small ? 0.5 : 0.75}
    />
  );
}
