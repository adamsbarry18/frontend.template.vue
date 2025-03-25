<template>
  <div class="app">
    <router-view />
    <transition name="notification">
      <notification-panel v-show="notificationVisible" />
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import NotificationPanel from './modules/shared/skeleton/notification/NotificationPanel.vue';
  import { useNotificationStore } from './modules/shared/skeleton/notification/_store/notification';
  import { STATE, reactBus } from './plugins/reactBus';

  const notificationStore = useNotificationStore();

  const notificationVisible = computed(() => {
    return notificationStore.getPersistentNotificationsVisible;
  });

  onMounted(async () => {
    await reactBus.emit(STATE.TEST_NOTIFICATION);
  });
</script>

<style lang="scss">
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
