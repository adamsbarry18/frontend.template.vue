import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export type DisplayIcon = 'icon-notif-active';

export interface NotificationItem {
  id: string;
  template: string;
  context: any;
  partitionId: string;
  icon: string;
  isError: boolean;
  created_time: Date;
}

export const useNotificationStore = defineStore('notification', () => {
  // État
  const persistentNotifications = ref<NotificationItem[]>([]);
  const persistentNotificationsVisible = ref(false);

  const currentPartitionId = 'dummy-partition'; // Remplacez par la valeur réelle

  const getAll = computed(() =>
    persistentNotifications.value.filter(
      (notif) => notif.partitionId === currentPartitionId
    )
  );

  const getAllErrorNotifications = computed(() =>
    getAll.value.filter((notif) => notif.isError)
  );

  const getPersistentNotificationsVisible = computed(
    () => persistentNotificationsVisible.value
  );

  // Actions
  function addPersistentNotification({
    template,
    context,
    partitionId,
    icon = 'icon-notif-active',
    isError = false,
  }: {
    template: string;
    context: any;
    partitionId: string;
    icon?: string;
    isError?: boolean;
  }): void {
    const id = uuidv4().substring(0, 8);
    persistentNotifications.value.push({
      id,
      template,
      context,
      partitionId,
      icon,
      isError,
      created_time: new Date(),
    });
  }

  function removeItem({ id }: { id: string }): void {
    persistentNotifications.value = persistentNotifications.value.filter(
      (item) => item.id !== id
    );
  }

  function togglePersistentNotificationsVisible(): void {
    persistentNotificationsVisible.value =
      !persistentNotificationsVisible.value;
  }

  function setPersistentNotificationsVisible(isVisible: boolean): void {
    persistentNotificationsVisible.value = isVisible;
  }

  function clean(): void {
    persistentNotifications.value = [];
    persistentNotificationsVisible.value = false;
  }

  return {
    persistentNotifications,
    persistentNotificationsVisible,
    // Getters
    getAll,
    getAllErrorNotifications,
    getPersistentNotificationsVisible,
    // Actions
    addPersistentNotification,
    removeItem,
    togglePersistentNotificationsVisible,
    setPersistentNotificationsVisible,
    clean,
  };
});
