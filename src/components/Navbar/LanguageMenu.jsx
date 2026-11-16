import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'pt', short: 'PT', label: 'Português' },
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'kri', short: 'KRI', label: 'Kriolu' },
];

/** Seletor de idioma (PT · EN · KRI). Fecha com Esc, clique fora ou ao escolher. */
export default function LanguageMenu({ onOpenChange }) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const btn = useRef(null);
  const id = useId();

  useEffect(() => { onOpenChange?.(open); }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc); };
  }, [open]);

  useEffect(() => { document.documentElement.lang = i18n.language === 'kri' ? 'kea' : i18n.language; }, [i18n.language]);

  const current = LANGS.find((l) => l.code === i18n.language) ?? LANGS[0];

  return (
    <div ref={ref} className="lang">
      <button
        ref={btn}
        type="button"
        className="icon-btn icon-btn--text"
        aria-label={t('ui.change_language')}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        {current.short}
      </button>
      <ul id={id} className="lang-list" data-open={open || undefined} hidden={!open}>
        {LANGS.map((lang) => (
          <li key={lang.code}>
            <button
              type="button"
              lang={lang.code === 'kri' ? 'kea' : lang.code}
              aria-current={lang.code === i18n.language ? 'true' : undefined}
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); btn.current?.focus(); }}
            >
              <span className="lang-short">{lang.short}</span>
              <span>{lang.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
