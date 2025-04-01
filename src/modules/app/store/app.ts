// /stores/appStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { I18n } from 'vue-i18n';

export const useAppStore = defineStore('app', () => {
  const i18n = ref<I18n | null>(null);
  const userStorage = ref<Storage | null>(null);
  // Ajoutez ici d'autres variables globales réactives si nécessaire

  function setI18n(i18n: I18n) {
    i18n = i18n;
  }
  function setUserStorage(storage: Storage) {
    userStorage.value = storage;
  }

  return {
    i18n,
    userStorage,
    setI18n,
    setUserStorage,
  };
});
