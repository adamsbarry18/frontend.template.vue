<template>
  <div
    class="main-header__notifications -button-like"
    :class="{ 'circle-bell': notifications.length > 0 }"
    @click="handleClick"
  >
    <icon-base
      ref="bell"
      :icon="notifications.length > 0 ? 'icon-notif-active' : 'icon-notif-default'"
      color="var(--color-neutral-700)"
      size="35"
      class="animate__animated"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { IconBase } from '@/modules/ui';
  import { useNotificationStore } from '@/modules/shared/notification/_store/notification';

  // Accès au store Pinia
  const notificationStore = useNotificationStore();

  // Référence au composant IconBase pour manipuler le DOM
  const bell = ref<InstanceType<typeof IconBase> | null>(null);

  // Propriété calculée pour les notifications
  const notifications = computed(() => notificationStore.getAll);

  // Surveillance des notifications pour animer la cloche
  watch(
    notifications,
    (newVal) => {
      if (newVal && newVal.length > 0 && bell.value) {
        const bellEl = bell.value.$el as HTMLElement;
        bellEl.classList.add('animate__swing');
        setTimeout(() => {
          bellEl.classList.remove('animate__swing');
        }, 500);
      }
    },
    { immediate: true }
  );

  // Gestion du clic
  const handleClick = (event: Event) => {
    notificationStore.togglePersistentNotificationsVisible();
    event.stopPropagation();
  };
</script>

<style scoped lang="scss">
  .main-header__notifications {
    display: flex;
    position: relative;
    &.circle-bell:after {
      display: block;
      position: absolute;
      top: 25%;
      right: 20%;
      border-radius: 50%;
      background: var(--color-red-500);
      width: 9px;
      height: 9px;
      content: '';
    }
  }
</style>
