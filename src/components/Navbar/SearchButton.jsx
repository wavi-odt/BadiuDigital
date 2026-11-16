import { useTranslation } from 'react-i18next';
import { useCommandPalette, isMac } from '@/components/PublicComponets/CommandPalette';

/** Abre a pesquisa (paleta de comandos, também com Ctrl/⌘ + K). */
export default function SearchButton() {
  const { t } = useTranslation();
  const { openPalette } = useCommandPalette();
  const shortcut = isMac ? '⌘K' : 'Ctrl K';

  return (
    <button
      type="button"
      onClick={openPalette}
      className="icon-btn search-btn"
      aria-label={t('ui.search', { shortcut })}
      aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}
    >
      <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden="true">
        <polygon points="8.5,2 15,8.5 8.5,15 2,8.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <line x1="13" y1="13" x2="18" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <kbd className="search-kbd" aria-hidden="true">{shortcut}</kbd>
    </button>
  );
}
