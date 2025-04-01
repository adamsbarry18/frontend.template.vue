import UButton from '@/modules/common/basic/UButton.vue';
import { useNotification } from '@/composables/notfication';
const { $notification } = useNotification();

export default {
  title: 'notice/Notification',
};

export const Notification = () => ({
  components: { UButton },
  template: `
  <div style='display: grid; grid-template: "a" "b"; grid-gap: 10px;'>
    <u-button @click='showNotification'>Show Notification</u-button>
    <u-button @click='showSuccessNotification'>Show Success Notification</u-button>
    <u-button @click='showErrorNotification'>Show Error Notification</u-button>
    <u-button @click='showInfoNotification'>Show Info Notification</u-button>
    <u-button @click='showWarningNotification'>Show Warning Notification</u-button>
  </div>`,
  methods: {
    showNotification() {
      $notification.notify({
        message: 'message',
        title: 'title',
      });
    },
    showSuccessNotification() {
      $notification.success({
        message: 'message',
        title: 'title',
      });
    },
    showErrorNotification() {
      $notification.error({
        message: 'message',
        title: 'title',
      });
    },
    showInfoNotification() {
      $notification.info({
        message: 'message',
        title: 'title',
      });
    },
    showWarningNotification() {
      $notification.warning({
        message: 'message',
        title: 'title',
      });
    },
  },
});
