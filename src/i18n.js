import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "Welcome": "Welcome to GraceLight Church",
            "Sermons": "Sermons",
            "Giving": "Giving",
            "Events": "Events",
            "Login": "Login",
            "Signup": "Sign Up",
            "Dashboard": "Dashboard"
        }
    },
    am: {
        translation: {
            "Welcome": "እንኳን ወደ ግሬስ ላይት ቤተክርስቲያን በደህና መጡ",
            "Sermons": "ስብከቶች",
            "Giving": "ስጦታ",
            "Events": "ዝግጅቶች",
            "Login": "ግባ",
            "Signup": "ተመዝገብ",
            "Dashboard": "ዳሽቦርድ"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
