import { UKpiCard } from '@/modules/common';

export default {
  title: 'data/KpiCard', // Catégorie dans Storybook
  component: UKpiCard, // Composant à tester
};

// 1. Configuration par défaut
export const Default = () => ({
  components: { UKpiCard },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-kpi-card
        title="Total Sales"
        :value="value"
      />
    </div>`,
  setup() {
    const value = 12345;
    return { value };
  },
});

// 2. Avec description
export const WithDescription = () => ({
  components: { UKpiCard },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-kpi-card
        title="Total Sales"
        description="Sales over the last month"
        :value="value"
      />
    </div>`,
  setup() {
    const value = 12345;
    return { value };
  },
});

// 3. Avec tendance positive
export const WithPositiveTrend = () => ({
  components: { UKpiCard },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-kpi-card
        title="Total Sales"
        :value="value"
        trend-value="+15%"
        trend-type="increase"
        trend-label="vs last month"
        :arrow="true"
      />
    </div>`,
  setup() {
    const value = 12345;
    return { value };
  },
});

// 4. Avec tendance négative
export const WithNegativeTrend = () => ({
  components: { UKpiCard },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-kpi-card
        title="Total Sales"
        :value="value"
        trend-value="-10%"
        trend-type="decrease"
        trend-label="vs last month"
        :arrow="true"
      />
    </div>`,
  setup() {
    const value = 12345;
    return { value };
  },
});

// 5. Avec tendance neutre
export const WithNeutralTrend = () => ({
  components: { UKpiCard },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-kpi-card
        title="Total Sales"
        :value="value"
        trend-value="0%"
        trend-type="neutral"
        trend-label="vs last month"
      />
    </div>`,
  setup() {
    const value = 12345;
    return { value };
  },
});

// 6. Avec tooltip
export const WithTooltip = () => ({
  components: { UKpiCard },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-kpi-card
        title="Total Sales"
        :value="value"
        trend-value="+15%"
        trend-type="increase"
        trend-label="vs last month"
        :arrow="true"
        tooltip-content="This is a tooltip explaining the trend"
      />
    </div>`,
  setup() {
    const value = 12345;
    return { value };
  },
});

// 7. Avec slot "info"
export const WithInfoSlot = () => ({
  components: { UKpiCard },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-kpi-card
        title="Total Sales"
        :value="value"
        trend-value="+15%"
        trend-type="increase"
        trend-label="vs last month"
        :arrow="true"
      >
        <template #info>
          <p>Additional information about the KPI.</p>
        </template>
      </u-kpi-card>
    </div>`,
  setup() {
    const value = 12345;
    return { value };
  },
});
