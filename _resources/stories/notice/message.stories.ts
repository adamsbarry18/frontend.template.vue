import UButton from '@/modules/common/basic/UButton.vue';
import uMessage from '@/modules/common/notice/UMessage';

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
        type: 'success',
        message: "Quelquechose s'est bien passé",
      });
    };

    return { showMessage };
  },
});
