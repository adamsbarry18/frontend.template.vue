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
  import IconBase from '@/modules/ui/icons/IconBase.vue';
  import { useNotificationStore } from '@/modules/shared/notification/_store/notification';

  const notificationStore = useNotificationStore();

  const bell = ref<InstanceType<typeof IconBase> | null>(null);

  const notifications = computed(() => notificationStore.getAll);

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
