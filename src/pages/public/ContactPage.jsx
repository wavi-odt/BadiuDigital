import { useTranslation } from 'react-i18next';
import Reveal from '@/components/PublicComponets/Reveal';
import RiseText from '@/components/PublicComponets/RiseText';
import Spotlight from '@/components/PublicComponets/Spotlight';
import ContactForm from '@/components/PublicComponets/ContactForm';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function ContactPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('nav.contact'));
  const { data: settings } = useSiteSettings();

  return (
    <Spotlight as="section" className="container-x flex flex-wrap gap-14 pb-32 pt-40">
      <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-7">
        <Reveal as="span" delay={0.7} className="eyebrow">{t('contact.eyebrow')}</Reveal>
        <h1 className="display-lg m-0"><RiseText text={t('contact.heading')} accent={[t('contact.heading').split(' ').at(-1)]} /></h1>
        <Reveal as="p" delay={1.1} className="m-0 max-w-[520px] text-xl leading-relaxed text-muted">
          {t('contact.description')}
        </Reveal>
        {settings?.email && (
          <Reveal delay={1.2}>
            <a href={`mailto:${settings.email}`} className="link-underline text-2xl font-bold">{settings.email}</a>
          </Reveal>
        )}
      </div>
      <Reveal delay={1.0} className="min-w-0 flex-[1.2_1_460px]">
        <ContactForm />
      </Reveal>
    </Spotlight>
  );
}
