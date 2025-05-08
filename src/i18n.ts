import { createI18n } from 'vue-i18n';

import isoLanguages from '@cospired/i18n-iso-languages';
import isoCountries from 'i18n-iso-countries';

import enLanguages from '@cospired/i18n-iso-languages/langs/en.json';
import frLanguages from '@cospired/i18n-iso-languages/langs/fr.json';

import enCountries from 'i18n-iso-countries/langs/en.json';
import frCountries from 'i18n-iso-countries/langs/fr.json';

import enLocale from './locales/en.json';
import frLocale from './locales/fr.json';

isoLanguages.registerLocale(enLanguages);
isoLanguages.registerLocale(frLanguages);

isoCountries.registerLocale(enCountries);
isoCountries.registerLocale(frCountries);

const dateTimeFormats = {
  en: {
    minuteHour: { hour: 'numeric', minute: 'numeric', hour12: false },
    minuteHourSecond: {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    },
    dayMonth: { day: 'numeric', month: 'short' },
    monthYear: { month: 'short', year: 'numeric' },
    longMonthYear: { month: 'long', year: 'numeric' },
    dayMonthYear: { year: 'numeric', month: 'long', day: 'numeric' },
    tiny: { month: 'numeric', day: 'numeric' },
    short: { year: 'numeric', month: 'numeric', day: 'numeric' },
    middle: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    },
  },
  fr: {
    minuteHour: { hour: 'numeric', minute: 'numeric', hour12: false },
    minuteHourSecond: {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    },
    dayMonth: { day: 'numeric', month: 'short' },
    monthYear: { month: 'short', year: 'numeric' },
    longMonthYear: { month: 'long', year: 'numeric' },
    dayMonthYear: { year: 'numeric', month: 'long', day: 'numeric' },
    tiny: { month: 'numeric', day: 'numeric' },
    short: { year: 'numeric', month: 'numeric', day: 'numeric' },
    middle: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    },
  },
} as const;

const numberFormatsI18n = {
  en: {
    currency: {
      style: 'currency',
    },
    longCurrency: {
      style: 'currency',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
    shortCurrency: {
      style: 'currency',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
    percent: {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    },
    longNumber: {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
    number: {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
  fr: {
    currency: {
      style: 'currency',
      currency: 'EUR',
    },
    longCurrency: {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
    shortCurrency: {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
    percent: {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    },
    longNumber: {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
    number: {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
};

const localLanguage =
  typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('language') : null;

const i18n: any = createI18n({
  legacy: false,
  locale: localLanguage !== null ? localLanguage.toLowerCase() : 'fr',
  fallbackLocale: localLanguage !== null ? localLanguage.toLowerCase() : 'en',
  globalInjection: true,
  warnHtmlMessage: false,
  messages: {
    en: enLocale,
    fr: frLocale,
  },
  datetimeFormats: dateTimeFormats,
  numberFormatsI18n,
});

export default i18n;

if (import.meta.hot) {
  import.meta.hot.accept('./locales/en.json', (updatedEnLocale) => {
    if (updatedEnLocale?.default) {
      i18n.global.mergeLocaleMessage('en', updatedEnLocale.default);
    }
  });
  import.meta.hot.accept('./locales/fr.json', (updatedFrLocale) => {
    if (updatedFrLocale?.default) {
      i18n.global.mergeLocaleMessage('fr', updatedFrLocale.default);
    }
  });
}
