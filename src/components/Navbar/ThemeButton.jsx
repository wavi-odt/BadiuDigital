import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';

/** Alterna tema escuro/claro. O ícone é um losango meio cheio que roda 180° ao trocar. */
export default function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="icon-btn theme-btn"
      data-dark={dark || undefined}
      aria-label={dark ? t('ui.theme_to_light') : t('ui.theme_to_dark')}
    >
      <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
        <polygon points="10,1.5 18.5,10 10,18.5 1.5,10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <polygon points="10,1.5 10,18.5 1.5,10" fill="currentColor" />
      </svg>
    </button>
  );
}
