// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend) // To load translations from the backend
  .use(LanguageDetector) // To detect user language
  .use(initReactI18next) // Connect with React
  .init({
    lng:'en',
    fallbackLng: 'en', // Default language if none is detected
    debug: true, // Enable debug mode to troubleshoot issues
    interpolation: {
      escapeValue: false // React already does escaping
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path to translation files
    },
  });

export default i18n;

