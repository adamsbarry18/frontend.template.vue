<template>
  <div class="dashboard">
    <div class="dashboard-wrapper">
      <div class="welcome" v-if="userName">
        <i18n-t keypath="dashboard.welcome.title" tag="span" scope="global">
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
        data-cy="dashboard-warnings"
      >
        <icon-base
          icon="icon-error"
          class="error-icon"
          color="var(--color-status-error)"
          :size="24"
        />
        <span
          v-html="
            $t('dashboard.error-count', { count: errorNotifications.length })
          "
        />
      </div>
      <div v-else class="no-warnings-placeholder" />
      <!-- Autres éléments de la colonne droite -->
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useNotificationStore } from '@/modules/shared/notification/_store/notification';
  import { useUsersStore } from '@/stores/modules/users/user';
  import { IconBase } from '@/modules/common';
  const notificationStore = useNotificationStore();
  const usersStore = useUsersStore();
  const userName = computed(() => {
    return usersStore.currentUser?.name ?? '';
  });

  const errorNotifications = computed(
    () => notificationStore.getAllErrorNotifications
  );

  // --- Methods ---
  const onClickWarningWrapper = () => {
    notificationStore.setPersistentNotificationsVisible(true);
  };

  // --- Lifecycle Hooks ---
  // onMounted n'est plus nécessaire pour la logique retirée
  // onMounted(() => {
  //   // reactBus.emit(STATE.TEST_NOTIFICATION); // Logique retirée
  // });
</script>

<style lang="scss" scoped>
  .dashboard {
    display: flex;
    overflow: auto;
    gap: 20px;
    padding: 32px;
    width: 100%;

    .dashboard-wrapper {
      display: flex;
      flex-direction: column;
      height: max-content;
      gap: 20px;
      flex-grow: 1;
      max-width: 1300px;
      min-width: 500px;
      margin: 0 auto;

      .welcome {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5em;

        & > span,
        b {
          font-size: var(--heading-03);
          line-height: 1.2;
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
    top: 20px;
    align-self: flex-start;
    flex-shrink: 0;
    flex-direction: column;
    width: 300px;
    gap: 10px;

    .warning-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border: 1px solid var(--color-status-error);
      border-radius: 4px;
      background-color: var(--color-background-white);
      cursor: pointer;
      padding: 8px 12px;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: var(--color-neutral-100);
      }

      .error-icon {
        margin-right: 8px;
        flex-shrink: 0;
      }

      span {
        font-size: var(--paragraph-03);
        color: var(--color-text-secondary);
      }
    }

    .no-warnings-placeholder {
      height: 42px;
      flex-shrink: 0;
    }
  }
</style>
