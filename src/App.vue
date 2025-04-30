<template>
  <div id="app" :data-lang="$i18n.locale">
    <div v-if="!authCheckCompleted" class="initial-loading">
      <u-loader center size="50px" />
    </div>
    <template v-else>
      <main-header v-if="isAuthenticated" />
      <div class="app-wrapper" :class="{ login: !isAuthenticated }">
        <main-nav v-if="isAuthenticated" />
        <div class="main-content" :class="{ login: !isAuthenticated }">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
          <transition name="notification">
            <notification-panel v-show="notificationVisible" />
          </transition>
          <global-help-button v-if="isAuthenticated" />
          <div
            ref="adBlockerDiv"
            class="ad-banner ad-button"
            style="
              display: block;
              padding: 0 !important;
              height: 1px;
              width: 1px;
              opacity: 0;n 
            "
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watchEffect, onUnmounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import i18n from '@/i18n';
  import { initializeDateLocale } from '@/libs/utils/Date';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { useNotificationStore } from '@/modules/shared/notification/_store/notification';
  import { useNotification } from './composables/notfication';
  import { storageService } from '@/libs/utils/StorageService';
  import ULoader from '@/modules/common/others/ULoader.vue';
  import type { Theme } from '@/types/Theme';

  // Import des composants UI (gardés de l'original, ajustez si nécessaire)
  import MainHeader from '@/modules/shared/menu/main-header/MainHeader.vue';
  import MainNav from '@/modules/shared/menu/main-menu/MainNav.vue';
  import NotificationPanel from '@/modules/shared/notification/NotificationPanel.vue';
  import GlobalHelpButton from '@/modules/app/_components/GlobalHelpButton.vue';

  const { $message } = useNotification();
  const usersStore = useUsersStore();
  const notificationStore = useNotificationStore();
  const router = useRouter();
  const route = useRoute();

  const adBlockerDiv = ref<HTMLDivElement | null>(null);

  const authCheckCompleted = computed(() => usersStore.authStatusChecked);
  const isAuthenticated = computed(() => usersStore.isAuthenticated);
  const notificationVisible = computed(
    () => notificationStore.persistentNotificationsVisible
  );

  const PUBLIC_ROUTES = [
    'login',
    'password-forgot',
    'password-reset',
    'send-email',
  ];

  // --- Theme Logic ---
  let systemThemeChangeHandler:
    | ((this: MediaQueryList, ev: MediaQueryListEvent) => any)
    | null = null;
  let mediaQueryList: MediaQueryList | null = null;

  function applyTheme(theme: Theme): void {
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
      `Applying theme preference: ${theme}, Effective theme: ${effectiveTheme}`
    );

    root.classList.remove('light-theme', 'dark-theme');
    if (effectiveTheme === 'dark') {
      root.classList.add('dark-theme');
    } else {
      root.classList.add('light-theme');
    }
    updateSystemThemeListener(theme);
  }

  function updateSystemThemeListener(currentThemePref: Theme): void {
    if (mediaQueryList && systemThemeChangeHandler) {
      mediaQueryList.removeEventListener('change', systemThemeChangeHandler);
      systemThemeChangeHandler = null;
      mediaQueryList = null;
    }

    if (currentThemePref === 'system') {
      mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
      systemThemeChangeHandler = () => {
        console.log('System color scheme changed, reapplying theme...');
        applyTheme('system');
      };
      mediaQueryList.addEventListener('change', systemThemeChangeHandler);
    }
  }

  function initializeTheme(): void {
    const preferredTheme = storageService.getItem('theme') || 'system';
    console.log(`Initializing theme. Preferred: ${preferredTheme}`);
    applyTheme(preferredTheme as Theme);
  }

  // Handler pour l'événement personnalisé
  function handleApplyThemeEvent(event: Event) {
    const customEvent = event as CustomEvent<Theme>;
    if (customEvent.detail) {
      applyTheme(customEvent.detail);
    }
  }

  // --- Watchers ---
  watchEffect(() => {
    if (!authCheckCompleted.value) {
      return;
    }

    const currentRouteName = typeof route.name === 'string' ? route.name : '';
    const isPublicRoute = PUBLIC_ROUTES.includes(currentRouteName);

    console.log(
      `Auth Check Completed: ${authCheckCompleted.value}, Is Authenticated: ${isAuthenticated.value}, Current Route: ${route.path}, Is Public: ${isPublicRoute}`
    );

    if (!isAuthenticated.value && !isPublicRoute) {
      console.log('Redirecting to login...');
      router.push({ name: 'login', query: { redirect: route.fullPath } });
    } else if (isAuthenticated.value && currentRouteName === 'login') {
      console.log('Redirecting to dashboard...');
      router.push({ name: 'dashboard' });
    }
  });

  const checkAdBlocker = () => {
    setTimeout(() => {
      if (
        adBlockerDiv.value?.offsetParent === null ||
        adBlockerDiv.value?.offsetHeight === 0 ||
        getComputedStyle(adBlockerDiv.value).display === 'none'
      ) {
        console.warn('AdBlocker detected!');
        $message({
          customClass: 'orange-warning',
          type: 'warning',
          duration: 0,
          showClose: true,
          message: i18n.global.t('adblocker.detected'),
        });
      } else {
        console.log('No AdBlocker detected.');
      }
      if (adBlockerDiv.value) {
        adBlockerDiv.value.style.display = 'none';
      }
    }, 2000);
  };
  onMounted(async () => {
    console.log('App.vue onMounted: Initializing...');
    const storedLang = storageService.getLanguage();
    const defaultLang = 'fr';
    const langToUse: 'en' | 'fr' =
      storedLang === 'en' || storedLang === 'fr' ? storedLang : defaultLang;

    initializeDateLocale(langToUse);
    i18n.global.locale.value = langToUse;
    console.log(`Language set to: ${langToUse}`);

    checkAdBlocker();

    initializeTheme();

    console.log(
      'App.vue onMounted: Initialization complete (Auth check deferred to router).'
    );

    // Écouter les changements de thème demandés par d'autres composants
    window.addEventListener('apply-theme', handleApplyThemeEvent);
  });

  // Nettoyer les écouteurs lors du démontage
  onUnmounted(() => {
    if (mediaQueryList && systemThemeChangeHandler) {
      mediaQueryList.removeEventListener('change', systemThemeChangeHandler);
    }
    window.removeEventListener('apply-theme', handleApplyThemeEvent);
  });
</script>

<style lang="scss">
  .notification-enter-active,
  .notification-leave-active {
    transition: transform 0.5s ease;
  }

  .notification-enter-from,
  .notification-leave-to {
    transform: translateX(100%);
  }

  .initial-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    background-color: var(--color-neutral-100);
    font-size: var(--paragraph-01);
    color: var(--color-text-primary);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: var(--color-neutral-100);
    min-height: 100vh;

    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }

    & .el-loading-mask {
      z-index: 900;
      background-color: rgba(255, 255, 255, 0.8);
    }

    .el-loading-spinner .path {
      stroke: var(--color-primary-500);
    }

    hr {
      border: none;
      border-top: 1px solid var(--color-neutral-300);
      margin: 1rem 0;
    }

    &.konami-code {
      background-color: black;

      @keyframes konami {
        0% {
          transform: scale(1) rotate(0deg);
        }
        100% {
          transform: scale(0) rotate(720deg);
        }
      }

      #app {
        transform-origin: center center;
        animation: konami 3s ease-in-out;
        animation-fill-mode: forwards;
      }
    }

    #app {
      --header-height: 60px;
      --stonly-banner-height: calc(
        var(
            --stonly-banner-top-sticky-margin,
            var(--stonly-banner-top-margin, 0px)
          ) +
          var(--stonly-banner-bottom-margin, 0px)
      );
      display: flex;
      flex-direction: column;
      width: 100%;
      min-height: 100vh;

      .app-wrapper {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        width: 100%;

        .main-content {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          background-color: var(--color-neutral-100);
          overflow-y: auto;
          position: relative;
        }
      }
    }

    .orange-warning {
      background-color: var(--color-status-warning);
      color: var(--color-white);
      z-index: 1000;

      .el-message__content {
        color: var(--color-white);
        font-weight: 500;
      }

      .el-message__closeBtn {
        color: var(--color-white);
        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }

      .el-icon-warning {
        color: var(--color-white);
      }
    }
  }
</style>
