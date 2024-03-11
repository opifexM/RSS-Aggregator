import i18next from 'i18next';
import enTranslations from '../locales/en.js';
import ruTranslations from '../locales/ru.js';

const initializeI18next = () => {
  const i18nInstance = i18next.createInstance();

  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      en: enTranslations,
      ru: ruTranslations,
    },
  });

  return i18nInstance;
};

const i18nInstance = initializeI18next();
export default i18nInstance;
