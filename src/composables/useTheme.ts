import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { storageService } from '@/libs/utils/StorageService';
import type { Theme } from '@/types/Theme';
import { useUsersStore } from '@/stores/modules/users/user';

// Reactive reference for the current theme preference *managed by this composable*
// Initialized from localStorage, then driven by the user store.
const internalCurrentThemePref = ref<Theme>(
  (storageService.getItem('theme') as Theme) || 'system'
);

// Variables to manage the system theme listener
let systemThemeChangeHandler:
  | ((this: MediaQueryList, ev: MediaQueryListEvent) => any)
  | null = null;
let mediaQueryList: MediaQueryList | null = null;

/**
 * Applies the effective theme (light or dark) to the root HTML element.
 * @param theme The theme preference ('light', 'dark', or 'system').
 */
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

  console.log(
    `[useTheme] Applying theme preference: ${theme}, Effective theme: ${effectiveTheme}`
  );

  root.classList.remove('light-theme', 'dark-theme');
  if (effectiveTheme === 'dark') {
    root.classList.add('dark-theme');
  } else {
    root.classList.add('light-theme');
  }
}

/**
 * Updates (adds or removes) the listener for system theme changes.
 * @param themePref The current theme preference.
 */
function updateSystemThemeListener(themePref: Theme): void {
  // Clean up the old listener if it exists
  if (mediaQueryList && systemThemeChangeHandler) {
    mediaQueryList.removeEventListener('change', systemThemeChangeHandler);
    systemThemeChangeHandler = null;
    mediaQueryList = null;
    console.log('[useTheme] Removed system theme change listener.');
  }

  // Add a new listener if the theme is 'system'
  if (themePref === 'system') {
    mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeChangeHandler = () => {
      console.log(
        '[useTheme] System color scheme changed, reapplying theme...'
      );
      applyThemeToDOM('system'); // Reapply based on the new system preference
    };
    mediaQueryList.addEventListener('change', systemThemeChangeHandler);
    console.log('[useTheme] Added system theme change listener.');
  }
}

// This function now primarily applies the theme based on the internal ref
// It's called internally when the store preference changes or system theme changes.
function applyManagedTheme(themePref: Theme): void {
  console.log(`[useTheme] Applying managed theme: ${themePref}`);
  internalCurrentThemePref.value = themePref; // Update internal state
  applyThemeToDOM(themePref); // Apply to DOM
  updateSystemThemeListener(themePref); // Update system listener
}

/**
 * Composable for managing the application theme.
 */
export function useTheme() {
  const usersStore = useUsersStore();

  // Computed property reflecting the theme preference from the user store
  const userThemePreference = computed(() => {
    // Ensure currentUser and preferences exist before accessing theme
    return (usersStore.currentUser?.preferences?.theme as Theme) || 'system';
  });

  // Watch for changes in the user's preference from the store
  watch(
    userThemePreference,
    (newPref, oldPref) => {
      // Only apply if the preference actually changed and differs from the internally managed state
      if (newPref !== oldPref && newPref !== internalCurrentThemePref.value) {
        console.log(`[useTheme] User theme preference changed to: ${newPref}`);
        storageService.setItem('theme', newPref); // Ensure localStorage is synced
        applyManagedTheme(newPref);
      }
    },
    { immediate: false } // Don't run immediately, initial application is handled in onMounted
  );

  // Initialize the theme when the composable is mounted (typically in App.vue)
  // Use the preference from the store if available, otherwise fallback to localStorage/system
  onMounted(() => {
    console.log('[useTheme] Initializing theme on mount...');
    // Prioritize store preference if user is already logged in and it differs from localStorage
    const storePref = userThemePreference.value;
    const initialPref = storePref; // Start with store preference
    console.log(
      `[useTheme] Initial theme preference from store/default: ${initialPref}`
    );
    storageService.setItem('theme', initialPref); // Sync localStorage on init
    applyManagedTheme(initialPref);
  });

  // Clean up the system listener on unmount
  onUnmounted(() => {
    if (mediaQueryList && systemThemeChangeHandler) {
      mediaQueryList.removeEventListener('change', systemThemeChangeHandler);
      console.log('[useTheme] Cleaned up system theme listener on unmount.');
    }
  });

  // Return the reactive ref for the current theme preference managed by the composable
  // Note: setTheme is no longer needed externally as changes are driven by the store
  return {
    currentTheme: internalCurrentThemePref,
  };
}
