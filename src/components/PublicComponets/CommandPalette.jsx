import {
  createContext, useCallback, useContext, useEffect,
  useId, useMemo, useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useProjects } from '@/hooks/useProjects';
import { useMembers } from '@/hooks/useMembers';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { usePageTransition } from '@/context/PageTransitionContext';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

/* ------------------------------------------------------------------ */
/*  Context                                                             */
/* ------------------------------------------------------------------ */

const CmdCtx = createContext(null);

export function CommandPaletteProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openPalette  = useCallback(() => setOpen(true),  []);
  const closePalette = useCallback(() => setOpen(false), []);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Global Ctrl/Cmd+K
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(v => !v);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = useMemo(() => ({ open, openPalette, closePalette }), [open, openPalette, closePalette]);
  return <CmdCtx.Provider value={value}>{children}</CmdCtx.Provider>;
}

export function useCommandPalette() {
  const ctx = useContext(CmdCtx);
  if (!ctx) throw new Error('useCommandPalette must be used inside CommandPaletteProvider');
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */


function norm(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function matches(item, q) {
  const n = norm(q);
  return norm(item.label).includes(n) || norm(item.sub ?? '').includes(n);
}

function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const el = Object.assign(document.createElement('textarea'), {
    value: text, style: 'position:fixed;opacity:0',
  });
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  el.remove();
  return Promise.resolve();
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG)                                                  */
/* ------------------------------------------------------------------ */

function DiamondIcon({ filled = false }) {
  return (
    <svg width="14" height="14" viewBox="0 0 100 100" aria-hidden="true">
      {filled
        ? <polygon points="50,4 96,50 50,96 4,50" fill="currentColor" />
        : <polygon points="50,4 96,50 50,96 4,50" fill="none" stroke="currentColor" strokeWidth="10" />}
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="34" r="22" fill="currentColor" />
      <path d="M8 90 Q8 66 50 66 Q92 66 92 90" fill="currentColor" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 100 100" aria-hidden="true">
      <rect x="18" y="30" width="54" height="58" rx="8" fill="none" stroke="currentColor" strokeWidth="8" />
      <path d="M34 28 V20 Q34 10 46 10 H68 Q78 10 78 20 V62 Q78 72 68 72" fill="none" stroke="currentColor" strokeWidth="8" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  CommandPalette dialog                                               */
/* ------------------------------------------------------------------ */

export default function CommandPalette() {
  const { open, closePalette } = useCommandPalette();
  const { go }                 = usePageTransition();
  const { t }                  = useTranslation();
  const { data: projects }     = useProjects();
  const { data: members }      = useMembers();
  const { data: settings }     = useSiteSettings();

  const PAGES = [
    { id: 'page-home',     label: t('nav.home'),     sub: t('palette.home_sub'),     to: ROUTES.home },
    { id: 'page-projects', label: t('nav.projects'), sub: t('palette.projects_sub'), to: ROUTES.projects },
    { id: 'page-team',     label: t('nav.team'),     sub: t('palette.team_sub'),     to: ROUTES.team },
    { id: 'page-contact',  label: t('nav.contact'),  sub: t('palette.contact_sub'),  to: ROUTES.contact },
  ];

  const [query,     setQuery]     = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied,    setCopied]    = useState(false);
  const [visible,   setVisible]   = useState(false);
  const [animOut,   setAnimOut]   = useState(false);

  const inputRef = useRef(null);
  const listRef  = useRef(null);
  const listId   = useId();
  const titleId  = useId();

  // Enter / exit animation state machine
  useEffect(() => {
    if (open) {
      setAnimOut(false);
      setVisible(true);
    } else {
      setAnimOut(true);
      const t = setTimeout(() => { setVisible(false); setAnimOut(false); }, 210);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Reset + focus on each open
  useEffect(() => {
    if (visible && !animOut) {
      setQuery('');
      setActiveIdx(0);
      setCopied(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [visible, animOut]);

  // Build flat item list
  const items = useMemo(() => {
    const q = query.trim();
    const projectItems = (projects ?? []).map(p => ({
      id: `project-${p.slug}`,
      category: 'project',
      label: p.name,
      sub: p.tags?.join(' · ') ?? '',
      to: ROUTES.project(p.slug),
    }));
    const memberItems = (members ?? []).map(m => ({
      id: `member-${m.slug}`,
      category: 'member',
      label: m.name,
      sub: m.role ?? '',
      to: ROUTES.member(m.slug),
    }));
    const actionItems = settings?.email
      ? [{ id: 'action-email', category: 'action', label: t('palette.copy_email'), sub: settings.email }]
      : [];

    const all = [
      ...PAGES.map(p => ({ ...p, category: 'page' })),
      ...projectItems,
      ...memberItems,
      ...actionItems,
    ];
    return q ? all.filter(item => matches(item, q)) : all;
  }, [query, projects, members, settings]);

  // Clamp active index when list length changes
  useEffect(() => {
    setActiveIdx(i => (items.length === 0 ? 0 : Math.min(i, items.length - 1)));
  }, [items.length]);

  // Scroll active item into view
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${activeIdx}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const closeDialog = useCallback(() => closePalette(), [closePalette]);

  const execute = useCallback((item) => {
    if (item.to) {
      closeDialog();
      setTimeout(() => go(item.to), 220);
    } else if (item.id === 'action-email' && settings?.email) {
      copyText(settings.email).then(() => {
        setCopied(true);
        setTimeout(closeDialog, 1200);
      });
    }
  }, [closeDialog, go, settings]);

  function onKeyDown(e) {
    switch (e.key) {
      case 'Escape':
        e.stopPropagation();
        closeDialog();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIdx(i => Math.min(i + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIdx(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (items[activeIdx]) execute(items[activeIdx]);
        break;
      case 'Tab':
        e.preventDefault(); // focus trap — navigation is arrow-key driven
        break;
      default:
        break;
    }
  }

  // Group items for rendering
  const groups = useMemo(() => {
    const map = { page: [], project: [], member: [], action: [] };
    items.forEach((item, globalIdx) => map[item.category].push({ ...item, globalIdx }));
    return [
      map.page.length    && { key: 'page',    label: t('palette.group_pages'),    items: map.page },
      map.project.length && { key: 'project', label: t('palette.group_projects'), items: map.project },
      map.member.length  && { key: 'member',  label: t('palette.group_members'),  items: map.member },
      map.action.length  && { key: 'action',  label: t('palette.group_actions'),  items: map.action },
    ].filter(Boolean);
  }, [items]);

  if (!visible) return null;

  const activeId = items[activeIdx] ? `${listId}-${items[activeIdx].id}` : undefined;

  return (
    <div
      className={cn('cmd-backdrop', animOut && 'cmd-backdrop--out')}
      onMouseDown={e => { if (e.target === e.currentTarget) closeDialog(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn('cmd-dialog', animOut && 'cmd-dialog--out')}
        onKeyDown={onKeyDown}
      >
        <span id={titleId} className="sr-only">{t('palette.title')}</span>

        {/* Search bar */}
        <div className="cmd-search">
          <span className="cmd-search__icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 100 100">
              <polygon points="50,0 100,50 50,100 0,50" fill="currentColor" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIdx(0); }}
            placeholder={t('palette.placeholder')}
            className="cmd-search__input"
            role="combobox"
            aria-expanded={items.length > 0}
            aria-controls={listId}
            aria-activedescendant={activeId}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="cmd-kbd">Esc</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} id={listId} role="listbox" aria-label={t('palette.results')} className="cmd-results">
          {groups.length === 0 && (
            <p className="cmd-empty">{t('palette.empty')} "{query}"</p>
          )}
          {groups.map(group => (
            <div key={group.key} role="group" aria-label={group.label} className="cmd-group">
              <span className="cmd-group__label" aria-hidden="true">{group.label}</span>
              {group.items.map(item => (
                <button
                  key={item.id}
                  id={`${listId}-${item.id}`}
                  data-idx={item.globalIdx}
                  role="option"
                  aria-selected={item.globalIdx === activeIdx}
                  className={cn('cmd-item', item.globalIdx === activeIdx && 'cmd-item--active')}
                  onMouseEnter={() => setActiveIdx(item.globalIdx)}
                  onClick={() => execute(item)}
                  tabIndex={-1}
                >
                  <span className="cmd-item__icon">
                    {item.category === 'page'    && <DiamondIcon />}
                    {item.category === 'project' && <DiamondIcon filled />}
                    {item.category === 'member'  && <PersonIcon />}
                    {item.category === 'action'  && <CopyIcon />}
                  </span>
                  <span className="cmd-item__body">
                    <span className="cmd-item__label">
                      {item.id === 'action-email' && copied ? t('palette.copied') : item.label}
                    </span>
                    {item.sub && <span className="cmd-item__sub">{item.sub}</span>}
                  </span>
                  {item.to && <span className="cmd-item__arrow" aria-hidden="true">↗</span>}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Footer hints */}
        <div className="cmd-footer" aria-hidden="true">
          <span><kbd className="cmd-kbd">↑↓</kbd> {t('palette.navigate')}</span>
          <span><kbd className="cmd-kbd">↵</kbd> {t('palette.select')}</span>
          <span><kbd className="cmd-kbd">Esc</kbd> {t('palette.close')}</span>
        </div>
      </div>
    </div>
  );
}

export { isMac };
