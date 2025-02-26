import UIconCount from '@/commons/others/UIconCount.vue';
import { ref } from 'vue';

export default {
  title: 'others/IconCount',
  component: UIconCount,
};

export const IconCount = () => ({
  components: { UIconCount },
  template: `
    <div style="background-color: white; width: 232px; height: 450px">
      <u-icon-count icon="icon-product" :count="3" :size="24" style="margin: 12px" />
      <u-icon-count icon="icon-audience" color="red" :count="2" :size="24" style="margin: 12px">
       <p>2 users!</p>
      </u-icon-count>
      <u-icon-count icon="icon-store" color="var(--color-primary-500)" :count="2" :size="32" style="margin: 12px" />
    </div>
  `,
  setup() {
    const activeItem = ref('convert');
    const onChange = (value) => {
      console.log('Item changed', value);
    };
    return { activeItem, onChange };
  },
});
