import { ULoader } from '@/modules/common';

export default {
  title: 'Others/Loader',
};

export const Loader = () => ({
  components: { ULoader },
  template: `
    <div style='background-color: var(--color-white)'>
      <u-loader />
      <u-loader size="200px" />
      <u-loader
        stroke-linecap="round"
        size="20vw"
        :stroke-width="3.6"
        color="var(--color-primary-500)"
      />
    </div>`,
});
