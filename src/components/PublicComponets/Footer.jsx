import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function Footer() {
  const { data: settings } = useSiteSettings();
  const socials = settings?.socials ?? {};
  const links = [
    ['Instagram', socials.instagram],
    ['LinkedIn', socials.linkedin],
    ['GitHub', socials.github],
  ].filter(([, url]) => url);

  return (
    <footer className="site-footer bg-ink">
      <div className="container-x flex flex-wrap items-center justify-between gap-3 border-t border-line py-8 text-[15px] text-muted-2">
        <span>© {new Date().getFullYear()} Badiu Digital</span>
        <div className="flex flex-wrap gap-4">
          {links.map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noreferrer" className="link-underline py-2">{label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
