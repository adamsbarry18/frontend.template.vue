import { UBadge } from '@/modules/ui';
import { ref } from 'vue';

export default {
  title: 'others/IconCount',
  component: UBadge,
};

export const IconCount = () => ({
  components: { UBadge },
  template: `
    <div style="background-color: white; width: 232px; height: 450px">
      <u-badge icon="icon-product" :count="3" :size="24" style="margin: 12px" />
      <u-badge icon="icon-audience" color="red" :count="2" :size="24" style="margin: 12px">
       <p>2 users!</p>
      </u-badge>
      <u-badge icon="icon-store" color="var(--color-primary-500)" :count="2" :size="32" style="margin: 12px" />
    </div>
  `,
  setup() {
    const activeItem = ref('convert');
    const onChange = (value: number) => {
      console.log('Value changed:', value);
    };
    return { activeItem, onChange };
  },
});
