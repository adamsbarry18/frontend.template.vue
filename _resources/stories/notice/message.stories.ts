import UButton from '@/modules/common/basic/UButton.vue';
import { message } from '@/plugins/install';

export default {
  title: 'Notice/Message',
};

export const Message = () => ({
  components: { UButton },
  template: '<u-button @click="showMessage()">Show message</u-button>',
  setup() {
    const showMessage = () => {
      message({
        type: 'success',
        message: "Quelquechose s'est bien passé",
      });
    };

    return { showMessage };
  },
});
