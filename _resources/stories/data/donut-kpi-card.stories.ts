import UDonutKpiCard from '@/modules/common/data/UDonutKpiCard.vue';

export default {
  title: 'data/DonutKpiCard',
  component: UDonutKpiCard,
};

export const DonutKpiCard = () => ({
  components: { UDonutKpiCard },
  setup() {
    const defaultData = [
      { value: 1048, name: 'Search Engine' },
      { value: 735, name: 'Direct' },
      { value: 580, name: 'Email' },
      { value: 484, name: 'Union Ads' },
      { value: 300, name: 'Video Ads' },
    ];
    const colors = [
      '#5470c6',
      '#91cc75',
      '#fac858',
      '#ee6666',
      '#73c0de',
      '#3ba272',
      '#fc8452',
      '#9a60b4',
      '#ea7ccc',
    ];

    return { defaultData, colors };
  },
  template: `
      <div>
        <h3>With All Features</h3>
        <u-donut-kpi-card
        :data="defaultData"
        title="Access From"
        subtitle ="Awesome stats"
        :colors="colors"
        center-subtext="clicks"
        layout="vertical"
        />
      </div>
    `,
});
