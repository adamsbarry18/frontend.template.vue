<template>
  <div class="u-donut-kpi-card -card-like">
    <h4>{{ title }}</h4>
    <p v-if="subtitle" class="-subtitle">
      {{ subtitle }}
    </p>
    <u-donut-chart
      class="donut-kpi-chart"
      :class="{
        '-layout-auto': layout === 'auto',
        '-layout-vertical': layout === 'vertical',
      }"
      :data="data"
      :center-subtext="centerSubtext"
      :value-formatter="valueFormatter"
      :tooltip-format="tooltipFormatter"
      :layout="layout"
      :colors="colors"
      :min-radius="layout === 'vertical' ? '50%' : '60%'"
      :max-radius="layout === 'vertical' ? '65%' : '80%'"
      with-sum
      with-legend
    />
  </div>
</template>

<script setup lang="ts">
  import { numberFormat } from '@/libs/utils/Number';
  import { UDonutChart } from '@/modules/ui';

  interface Props {
    title: string;
    subtitle?: string | null;
    centerSubtext?: string;
    layout?: 'auto' | 'vertical' | 'horizontal';
    data: any[];
    colors?: any[];
    valueFormatter?: (value: number) => string;
  }

  const props = defineProps<Props>();

  // Valeurs par défaut
  const title = props.title;
  const subtitle = props.subtitle ?? null;
  const centerSubtext = props.centerSubtext ?? '';
  const layout = props.layout ?? 'auto';
  const data = props.data;
  const colors = props.colors ?? [];
  const valueFormatter =
    props.valueFormatter ??
    ((value: number) => numberFormat(value, { condensed: true }));

  function tooltipFormatter(params: any) {
    const valueLabel = valueFormatter(params.value);
    const percent = numberFormat(params.percent, {
      maxPrecision: 1,
      unit: '%',
    });
    return `${params.marker} ${params.name} : ${valueLabel} (${percent})`;
  }
</script>

<style lang="scss" scoped>
  .u-donut-kpi-card {
    display: flex;
    flex-direction: column;
    padding: 20px;

    .donut-kpi-chart {
      margin: auto;
      height: 240px;

      &.-layout-auto {
        @media (max-width: 1400px) {
          height: 320px;
        }
      }

      &.-layout-vertical {
        height: 320px;
      }
    }
  }
</style>
