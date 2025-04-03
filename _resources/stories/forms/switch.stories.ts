import { USwitch } from '@/modules/common';
import { ref } from 'vue';

export default {
  title: 'Forms/Switch',
};

export const Switch = () => ({
  components: { USwitch },
  setup() {
    const value = ref(false);
    const trueLabel = ref('ACTIVATED');
    const falseLabel = ref('DEACTIVATED');

    return { value, trueLabel, falseLabel };
  },
  template: `
    <div>
      <u-switch v-model="value"  :true-label="trueLabel" :false-label="falseLabel" />
      <p>Value: {{ value }}</p>
      <br/>
      <u-switch desabled v-model="value">
      <template #info>
         <p>Info</p>
      </template>
      </u-switch>
    </div>
  `,
});
