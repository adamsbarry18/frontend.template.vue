import UDialog from '@/modules/common/others/UDialog.vue';
import { ref } from 'vue';
import UButton from '@/modules/common/basic/UButton.vue';

export default {
  title: 'others/Dialog',
  component: UDialog,
};

// 1. Configuration par défaut
export const Default = () => ({
  components: { UDialog, UButton },
  template: `
    <div>
      <u-button @click="showDialog">Open Dialog</u-button>
      <u-dialog :visible="visible" @close="closeDialog">
        <template #title>
          <h2>Dialog Title</h2>
        </template>
        <p>Dialog content goes here.</p>
        <template #footer>
          <u-button @click="closeDialog">Close</u-button>
        </template>
      </u-dialog>
    </div>`,
  setup() {
    const visible = ref(false);
    const showDialog = () => {
      visible.value = true;
    };
    const closeDialog = () => {
      visible.value = false;
    };
    return { visible, showDialog, closeDialog };
  },
});

// 2. Avec panneau gauche
export const WithLeftPanel = () => ({
  components: { UDialog, UButton },
  template: `
    <div>
      <u-button @click="showDialog">Open Dialog with Left Panel</u-button>
      <u-dialog :visible="visible" @close="closeDialog">
        <template #left-panel>
          <div>Left Panel Content</div>
        </template>
        <template #title>
          <h2>Dialog Title</h2>
        </template>
        <p>Dialog content goes here.</p>
        <template #footer>
          <u-button @click="closeDialog">Close</u-button>
        </template>
      </u-dialog>
    </div>`,
  setup() {
    const visible = ref(false);
    const showDialog = () => {
      visible.value = true;
    };
    const closeDialog = () => {
      visible.value = false;
    };
    return { visible, showDialog, closeDialog };
  },
});

// 3. Avec icône de fermeture extérieure
export const WithOutsideCloseIcon = () => ({
  components: { UDialog, UButton },
  template: `
    <div>
      <u-button @click="showDialog">Open Dialog with Outside Close Icon</u-button>
      <u-dialog :visible="visible" closable close-icon-outside @close="closeDialog">
        <template #title>
          <h2>Dialog Title</h2>
        </template>
        <p>Dialog content goes here.</p>
        <template #footer>
          <u-button @click="closeDialog">Close</u-button>
        </template>
      </u-dialog>
    </div>`,
  setup() {
    const visible = ref(false);
    const showDialog = () => {
      visible.value = true;
    };
    const closeDialog = () => {
      visible.value = false;
    };
    return { visible, showDialog, closeDialog };
  },
});

// 4. Avec bouton de retour
export const WithBackButton = () => ({
  components: { UDialog, UButton },
  template: `
    <div>
      <u-button @click="showDialog">Open Dialog with Back u-button</u-button>
      <u-dialog :visible="visible" has-back-button @back="onBack" @close="closeDialog">
        <template #title>
          <h2>Dialog Title</h2>
        </template>
        <p>Dialog content goes here.</p>
        <template #footer>
          <u-button @click="closeDialog">Close</u-button>
        </template>
      </u-dialog>
    </div>`,
  setup() {
    const visible = ref(false);
    const showDialog = () => {
      visible.value = true;
    };
    const closeDialog = () => {
      visible.value = false;
    };
    const onBack = () => {
      console.log('Back u-button clicked');
    };
    return { visible, showDialog, closeDialog, onBack };
  },
});

// 5. Avec aide
export const WithHelp = () => ({
  components: { UDialog, UButton },
  template: `
    <div>
      <u-button @click="showDialog">Open Dialog with Help</u-button>
      <u-dialog :visible="visible" @close="closeDialog">
        <template #title>
          <h2>Dialog Title</h2>
        </template>
        <template #help>
          <p>Help content goes here.</p>
        </template>
        <p>Dialog content goes here.</p>
        <template #footer>
          <u-button @click="closeDialog">Close</u-button>
        </template>
      </u-dialog>
    </div>`,
  setup() {
    const visible = ref(false);
    const showDialog = () => {
      visible.value = true;
    };
    const closeDialog = () => {
      visible.value = false;
    };
    return { visible, showDialog, closeDialog };
  },
});
