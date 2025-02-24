import UPill from '@/commons/layout/UPill.vue';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Layout/Pill',
  component: UPill,
};

export const Pill = () => ({
  components: { UPill },
  template: `
    <div style="padding: 20px; padding-right: 300px">
      <u-pill style="margin: 8px" title="Coucou" icon="icon-users" :disabled="true">
        Grand public été 2021
      </u-pill>
      <u-pill style="margin: 8px" title="Coucou" :is-closable="true" @close="onClose">
        Gens sympas
      </u-pill>
      <br />
    </div>
    `,
  setup() {
    const onClose = () => alert('close');

    return { onClose };
  },
});
