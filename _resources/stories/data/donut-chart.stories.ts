import UDonutChart from '@/commons/data/UDonutChart.vue';
import { ref } from 'vue';

export default {
  title: 'data/DonutChart',
  component: UDonutChart,
};

export const DonutChart = () => ({
  components: { UDonutChart },
  template: `
  <div style="display: flex; flex-direction: column; gap: 40px; padding: 20px;">
    <!-- Cas 1: Graphique donut avec des données -->
    <div>
      <h3>Donut Chart with Data</h3>
      <u-donut-chart
        :data="data"
        center-text="Total"
        center-subtext="Units"
        title="My Donut Chart"
        :show-label
        :with-legend
      />
    </div>

    <!-- Cas 2: Graphique donut sans données -->
    <div>
      <h3>Donut Chart with No Data</h3>
      <u-donut-chart
        :data="emptyData"
        center-text="No Data"
        center-subtext=""
        title="Empty Donut Chart"
        :show-label="false"
        :with-legend="false"
      />
    </div>

    <!-- Cas 3: Graphique donut en mode sombre -->
    <div>
      <h3>Donut Chart in Dark Mode</h3>
      <u-donut-chart
        :data="data"
        center-text="Total"
        center-subtext="Units"
        title="Dark Mode Chart"
        :show-label="true"
        :with-legend="true"
        class="-dark"
      />
    </div>
  </div>
`,
  setup() {
    // Exemple de données pour le graphique donut
    const data = ref([
      { name: 'Category A', value: 40 },
      { name: 'Category B', value: 25 },
      { name: 'Category C', value: 35 },
    ]);

    // Exemple de données vide
    const emptyData = ref([]);

    return { data, emptyData };
  },
});
