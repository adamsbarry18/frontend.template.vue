import i18n from '@/i18n';
import { initializeDateLocale } from './Date';

interface TranslateProvider {
  use: (lang: any) => void;
}

interface App {
  $translateProvider?: TranslateProvider;
}

declare global {
  interface Window {
    app?: App;
  }
}

export function updateActiveLanguage(
  lang: any,
  forceReload: boolean = false
): void {
  localStorage.setItem('language', lang);
  i18n.global.locale = lang;
  initializeDateLocale(lang);

  if (window.app?.$translateProvider) {
    window.app.$translateProvider.use(lang);
  }

  if (forceReload) {
    location.reload();
  }
}
