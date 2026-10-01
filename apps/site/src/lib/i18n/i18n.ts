import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frCommon from '@/lib/i18n/locales/fr/common.json';

export const supportedLanguages = ['fr', 'en-US'] as const;

export const defaultLanguage = 'fr';

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: { fr: { common: frCommon } },
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    supportedLngs: supportedLanguages,
    defaultNS: 'common',
    ns: ['common'],
    initAsync: false,
    showSupportNotice: false,
    interpolation: { escapeValue: false },
  });
}

export const registerNamespace = (namespace: string, resources: object) => {
  if (!i18n.hasResourceBundle(defaultLanguage, namespace)) {
    i18n.addResourceBundle(defaultLanguage, namespace, resources, true, true);
  }
};

export default i18n;
