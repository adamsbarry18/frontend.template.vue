<template>
  <div class="dashboard">
    <div class="dashboard-wrapper">
      <div class="welcome">
        <i18n-t keypath="dashboard.welcome.title" scope="global">
          <template #name>
            <b>{{ userName }}</b>
          </template>
        </i18n-t>
        <b class="space-name">{{ $t('dashboard.welcome.title-2') }}</b>
      </div>
    </div>
    <div class="right-column">
      <div
        v-if="errorNotifications.length > 0"
        class="warning-wrapper"
        @click.stop="onClickWarningWrapper"
      >
        <icon-base
          icon="icon-error"
          class="error-icon"
          color="var(--color-status-error)"
          :size="24"
        />
        <span v-html="$t('dashboard.error-count', errorNotifications.length)" />
      </div>
      <div v-else class="no-warnings-placeholder" />
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted } from 'vue';
  import { STATE, reactBus } from '@/plugins/reactBus';
  import { useNotificationStore } from '@/modules/shared/notification/_store/notification';
  import IconBase from '@/modules/common/icons/IconBase.vue';
  // Initialisation du store Pinia pour les notifications
  const notificationStore = useNotificationStore();

  // Propriétés calculées
  const userName = computed(() => {
    return 'Adams';
  });

  const errorNotifications = computed(
    () => notificationStore.getAllErrorNotifications
  );

  // Lifecycle hook
  onMounted(() => {
    reactBus.emit(STATE.TEST_NOTIFICATION);
  });

  // Méthodes
  const onClickWarningWrapper = () => {
    notificationStore.setPersistentNotificationsVisible(true);
  };
</script>

<style lang="scss" scoped>
  .dashboard {
    display: flex;
    overflow: auto;
    gap: 20px;
    padding: 32px;
    width: 100%;
    justify-content: center;

    .dashboard-wrapper {
      display: flex;
      flex-direction: column;
      height: max-content;
      gap: 20px;
      width: 100%;
      max-width: 1300px;
      min-width: 500px;

      .welcome {
        display: flex;
        align-items: center;
        gap: 8px;

        & > span,
        b {
          font-size: var(--heading-03);
        }

        .space-name {
          color: var(--color-primary-500);
        }
      }
    }
  }

  .right-column {
    display: flex;
    position: sticky;
    top: 0;
    flex-shrink: 0;
    flex-direction: column;
    width: 300px;

    .warning-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin: 0 0 13px 0;
      border: 1px solid var(--color-status-error);
      border-radius: 4px;
      background-color: var(--color-background-white);
      cursor: pointer;
      padding: 8px 12px;

      .error-icon {
        margin-right: 4px;
      }
    }

    .no-warnings-placeholder {
      margin: 0 0 7px 0;
      height: 48px;
      flex-shrink: 0;
    }
  }
</style>
