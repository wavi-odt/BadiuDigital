import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from '@/motion/gsap';
import { useMotion } from '@/app/providers/MotionProvider';
import { usePageNavigation } from '@/app/providers/TransitionProvider';
import { useProjects } from '@/hooks/useProjects';
import { useMembers } from '@/hooks/useMembers';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { ROUTES } from '@/constants/routes';

const Ctx = createContext(null);
export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);

export function SearchProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openSearch = useCallback(() => setOpen(true), []);
  const closeSearch = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((v) => !v); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = useMemo(() => ({ open, openSearch, closeSearch }), [open, openSearch, closeSearch]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSearch() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useSearch tem de estar dentro de <SearchProvider>');
  return c;
}

const norm = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

async function copy(text) {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const el = Object.assign(document.createElement('textarea'), { value: text });
    el.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(el); el.select(); document.execCommand('copy'); el.remove();
  }
}

/**
 * Pesquisa (Ctrl/⌘ + K): páginas, projetos, membros e "copiar email".
 * Abre com uma máscara em losango que se expande; navega com ↑ ↓ ↵ e fecha com Esc.
 * Navegar a partir daqui usa a cortina de losangos.
 */
export default function Search() {
  const { open, closeSearch } = useSearch();
  const { t } = useTranslation();
  const { go } = usePageNavigation();
  const { lenis, reduced } = useMotion();
  const { data: projects } = useProjects();
  const { data: members } = useMembers();
  const { data: settings } = useSiteSettings();

  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const input = useRef(null);
  const list = useRef(null);
  const dialog = useRef(null);
  const back = useRef(null);
  const opener = useRef(null);
  const id = useId();

  // abrir / fechar com animação
  useEffect(() => {
    if (open) {
      opener.current = document.activeElement;
      setMounted(true);
      setQuery(''); setActive(0); setCopied(false);
      lenis?.stop();
      return undefined;
    }
    if (!mounted) return undefined;
    lenis?.start();
    if (reduced) { setMounted(false); return undefined; }
    const tl = gsap.timeline({ onComplete: () => setMounted(false) });
    tl.to(dialog.current, { autoAlpha: 0, y: -16, scale: 0.97, duration: 0.25, ease: 'power3.in' }, 0)
      .to(back.current, { autoAlpha: 0, duration: 0.3 }, 0);
    opener.current?.focus?.();
    return () => tl.kill();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mounted || !open) return;
    if (!reduced) {
      gsap.fromTo(back.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
      gsap.fromTo(dialog.current, { clipPath: 'polygon(50% 40%, 60% 50%, 50% 60%, 40% 50%)', autoAlpha: 1 }, { clipPath: 'polygon(50% -40%, 140% 50%, 50% 140%, -40% 50%)', duration: 0.7, ease: 'expo.out' });
      gsap.fromTo('[data-sr-item]', { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.02, duration: 0.5, ease: 'expo.out', delay: 0.15 });
    }
    requestAnimationFrame(() => input.current?.focus());
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  const pages = [
    { id: 'p-home', label: t('nav.home'), sub: t('palette.home_sub'), to: ROUTES.home },
    { id: 'p-projects', label: t('nav.projects'), sub: t('palette.projects_sub'), to: ROUTES.projects },
    { id: 'p-services', label: t('nav.services'), sub: t('services.palette_sub'), to: ROUTES.services },
    { id: 'p-team', label: t('nav.team'), sub: t('palette.team_sub'), to: ROUTES.team },
    { id: 'p-contact', label: t('nav.contact'), sub: t('palette.contact_sub'), to: ROUTES.contact },
  ].map((p) => ({ ...p, group: 'page' }));

  const items = useMemo(() => {
    const all = [
      ...pages,
      ...(projects ?? []).map((p) => ({ id: `pr-${p.slug}`, group: 'project', label: p.name, sub: p.tags?.join(' · '), to: ROUTES.project(p.slug) })),
      ...(members ?? []).map((m) => ({ id: `m-${m.slug}`, group: 'member', label: m.name, sub: m.role, to: ROUTES.member(m.slug) })),
      ...(settings?.email ? [{ id: 'copy-email', group: 'action', label: t('palette.copy_email'), sub: settings.email }] : []),
    ];
    const q = norm(query.trim());
    return q ? all.filter((i) => norm(i.label).includes(q) || norm(i.sub).includes(q)) : all;
  }, [query, projects, members, settings, t]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { setActive((i) => Math.min(i, Math.max(items.length - 1, 0))); }, [items.length]);
  useEffect(() => { list.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' }); }, [active]);

  const run = useCallback((item) => {
    if (!item) return;
    if (item.to) { closeSearch(); setTimeout(() => go(item.to), 150); return; }
    copy(settings.email).then(() => { setCopied(true); setTimeout(closeSearch, 1000); });
  }, [closeSearch, go, settings]);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); closeSearch(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(items[active]); }
    else if (e.key === 'Tab') e.preventDefault();
  };

  const groups = [['page', t('palette.group_pages')], ['project', t('palette.group_projects')], ['member', t('palette.group_members')], ['action', t('palette.group_actions')]]
    .map(([key, label]) => ({ key, label, rows: items.map((it, idx) => ({ ...it, idx })).filter((it) => it.group === key) }))
    .filter((g) => g.rows.length);

  if (!mounted) return null;
  const activeId = items[active] ? `${id}-${items[active].id}` : undefined;

  return (
    <div className="sr">
      <div ref={back} className="sr-back" onPointerDown={closeSearch} />
      <div ref={dialog} className="sr-dialog" role="dialog" aria-modal="true" aria-label={t('palette.title')} onKeyDown={onKeyDown}>
        <div className="sr-bar">
          <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><polygon points="8.5,2 15,8.5 8.5,15 2,8.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><line x1="13" y1="13" x2="18" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          <input
            ref={input} type="text" value={query} autoComplete="off" spellCheck={false}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            placeholder={t('palette.placeholder')}
            role="combobox" aria-expanded aria-controls={id} aria-activedescendant={activeId}
          />
          <kbd>Esc</kbd>
        </div>
        <div ref={list} id={id} role="listbox" aria-label={t('palette.results')} className="sr-list" data-lenis-prevent="">
          {groups.length === 0 && <p className="sr-empty">{t('palette.empty')} “{query}”</p>}
          {groups.map((g) => (
            <div key={g.key} role="group" aria-label={g.label}>
              <span className="t-label sr-group" aria-hidden="true">{g.label}</span>
              {g.rows.map((it) => (
                <button
                  key={it.id} id={`${id}-${it.id}`} data-idx={it.idx} data-sr-item="" role="option" tabIndex={-1}
                  aria-selected={it.idx === active} className="sr-item"
                  onPointerMove={() => setActive(it.idx)} onClick={() => run(it)}
                >
                  <i className="sr-dot" aria-hidden="true" />
                  <span className="sr-text">
                    <span className="sr-label">{it.id === 'copy-email' && copied ? t('palette.copied') : it.label}</span>
                    {it.sub && <span className="sr-sub">{it.sub}</span>}
                  </span>
                  {it.to && <span aria-hidden="true" className="sr-go">↗</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="sr-foot" aria-hidden="true">
          <span><kbd>↑↓</kbd> {t('palette.navigate')}</span>
          <span><kbd>↵</kbd> {t('palette.select')}</span>
          <span><kbd>Esc</kbd> {t('palette.close')}</span>
        </div>
      </div>
    </div>
  );
}
