import { useTranslation } from 'react-i18next';
import TransitionLink from './TransitionLink';
import { ROUTES } from '@/constants/routes';

export default function ErrorState({ error, onRetry }) {
  const { t } = useTranslation();
  const notFound = error?.status === 404;
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-start justify-center gap-6 py-24">
      <span className="eyebrow">{notFound ? '404' : t('error.label')}</span>
      <h1 className="display-md m-0">{notFound ? t('error.not_found') : t('error.generic')}</h1>
      <p className="m-0 max-w-xl text-lg text-muted">{error?.message}</p>
      <div className="flex flex-wrap gap-3">
        {!notFound && onRetry && (
          <button type="button" className="btn btn--orange" onClick={onRetry}>{t('error.retry')}</button>
        )}
        <TransitionLink to={ROUTES.home} className="btn btn--petrol">{t('error.back_home')}</TransitionLink>
      </div>
    </div>
  );
}
