import i18next, { type ParseKeys } from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from './locales/en-US.json';

export type TranslationKey = ParseKeys;

export const DEFAULT_LOCALE = 'en-US';

i18next.use(initReactI18next).init({
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  resources: { [DEFAULT_LOCALE]: { translation: enUS } },
  interpolation: { escapeValue: false },
});

export default i18next;
