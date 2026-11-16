import { forwardRef } from 'react';
import { CELLS, PALETTES, STROKE, TIGHT_VIEWBOX } from './geometry';

/**
 * Logo Badiu gerado a partir da geometria (cada losango é um <polygon> animável).
 *
 * variant: horizontal | vertical | symbol | wordmark | mono
 * theme:   auto (segue o tema do site) | dark | light
 * size:    altura do símbolo em px (no "wordmark", o tamanho da letra)
 *
 * Alvos para animação (dentro do ref):
 *   [data-logo-cell]            todos os losangos   (data-role = core | b | rest, data-cell = "r-k")
 *   [data-logo-cell="2-2"]      o núcleo
 *   .logo-wm [data-wm-char]     as letras do wordmark (o ponto do ı é .logo-wm-dot)
 *
 * Regras da marca: espaço livre = altura de 3 losangos; mínimo 24px (símbolo) / 90px (horizontal).
 * Abaixo de 24px o símbolo passa automaticamente à versão favicon (sem o "b").
 */
const Logo = forwardRef(function Logo(
  { variant = 'horizontal', theme = 'auto', size = 32, title = 'Badiu Digital', className = '', decorative = false, style, ...rest },
  ref,
) {
  const mono = variant === 'mono';
  const showSymbol = variant !== 'wordmark';
  const showWordmark = variant !== 'symbol';
  const small = showSymbol && size < 24;
  const palette = mono ? PALETTES.mono : small ? PALETTES.favicon : PALETTES[theme] || PALETTES.auto;

  // proporções: horizontal (símbolo 30 : letra 24), vertical (símbolo 150 : letra 72)
  const wmSize = variant === 'wordmark' ? size : variant === 'vertical' ? size * 0.48 : size * 0.8;
  // tema fixo: o wordmark também fica fixo (osso no escuro, noite no claro)
  const fixedColor = !mono && theme === 'dark' ? '#F5F5F2' : !mono && theme === 'light' ? '#0A0A0A' : undefined;
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': title };

  return (
    <span
      ref={ref}
      className={`logo logo--${variant === 'mono' ? 'horizontal' : variant} ${className}`}
      style={{ '--logo-dot': palette.core, color: fixedColor, ...style }}
      {...a11y}
      {...rest}
    >
      {showSymbol && (
        <svg
          className="logo-symbol"
          width={size}
          height={size}
          viewBox={TIGHT_VIEWBOX}
          aria-hidden="true"
          focusable="false"
          overflow="visible"
        >
          {CELLS.map((c) => {
            const fill = palette[c.role];
            return (
              <polygon
                key={c.id}
                data-logo-cell={c.id}
                data-role={c.role}
                points={c.points}
                fill={fill}
                stroke={fill}
                strokeWidth={STROKE}
                strokeLinejoin="round"
              />
            );
          })}
        </svg>
      )}

      {showWordmark && (
        <span className="logo-wm wm" style={{ fontSize: wmSize }} aria-hidden="true">
          <span data-wm-char>b</span>
          <span data-wm-char>a</span>
          <span data-wm-char>d</span>
          <span data-wm-char className="logo-wm-i">
            ı<i className="logo-wm-dot" />
          </span>
          <span data-wm-char>u</span>
        </span>
      )}
    </span>
  );
});

export default Logo;
