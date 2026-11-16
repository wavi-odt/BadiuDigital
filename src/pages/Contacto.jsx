import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { contactService } from '@/services/contactService';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PageHero, Reveal } from '@/components/page';
import Magnetic from '@/components/Magnetic';

const EMPTY = { name: '', email: '', projectType: 'SITE', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Form({ memberSlug }) {
  const { t } = useTranslation();
  const [v, setV] = useState(EMPTY);
  const [err, setErr] = useState({});
  const [status, setStatus] = useState('idle');
  const [serverErr, setServerErr] = useState('');

  const types = [['SITE', 'type_site'], ['APP', 'type_app'], ['INFRA', 'type_infra'], ['OTHER', 'type_other']];
  const change = (e) => { const { name, value } = e.target; setV((s) => ({ ...s, [name]: value })); if (err[name]) setErr((s) => ({ ...s, [name]: undefined })); };

  const submit = async (e) => {
    e.preventDefault();
    const found = {};
    if (v.name.trim().length < 2) found.name = t('contact.error_name');
    if (!EMAIL_RE.test(v.email)) found.email = t('contact.error_email');
    if (v.message.trim().length < 10) found.message = t('contact.error_message');
    setErr(found);
    if (Object.keys(found).length) return;
    setStatus('sending'); setServerErr('');
    try { await contactService.send({ ...v, memberSlug: memberSlug ?? null }); setStatus('success'); setV(EMPTY); }
    catch (er) { setStatus('error'); setServerErr(er.message); }
  };

  if (status === 'success') {
    return (
      <div className="form-done" role="status">
        <h2 className="t-h1">{t('contact.success_heading')}</h2>
        <p className="phero-lead">{t('contact.success_body')}</p>
        <button type="button" className="button button-outline" onClick={() => setStatus('idle')}>{t('contact.send_another')}</button>
      </div>
    );
  }

  const field = (name, label, props = {}) => (
    <label className="ff">
      <span className="t-label">{label}</span>
      <input name={name} value={v[name]} onChange={change} aria-invalid={!!err[name]} aria-describedby={err[name] ? `${name}-e` : undefined} {...props} />
      {err[name] && <span id={`${name}-e`} className="ff-err">{err[name]}</span>}
    </label>
  );

  return (
    <form onSubmit={submit} noValidate className="form">
      <div className="form-2">
        {field('name', t('contact.field_name'), { autoComplete: 'name' })}
        {field('email', t('contact.field_email'), { type: 'email', autoComplete: 'email' })}
      </div>
      <label className="ff">
        <span className="t-label">{t('contact.field_type')}</span>
        <select name="projectType" value={v.projectType} onChange={change}>
          {types.map(([val, k]) => <option key={val} value={val}>{t(`contact.${k}`)}</option>)}
        </select>
      </label>
      <label className="ff">
        <span className="t-label">{t('contact.field_message')}</span>
        <textarea name="message" rows={6} value={v.message} onChange={change} aria-invalid={!!err.message} aria-describedby={err.message ? 'message-e' : undefined} />
        {err.message && <span id="message-e" className="ff-err">{err.message}</span>}
      </label>
      {status === 'error' && <p className="ff-err" role="alert">{serverErr}</p>}
      <Magnetic><button type="submit" className="button button-primary" disabled={status === 'sending'} data-cursor="go">{status === 'sending' ? t('contact.sending') : t('contact.send')}</button></Magnetic>
    </form>
  );
}

export default function Contacto() {
  const { t } = useTranslation();
  useDocumentTitle(t('nav.contact'));
  const { data: settings } = useSiteSettings();
  return (
    <>
      <PageHero label={t('contact.eyebrow')} title={t('contact.heading')} lead={t('contact.description')} />
      <section className="wrap contact">
        <Reveal className="contact-side">
          {settings?.email && <a href={`mailto:${settings.email}`} className="contact-mail" data-cursor="talk">{settings.email}</a>}
          <p className="t-small">{t('footer2.studio_place')}, {t('footer2.studio_country')}</p>
        </Reveal>
        <Reveal><Form /></Reveal>
      </section>
    </>
  );
}
