import { useInView } from '@/hooks/useInView';
import { cn } from '@/utils/cn';

/**
 * Anima o conteúdo quando entra no ecrã.
 * variant: "up" | "clip" | "line" | "vline"
 */
export default function Reveal({ as: Tag = 'div', variant = 'up', delay = 0, className, style, children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={cn('reveal', `reveal--${variant}`, inView && 'is-in', className)}
      style={{ transitionDelay: `${delay}s`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
