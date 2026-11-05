import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from './locales/pt.json';
import en from './locales/en.json';
import kri from './locales/kri.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt:  { translation: pt },
      en:  { translation: en },
      kri: { translation: kri },
    },
    lng: localStorage.getItem('badiu-lang') ?? 'pt',
    fallbackLng: 'pt',
    interpolation: { escapeValue: false },
  });

i18n.on('languageChanged', (lng) => localStorage.setItem('badiu-lang', lng));

export default i18n;
