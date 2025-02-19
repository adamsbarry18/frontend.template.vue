import UButton from '@/commons/basic/UButton.vue';
import uMessageBox from '@/commons/notice/UMessageBox';
import { ref } from 'vue';

export default {
  title: 'Notice/MessageBox',
  components: { UButton },
};

export const MessageBox = () => ({
  components: { UButton },
  template: '<u-button @click="showMessageBox">Show message box</u-button>',
  setup() {
    const msgbox = uMessageBox;

    const showMessageBox = async () => {
      try {
        await msgbox({
          type: 'warning',
          title: 'Title msbox',
          message:
            "Message box ouverte avec succès en utilisant l'alias msgbox",
          cancelButtonText: 'Cancel',
          confirmButtonText: 'OK',
          showCancelButton: true,
        });
        console.log('MessageBox fermé avec OK (Alias msgbox)');
      } catch (error) {
        console.log('MessageBox fermé (Annulé ou fermé) (Alias msgbox)');
        console.error('MessageBox annulé ou erreur (Alias msgbox):', error);
      }
    };

    return { showMessageBox };
  },
});
