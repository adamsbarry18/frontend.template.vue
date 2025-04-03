import { URatioKpiCard } from '@/modules/common';

export default {
  title: 'data/RatioKpiCard',
  component: URatioKpiCard,
};

// 1. Configuration de base
export const Default = () => ({
  components: { URatioKpiCard },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-ratio-kpi-card
        title="Conversion Rate"
        :numerator="numerator"
        :denominator="denominator"
      />
    </div>`,
  setup() {
    const numerator = 150;
    const denominator = 1000;
    return { numerator, denominator };
  },
});

// 2. Avec sous-titre
export const WithSubtitle = () => ({
  components: { URatioKpiCard },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-ratio-kpi-card
        title="Conversion Rate"
        subtitle="Monthly performance"
        :numerator="numerator"
        :denominator="denominator"
      />
    </div>`,
  setup() {
    const numerator = 150;
    const denominator = 1000;
    return { numerator, denominator };
  },
});

// 3. Avec delta positif
export const WithPositiveDelta = () => ({
  components: { URatioKpiCard },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-ratio-kpi-card
        title="Conversion Rate"
        :numerator="numerator"
        :denominator="denominator"
        :delta="delta"
      />
    </div>`,
  setup() {
    const numerator = 150;
    const denominator = 1000;
    const delta = 2.5;
    return { numerator, denominator, delta };
  },
});

// 4. Avec delta négatif
export const WithNegativeDelta = () => ({
  components: { URatioKpiCard },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-ratio-kpi-card
        title="Conversion Rate"
        :numerator="numerator"
        :denominator="denominator"
        :delta="delta"
      />
    </div>`,
  setup() {
    const numerator = 150;
    const denominator = 1000;
    const delta = -1.8;
    return { numerator, denominator, delta };
  },
});

// 5. Avec slot "tooltip"
export const WithTooltip = () => ({
  components: { URatioKpiCard },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-ratio-kpi-card
        title="Conversion Rate"
        :numerator="numerator"
        :denominator="denominator"
      >
        <template #tooltip>
          <p>This is additional information about the KPI.</p>
        </template>
      </u-ratio-kpi-card>
    </div>`,
  setup() {
    const numerator = 150;
    const denominator = 1000;
    return { numerator, denominator };
  },
});

// 6. Avec couleur personnalisée
export const WithCustomColor = () => ({
  components: { URatioKpiCard },
  template: `
    <div style="background-color: var(--color-neutral-100)">
      <u-ratio-kpi-card
        title="Conversion Rate"
        :numerator="numerator"
        :denominator="denominator"
        color-progress-bar="var(--color-green-500)"
      />
    </div>`,
  setup() {
    const numerator = 150;
    const denominator = 1000;
    return { numerator, denominator };
  },
});
