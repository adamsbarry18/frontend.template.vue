<template>
  <div id="app" :data-lang="$i18n.locale">
    <main-header v-if="isAppReady" />
    <div class="app-wrapper">
      <main-nav />
      <div class="main-content">
        <template v-if="isAppReady">
          <router-view />
          <transition name="notification">
            <notification-panel v-show="notificationVisible" />
          </transition>
          <global-help-button />
        </template>
        <div
          ref="adBlockerDiv"
          class="ad-banner ad-button"
          style="display: block; padding: 0 !important"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { initializeDateLocale } from '@/libs/utils/Date';
  import { useUsersStore } from '@/stores/modules/users/user';
  import GlobalHelpButton from '@/modules/app/_components/GlobalHelpButton.vue';
  import MainNav from '@/modules/shared/menu/main-menu/MainNav.vue';
  import MainHeader from '@/modules/shared/menu/main-header/MainHeader.vue';
  import NotificationPanel from '@/modules/shared/notification/NotificationPanel.vue';
  import { useNotificationStore } from '@/modules/shared/notification/_store/notification';
  import { useRouter, useRoute } from 'vue-router';
  import i18n from '@/i18n';
  import { useNotification } from './composables/notfication';

  const { $message } = useNotification();

  const usersStore = useUsersStore();
  const notificationStore = useNotificationStore();
  const router = useRouter();
  const route = useRoute();

  const isAppReady = ref(false);
  const adBlockerDiv = ref<HTMLDivElement | null>(null);

  const isConnected = computed(() => usersStore.isConnected);
  const currentUser = computed(() => usersStore.currentUser); // Assuming currentUser is in the users store
  const notificationVisible = computed(
    () => notificationStore.persistentNotificationsVisible
  );
  const currentRoutePath = computed(() => route.path);

  const showMainMenu = computed(
    () => currentUser.value !== null && currentRoutePath.value !== '/login'
  );

  const checkAdBlocker = () => {
    setTimeout(() => {
      if (
        !(window as any).adblockerWhitelisted ||
        !adBlockerDiv.value ||
        adBlockerDiv.value.offsetParent === null
      ) {
        $message({
          customClass: 'orange-warning',
          type: 'warning',
          duration: 600000,
          message: i18n.global.t('adblocker.detected'),
        });
      }
    }, 10000);
  };

  const goToLogout = async () => {
    await usersStore.logout();
    router.push({ name: 'login' });
  };

  const relogin = async () => {
    await usersStore.relogin();
  };

  onMounted(async () => {
    isAppReady.value = false;
    // checkAdBlocker();

    const lang = localStorage.getItem('language');
    if (lang === 'en' || lang === 'fr') {
      initializeDateLocale(lang);
      i18n.global.locale.value = lang;
    }

    isAppReady.value = true;
  });
</script>

<style lang="scss">
  .notification-enter-active,
  .notification-leave-active {
    transition: transform 0.5s;
  }

  .notification-enter, .notification-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateX(300px);
  }

  body {
    margin: 0;
    padding: 0;

    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }

    & .el-loading-mask {
      z-index: 900;
      background-color: var(--color-neutral-100);
    }

    .el-loading-spinner .path {
      stroke: var(--color-primary-500);
    }

    /* Necessary for angular */
    .angular * {
      font-family: 'Roboto', sans-serif;
      font-size: var(--paragraph-03);
      line-height: inherit;
    }

    hr {
      border-top: 1px solid var(--color-neutral-300);
      border-bottom: none;
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
      // Both top and bottom stonly banners can be displayed simultaneously
      --stonly-banner-height: calc(
        var(
            --stonly-banner-top-sticky-margin,
            var(--stonly-banner-top-margin, 0px)
          ) +
          var(--stonly-banner-bottom-margin, 0px)
      );
      display: flex;
      flex-direction: column;
      background-color: var(--color-neutral-100);
      width: 100%;
      min-height: 100%;

      // AngularJs: bootstrap override el-theme
      .collapse {
        display: inherit;
      }

      .app-wrapper {
        display: flex;
        flex-direction: row;
        width: 100%;
        min-height: calc(
          100vh - var(--header-height) - var(--stonly-banner-height)
        );

        &.login {
          min-height: calc(100vh - var(--stonly-banner-height));
        }

        .main-content {
          display: flex;
          flex-direction: column;
          background-color: transparent;
          width: 100%;
          max-height: calc(
            100vh - var(--header-height) - var(--stonly-banner-height)
          );
          overflow-y: auto;

          &.login {
            max-height: calc(100vh - var(--stonly-banner-height));
          }
        }
      }
    }

    .orange-warning {
      background-color: var(--color-status-warning);

      .el-message__content {
        margin: auto;
        width: 85%;
        color: var(--color-white);
        font-weight: 500;
      }

      .el-message__closeBtn {
        color: var(--color-white);
      }

      .el-icon-warning {
        color: var(--color-white);
      }
    }
  }
</style>
