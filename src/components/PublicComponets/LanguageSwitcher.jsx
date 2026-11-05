import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

const LANGS = [
  { code: 'pt',  short: 'PT',  label: 'Português' },
  { code: 'en',  short: 'EN',  label: 'English'   },
  { code: 'kri', short: 'KRI', label: 'Kriolu'    },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function close(e) { if (!ref.current?.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const current = LANGS.find(l => l.code === i18n.language) ?? LANGS[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={t('ui.change_language')}
        aria-expanded={open}
        className="lang-btn"
      >
        {current.short}
      </button>

      {open && (
        <div className="lang-menu">
          {LANGS.map(lang => (
            <button
              key={lang.code}
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
              className={cn('lang-menu__item', lang.code === i18n.language && 'lang-menu__item--active')}
            >
              <span className="lang-menu__short">{lang.short}</span>
              <span className="lang-menu__label">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
