import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enPayload from './locales/en.json';
import ruPayload from './locales/ru.json';

i18n
  .use(LanguageDetector) // Автодетекция: localStorage, navigator и т.д.
  .use(initReactI18next)
  .init({
    resources: {
      en: enPayload,
      ru: ruPayload,
    },
    fallbackLng: 'en', // Если язык не определен, будет английский
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'], // Порядок детекции
      caches: ['localStorage', 'cookie'], // Где сохранять выбор
      lookupQuerystring: 'lng',
    },
  });

export default i18n;
