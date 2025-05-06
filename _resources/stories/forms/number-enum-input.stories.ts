import { UNumberEnumInput } from '@/modules/ui';
import { ref } from 'vue';

export default {
  title: 'Forms/NumberEnumInput',
};

export const NumberEnumInput = () => ({
  components: { UNumberEnumInput },
  template: `
  <p>
    <u-number-enum-input v-model="selected" :options="options" style="width: 632px;margin-bottom: 400px;" />
  </p>`,
  setup() {
    const selected = ref(0);
    const options = ref([0, 5, 10, 20, 25, 50]);
    return {
      selected,
      options,
    };
  },
});
