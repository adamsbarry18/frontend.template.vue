import { UButton } from '@/modules/common';
import { useNotification } from '@/composables/notfication';

const { $message } = useNotification();

export default {
  title: 'Notice/Message',
};

export const Message = () => ({
  components: { UButton },
  template: '<u-button @click="showMessage()">Show message</u-button>',
  setup() {
    const showMessage = () => {
      $message({
        type: 'error',
        message: "Quelquechose s'est bien passé",
      });
    };

    return { showMessage };
  },
});
