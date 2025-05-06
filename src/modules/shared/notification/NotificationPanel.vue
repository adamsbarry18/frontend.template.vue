<template>
  <div class="notification-panel" @click.stop>
    <div class="header">
      <h3>Notifications</h3>
      <div @click="handleArrowClick">
        <icon-base
          icon="icon-arrow-back"
          color="var(--color-neutral-800)"
          class="icon-arrow-back"
          size="28"
        />
      </div>
    </div>
    <div class="content">
      <template v-if="notificationsGroups && notificationsGroups.length > 0">
        <u-shortcut-subscriber @shortcut-trigger="handleArrowClick" />
        <div class="clear-all-button -button-like" @click="onClearAll">
          <span class="notification-success">
            <icon-base icon="icon-delete" :size="20" color="var(--color-neutral-800)" />
            Supprimer toutes les notifications
          </span>
        </div>
        <div v-for="group in notificationsGroups" :key="group.dateLabel" class="notification-group">
          <p>{{ group.dateLabel }}</p>
          <transition-group name="component-fade">
            <u-dismissable
              v-for="notification in group.notifications.slice().reverse()"
              :key="notification.id"
              class="notification"
              :icon="notification.icon ? notification.icon : 'icon-notif-active'"
              :type="notification.isError ? 'error' : 'default'"
              @close="onClose(notification.id)"
            >
              <component :is="renderCompile(notification)" />
            </u-dismissable>
          </transition-group>
        </div>
      </template>
      <div v-else key="empty-wrapper" class="empty-wrapper">
        <img src="@/assets/images/svg/empty_notif.svg" alt="empty_notif" />
        <span>Aucune notification</span>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted, markRaw } from 'vue';
  import { useNotificationStore } from './_store/notification';
  import { reactBus, STATE } from '@/plugins/reactBus';
  import { compile } from 'vue/dist/vue.esm-bundler.js';
  import dayjs from 'dayjs';
  import { IconBase, UDismissable, UShortcutSubscriber } from '@/modules/ui';
  import i18n from '@/i18n';
  import NotificationConnection from '@/modules/users/_components/NotificationConnection.vue';
  import { useNotification } from '@/composables/notfication';

  // composables
  const { $notification } = useNotification();

  // Stores Pinia
  const notificationStore = useNotificationStore();

  // Reactive state
  const notifications = ref(notificationStore.getAll);
  const isNotificationPanelVisible = ref(notificationStore.getPersistentNotificationsVisible);

  // Computed properties
  const notificationsGroups = computed(() => {
    const res = [];
    for (const notification of notifications.value) {
      const date = notification.created_time ? new Date(notification.created_time) : new Date(0);
      let dateLabel = i18n.global.d(date, 'dayMonthYear');
      if (dayjs(date).isSame(dayjs(), 'day')) {
        dateLabel = i18n.global.t('target.date.today');
      } else if (dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day')) {
        dateLabel = i18n.global.t('target.date.yesterday');
      }
      let group = res.find((g) => g.dateLabel === dateLabel);
      if (!group) {
        group = { dateLabel, date, notifications: [] };
        res.push(group);
      }
      group.notifications.push(notification);
    }
    res.sort((a, b) => (a.date > b.date ? -1 : 1));
    return res;
  });

  // DOM event handlers
  const handleBodyClick = (event) => {
    if (isNotificationPanelVisible.value && !isElementInDialog(event.target)) {
      notificationStore.togglePersistentNotificationsVisible();
    }
  };

  function isElementInDialog(el) {
    let node = el.parentNode;
    while (node) {
      if (node.classList?.contains('u-dialog')) return true;
      node = node.parentNode;
    }
    return false;
  }

  // Methods
  const onClose = (id) => {
    notificationStore.removeItem({ id });
  };

  const onClearAll = () => {
    for (const notification of notifications.value) {
      notificationStore.removeItem({ id: notification.id });
    }
    notifications.value = [];
  };

  const handleArrowClick = () => {
    notificationStore.togglePersistentNotificationsVisible();
  };

  // ReactBus event handlers
  onMounted(() => {
    document.body.addEventListener('click', handleBodyClick);
    reactBus.on(STATE.TEST_NOTIFICATION, onTestConnection);
  });

  onUnmounted(() => {
    document.body.removeEventListener('click', handleBodyClick);
    reactBus.off(STATE.TEST_NOTIFICATION, onTestConnection);
  });

  const onTestConnection = async () => {
    const test = true;
    if (test) {
      $notification.error({
        title: 'Titre Notification test',
        message: 'Description',
        template: '<notification-connection :notification-id="notificationId"/>',
        display: 'persistent_short',
        options: {
          icon: 'icon-connect',
          context: {
            components: {
              'notification-connection': markRaw(NotificationConnection),
            },
          },
        },
      });
    }
  };

  const renderCompile = ({ template, context = {}, id }) => {
    const render = compile(template);
    return {
      render,
      data() {
        return { ...context.data, notificationId: id };
      },
      methods: context.methods,
      components: context.components || {},
    };
  };
</script>

<style lang="scss">
  .notification-panel {
    display: flex;
    position: fixed;
    right: 0;
    flex-direction: column;
    z-index: 1000;
    box-shadow: -2px 0 13px 3px rgba(32, 46, 61, 0.15);
    background-color: var(--color-neutral-100);
    width: 300px;
    height: calc(100vh - var(--header-height) - var(--stonly-banner-height));

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: var(--color-white);
      padding: 16px;

      .icon-arrow-back {
        transform: rotate(180deg);
        margin-right: 8px;
        cursor: pointer;
      }
    }

    .content {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;

      .clear-all-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 16px;
        padding-bottom: 0;

        & > p {
          text-decoration: underline;
        }
      }
      .disabled {
        opacity: 0.6;
      }

      .notification-group {
        & > p {
          padding: 20px 10px 10px 20px;
          color: var(--color-neutral-800);
          font-size: var(--paragraph-03);
        }
      }

      .component-fade-enter-active {
        transition-delay: 0.5s;
      }

      .component-fade-enter,
      .component-fade-leave-to {
        transform: translateX(300px);
      }

      .notification {
        margin-bottom: -1px;
      }

      .notification-description {
        color: var(--color-neutral-700);
        font-size: var(--paragraph-03);
      }

      .empty-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        user-select: none;

        span {
          margin-top: 12px;
          color: var(--color-neutral-500);
        }
      }
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.5s;
    }

    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
  }
</style>
