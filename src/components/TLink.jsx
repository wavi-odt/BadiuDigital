import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { usePageNavigation } from '@/app/providers/TransitionProvider';
import { preloadPath } from '@/app/routes';

/**
 * Link interno com a transição da cortina. Usar sempre em vez de <Link>.
 * Ao passar o rato / focar, já descarrega o código da página de destino.
 * Ctrl/Cmd/Shift-clique e o botão do meio continuam a abrir noutro separador.
 */
const TLink = forwardRef(function TLink({ to, onClick, onMouseEnter, onFocus, replace, ...rest }, ref) {
  const { go } = usePageNavigation();
  const warm = () => preloadPath(new URL(to, window.location.origin).pathname).catch(() => {});

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target === '_blank') return;
    e.preventDefault();
    go(to, { replace });
  };

  return (
    <Link
      ref={ref}
      to={to}
      onClick={handleClick}
      onMouseEnter={(e) => { warm(); onMouseEnter?.(e); }}
      onFocus={(e) => { warm(); onFocus?.(e); }}
      {...rest}
    />
  );
});

export default TLink;
