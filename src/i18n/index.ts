import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './en';
import { hi } from './hi';
import {
  applyDocumentLang,
  getInitialLocale,
  type Locale,
} from './locale';

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: getInitialLocale(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export function applyLocale(locale: Locale): Promise<unknown> {
  applyDocumentLang(locale);
  return i18n.changeLanguage(locale);
}

export { i18n };
