import UButton from '@/commons/basic/UButton.vue';
import uMessage from '@/commons/notice/UMessage';

export default {
  title: 'Notice/Message',
};

export const Message = () => ({
  components: { UButton },
  template: '<u-button @click="showMessage()">Show message</u-button>',
  setup() {
    const message = uMessage;
    const showMessage = () => {
      message({
        type: 'warning',
        message: "Quelquechose s'est bien passé",
      });
    };

    return { showMessage };
  },
});
