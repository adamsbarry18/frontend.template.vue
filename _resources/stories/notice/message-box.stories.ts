import UButton from '@/modules/common/basic/UButton.vue';
import { msgbox } from '@/plugins/install';

export default {
  title: 'Notice/MessageBox',
  components: { UButton },
};

export const MessageBox = () => ({
  components: { UButton },
  template: '<u-button @click="showMessageBox">Show message box</u-button>',
  setup() {
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
