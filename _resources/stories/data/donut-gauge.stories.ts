import { UDonutGauge } from '@/modules/common';

export default {
  title: 'data/DonutGauge',
  component: UDonutGauge,
};

// Story par défaut
export const Default = () => ({
  components: { UDonutGauge },
  template: `
    <div style='background-color: var(--color-neutral-100)'>
      <u-donut-gauge
        :percentage="percentage"
        :text="text"
        :angle-offset="angleOffset"
        :size="size"
      />
    </div>`,
  setup() {
    const text = '40k';
    const percentage = 33;
    const angleOffset = 0;
    const size = '123px';
    return { text, percentage, angleOffset, size };
  },
});

// Story avec pourcentage élevé
export const HighPercentage = () => ({
  components: { UDonutGauge },
  template: `
    <div style='background-color: var(--color-neutral-100)'>
      <u-donut-gauge
        :percentage="percentage"
        :text="text"
        :angle-offset="angleOffset"
        :size="size"
      />
    </div>`,
  setup() {
    const text = '90%';
    const percentage = 90;
    const angleOffset = 0;
    const size = '123px';
    return { text, percentage, angleOffset, size };
  },
});

// Story avec pourcentage bas
export const LowPercentage = () => ({
  components: { UDonutGauge },
  template: `
    <div style='background-color: var(--color-neutral-100)'>
      <u-donut-gauge
        :percentage="percentage"
        :text="text"
        :angle-offset="angleOffset"
        :size="size"
      />
    </div>`,
  setup() {
    const text = '10%';
    const percentage = 10;
    const angleOffset = 0;
    const size = '123px';
    return { text, percentage, angleOffset, size };
  },
});

// Story avec texte personnalisé
export const CustomText = () => ({
  components: { UDonutGauge },
  template: `
    <div style='background-color: var(--color-neutral-100)'>
      <u-donut-gauge
        :percentage="percentage"
        :text="text"
        :angle-offset="angleOffset"
        :size="size"
      />
    </div>`,
  setup() {
    const text = 'Halfway';
    const percentage = 50;
    const angleOffset = 0;
    const size = '123px';
    return { text, percentage, angleOffset, size };
  },
});

// Story avec taille différente
export const DifferentSize = () => ({
  components: { UDonutGauge },
  template: `
    <div style='background-color: var(--color-neutral-100)'>
      <u-donut-gauge
        :percentage="percentage"
        :text="text"
        :angle-offset="angleOffset"
        :size="size"
      />
    </div>`,
  setup() {
    const text = '40k';
    const percentage = 33;
    const angleOffset = 0;
    const size = '200px';
    return { text, percentage, angleOffset, size };
  },
});

// Story avec offset d'angle
export const WithAngleOffset = () => ({
  components: { UDonutGauge },
  template: `
    <div style='background-color: var(--color-neutral-100)'>
      <u-donut-gauge
        :percentage="percentage"
        :text="text"
        :angle-offset="angleOffset"
        :size="size"
      />
    </div>`,
  setup() {
    const text = '40k';
    const percentage = 33;
    const angleOffset = 180;
    const size = '123px';
    return { text, percentage, angleOffset, size };
  },
});

// Story en état indéterminé
export const Indeterminate = () => ({
  components: { UDonutGauge },
  template: `
    <div style='background-color: var(--color-neutral-100)'>
      <u-donut-gauge
        :percentage="percentage"
        :text="text"
        :angle-offset="angleOffset"
        :size="size"
        :indeterminate="true"
      />
    </div>`,
  setup() {
    const text = '';
    const percentage = 0;
    const angleOffset = 0;
    const size = '123px';
    return { text, percentage, angleOffset, size };
  },
});
