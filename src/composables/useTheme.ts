import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { storageService } from '@/libs/utils/StorageService';
import type { Theme } from '@/types/Theme';
import { useUsersStore } from '@/stores/modules/users/user';

const internalCurrentThemePref = ref<Theme>(
  (storageService.getItem('theme') as Theme) || 'system'
);

let systemThemeChangeHandler:
  | ((this: MediaQueryList, ev: MediaQueryListEvent) => any)
  | null = null;
let mediaQueryList: MediaQueryList | null = null;

function applyThemeToDOM(theme: Theme): void {
  const root = document.documentElement;
  let effectiveTheme: 'light' | 'dark';

  if (theme === 'system') {
    effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } else {
    effectiveTheme = theme;
  }

  root.classList.remove('light-theme', 'dark-theme');
  if (effectiveTheme === 'dark') {
    root.classList.add('dark-theme');
  } else {
    root.classList.add('light-theme');
  }
}

function updateSystemThemeListener(themePref: Theme): void {
  if (mediaQueryList && systemThemeChangeHandler) {
    mediaQueryList.removeEventListener('change', systemThemeChangeHandler);
    systemThemeChangeHandler = null;
    mediaQueryList = null;
  }

  if (themePref === 'system') {
    mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeChangeHandler = () => {
      applyThemeToDOM('system');
    };
    mediaQueryList.addEventListener('change', systemThemeChangeHandler);
  }
}

function applyManagedTheme(themePref: Theme): void {
  internalCurrentThemePref.value = themePref;
  applyThemeToDOM(themePref);
  updateSystemThemeListener(themePref);
}

export function useTheme() {
  const usersStore = useUsersStore();

  const userThemePreference = computed(() => {
    return (usersStore.currentUser?.preferences?.theme as Theme) || 'system';
  });

  watch(
    userThemePreference,
    (newPref, oldPref) => {
      if (newPref !== oldPref && newPref !== internalCurrentThemePref.value) {
        storageService.setItem('theme', newPref);
        applyManagedTheme(newPref);
      }
    },
    { immediate: false }
  );

  onMounted(() => {
    const storePref = userThemePreference.value;
    const initialPref = storePref;
    storageService.setItem('theme', initialPref);
    applyManagedTheme(initialPref);
  });
  onUnmounted(() => {
    if (mediaQueryList && systemThemeChangeHandler) {
      mediaQueryList.removeEventListener('change', systemThemeChangeHandler);
    }
  });

  return {
    currentTheme: internalCurrentThemePref,
  };
}
