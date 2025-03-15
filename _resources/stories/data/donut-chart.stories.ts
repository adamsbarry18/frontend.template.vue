import { defineComponent } from 'vue';
import UDonutChart from '@/commons/data/UDonutChart.vue';

export default {
  title: 'data/DonutChart',
  component: UDonutChart,
};

export const DonutChart = () => ({
  components: { UDonutChart },
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
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px;">
        <!-- Default -->
        <div style="height: 400px; width: 400px; border: 1px solid #ccc; padding: 10px;">
          <h3>Default</h3>
          <u-donut-chart
            :data="defaultData"
            title="Access From"
            :colors="colors"
          />
        </div>
        
        <!-- With Center Text -->
        <div style="height: 400px; width: 400px; border: 1px solid #ccc; padding: 10px;">
          <h3>With Center Text</h3>
          <u-donut-chart
            :data="defaultData"
            title="Access From"
            :colors="colors"
            centerText="403.5 k"
            centerSubtext="Individus ciblés\nestimés"
          />
        </div>
        
        <!-- With Sum -->
        <div style="height: 400px; width: 400px; border: 1px solid #ccc; padding: 10px;">
          <h3>With Sum</h3>
          <u-donut-chart
            :data="defaultData"
            title="Access From"
            :colors="colors"
            withSum
            centerSubtext="clicks"
          />
        </div>
        
        <!-- With Legend -->
        <div style="height: 400px; width: 400px; border: 1px solid #ccc; padding: 10px;">
          <h3>With Legend</h3>
          <u-donut-chart
            :data="defaultData"
            title="Access From"
            :colors="colors"
            withLegend
          />
        </div>
        
        <!-- With Sum And Legend -->
        <div style="height: 400px; width: 400px; border: 1px solid #ccc; padding: 10px;">
          <h3>With Sum And Legend</h3>
          <u-donut-chart
            :data="defaultData"
            title="Access From"
            :colors="colors"
            withSum
            withLegend
          />
        </div>
        
        <!-- With Label -->
        <div style="height: 400px; width: 400px; border: 1px solid #ccc; padding: 10px;">
          <h3>With Label</h3>
          <u-donut-chart
            :data="defaultData"
            title="Access From"
            :colors="colors"
            showLabel
          />
        </div>
        <!-- With All Features -->
        <div style="height: 400px; width: auto; border: 1px solid #ccc; padding: 10px;">
          <h3>With All Features</h3>
          <u-donut-chart
            :data="defaultData"
            title="Access From"
            :colors="colors"
            centerText="403.5 k"
            center-subtext="With All Features"
            withSum
            withLegend
            showLabel
          />
        </div>
      </div>
    `,
});
