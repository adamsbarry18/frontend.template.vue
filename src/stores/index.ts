import { createPinia, Pinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// Création de l'instance Pinia
export const pinia: Pinia = createPinia();

// Map pour stocker les stores
export const stores: Map<string, any> = new Map();

// Utilisation du plugin de persistance
pinia.use(piniaPluginPersistedstate);

// Plugin pour initialiser les stores
pinia.use(({ store }) => {
  if (stores.has(store.$id)) {
    return;
  }

  stores.set(store.$id, store);

  if (typeof store.init === 'function') {
    store.init();
  }
});
