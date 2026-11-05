import { Link } from 'react-router-dom';
import { usePageTransition } from '@/context/PageTransitionContext';

/** Link interno que corre a animação de saída antes de mudar de página */
export default function TransitionLink({ to, onClick, children, ...rest }) {
  const { go } = usePageTransition();

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(to);
  };

  return (
    <Link to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
