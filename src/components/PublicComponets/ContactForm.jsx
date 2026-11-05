import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { contactService } from '@/services/contactService';

const EMPTY = { name: '', email: '', projectType: 'SITE', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm({ memberSlug }) {
  const { t } = useTranslation();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');

  function validate(values) {
    const errors = {};
    if (values.name.trim().length < 2) errors.name = t('contact.error_name');
    if (!EMAIL_RE.test(values.email))  errors.email = t('contact.error_email');
    if (values.message.trim().length < 10) errors.message = t('contact.error_message');
    return errors;
  }

  const PROJECT_TYPES = [
    { value: 'SITE',  label: t('contact.type_site')  },
    { value: 'APP',   label: t('contact.type_app')   },
    { value: 'INFRA', label: t('contact.type_infra') },
    { value: 'OTHER', label: t('contact.type_other') },
  ];

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus('sending');
    setServerError('');
    try {
      await contactService.send({ ...values, memberSlug: memberSlug ?? null });
      setStatus('success');
      setValues(EMPTY);
    } catch (err) {
      setStatus('error');
      setServerError(err.message);
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-start gap-4 rounded-[32px] bg-petrol p-10" role="status">
        <span className="text-4xl font-extrabold tracking-[-0.04em]">{t('contact.success_heading')}</span>
        <p className="m-0 text-lg text-muted">{t('contact.success_body')}</p>
        <button type="button" className="btn btn--sand" onClick={() => setStatus('idle')}>{t('contact.send_another')}</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field">
          {t('contact.field_name')}
          <input name="name" value={values.name} onChange={onChange} autoComplete="name" aria-invalid={!!errors.name} />
          {errors.name && <span className="field__error">{errors.name}</span>}
        </label>
        <label className="field">
          {t('contact.field_email')}
          <input name="email" type="email" value={values.email} onChange={onChange} autoComplete="email" aria-invalid={!!errors.email} />
          {errors.email && <span className="field__error">{errors.email}</span>}
        </label>
      </div>
      <label className="field">
        {t('contact.field_type')}
        <select name="projectType" value={values.projectType} onChange={onChange}>
          {PROJECT_TYPES.map((tp) => <option key={tp.value} value={tp.value}>{tp.label}</option>)}
        </select>
      </label>
      <label className="field">
        {t('contact.field_message')}
        <textarea name="message" rows={6} value={values.message} onChange={onChange} aria-invalid={!!errors.message} />
        {errors.message && <span className="field__error">{errors.message}</span>}
      </label>
      {status === 'error' && <p className="field__error m-0" role="alert">{serverError}</p>}
      <button type="submit" className="btn btn--orange self-start" disabled={status === 'sending'}>
        {status === 'sending' ? t('contact.sending') : t('contact.send')}
      </button>
    </form>
  );
}
