import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../../public/locales/en.json';
import zh from '../../public/locales/zh.json';

i18next
    .use(LanguageDetector)
    .init({
        lng: 'zh',
        debug: true,
        resources: {
            en: { translation: en },
            zh: { translation: zh },
        },
        fallbackLng: 'zh',
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage', 'cookie'],
        },
    });

export default i18next;