/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// vue-i18n
import 'vue-i18n';

declare module 'vue-i18n' {
  export interface ComposerCustom {
    // Vous pouvez ajouter ici des types personnalisés pour votre i18n si nécessaire
  }
}

declare module '@vue/runtime-core' {
  import type { I18n, VueI18n } from 'vue-i18n';

  interface ComponentCustomProperties {
    $i18n: I18n<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, string, false>; // Ajustez selon votre configuration i18n (legacy ou pas)
    $t: VueI18n['global']['t'];
    $d: VueI18n['global']['d'];
    $n: VueI18n['global']['n'];
    $te: VueI18n['global']['te'];
    // Si vous utilisez le mode legacy, vous pourriez avoir besoin de :
    // $i18n: VueI18n
    // $t: (...args: Parameters<VueI18n['t']>) => string
    // $tc: (...args: Parameters<VueI18n['tc']>) => string
    // $te: (...args: Parameters<VueI18n['te']>) => boolean
    // $d: (...args: Parameters<VueI18n['d']>) => string
    // $n: (...args: Parameters<VueI18n['n']>) => string
  }
}
