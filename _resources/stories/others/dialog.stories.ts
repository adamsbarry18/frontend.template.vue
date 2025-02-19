import UDialog from '@/commons/others/UDialog.vue';
import UButton from '@/commons/basic/UButton.vue';
import { ref } from 'vue';

export default {
  title: 'others/Dialog',
};

export const BasicDialog = () => ({
  components: { UDialog, UButton },
  template: `
    <div>
      <u-button @click="infoDialog=true">Open info dialog</u-button>
      <u-button @click="leftPanelDialog=true">Open left-panel dialog</u-button>

      <u-button @click="buttonDialog=true">Open button dialog</u-button>

      <u-button @click="confirmDialog=true">Open confirm dialog</u-button>
      <u-button @click="closeIconOutsideDialog=true">Open close icon outside dialog</u-button>

      <u-dialog :visible="infoDialog" @update:visible="infoDialog = $event" closable has-back-button @back="onBack()" height="200px">
        <template #title>
            <h1>This is title</h1>
        </template>
        <p>Une information très utile</p>
        <template #footer>
            ©Jambon corp
        </template>
        <template>
            <slot name="help">Une aide probablement essentielle</slot>
        </template>
      </u-dialog>

      <u-dialog :visible="leftPanelDialog" @update:visible="leftPanelDialog = $event" closable height="100px">
      <template #title>
            <h1>This is title</h1>
        </template>
        <template #left-panel>
         <p> - Item 1</p>
         <p> - Item 2</p>
         <p> - Item 3</p>
         <p> - Item 4</p>
        </template>
        <p>Une information très utile</p>
        <template #help>
            <p>Une aide probablement essentielle</p>
        </template>
        <template #footer>
            ©Jambon corp
        </template>
      </u-dialog>

      <u-dialog :visible="buttonDialog" @update:visible="buttonDialog = $event" height="100px">
        <p>Quelle heure est-il?</p>
        <template #footer>
            <u-button @click="buttonDialog=false">Ok</u-button>
            <u-button type="primary"  @click="buttonDialog=false">D'accord</u-button>
        </template>
        <template #left-panel>
         <p> - Item 1</p>
         <p> - Item 2</p>
         <p> - Item 3</p>
         <p> - Item 4</p>
        </template>
      </u-dialog>

      <u-dialog @before-close="handleClose" :visible="confirmDialog" @update:visible="confirmDialog = $event" closable height="100px">
        <p>Close me</p>
      </u-dialog>

      <u-dialog :visible="closeIconOutsideDialog" @update:visible="closeIconOutsideDialog = $event" closable close-icon-outside height="100px">
        <p>Close icon is outside of dialog</p>
      </u-dialog>
    </div>
        `,
  setup() {
    const infoDialog = ref(false);
    const leftPanelDialog = ref(false);
    const buttonDialog = ref(false);
    const confirmDialog = ref(false);
    const closeIconOutsideDialog = ref(false);

    const onBack = () => {
      alert('Back button clicked!');
    };

    const handleClose = (done) => {
      if (confirm('Are you sure you want to close?')) {
        done(); // Pour fermer le dialogue
      }
    };

    return {
      infoDialog,
      leftPanelDialog,
      buttonDialog,
      confirmDialog,
      closeIconOutsideDialog,
      onBack,
      handleClose,
    };
  },
});
