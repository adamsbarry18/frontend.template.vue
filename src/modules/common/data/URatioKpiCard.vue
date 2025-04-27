<template>
  <div class="u-ratio-kpi-card -card-like">
    <div class="header">
      <h4 class="title">{{ title }}</h4>
      <div v-if="hasInfoSlot">
        <u-info icon-color="var(--color-neutral-500)">
          <slot name="tooltip" />
        </u-info>
      </div>
    </div>
    <p v-if="subtitle" class="-subtitle">{{ subtitle }}</p>
    <div class="kpi-figure">
      <span class="figure-percent">
        {{ numberFormat(percent, { maxPrecision: 1, unit: '%' }) }}
      </span>
      <span
        v-if="delta && delta !== 0"
        class="figure-delta"
        :class="{ '-negative': delta < 0, '-positive': delta > 0 }"
      >
        ({{
          numberFormat(delta, {
            maxPrecision: 1,
            signNumber: true,
            unit: $t('commons.number.unit.points'),
          })
        }})
      </span>
    </div>
    <u-progress-bar
      :display-percent="false"
      :percent="percent"
      :color="colorProgressBar"
    />
    <div class="kpi-legend-footer">
      <span class="kpi-legend">{{
        numberFormat(numerator, { maxPrecision: 1, condensed: true })
      }}</span>
      <span class="kpi-legend">{{
        numberFormat(denominator, { maxPrecision: 1, condensed: true })
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, useSlots } from 'vue';
  import { UProgressBar, UInfo } from '@/modules/common';
  import { numberFormat } from '@/libs/utils/Number';

  // Interface pour typer les props
  interface Props {
    title: string;
    subtitle?: string | null;
    numerator: number;
    denominator: number;
    delta?: number | null;
    colorProgressBar?: string;
  }

  // Définition des props avec valeurs par défaut
  const props = withDefaults(defineProps<Props>(), {
    subtitle: null,
    delta: null,
    colorProgressBar: 'var(--color-blue-600)',
  });

  // Gestion des slots
  const slots = useSlots();
  const hasInfoSlot = computed(() => !!slots.tooltip);

  // Propriété calculée pour le pourcentage
  const percent = computed(() => (props.numerator / props.denominator) * 100);
</script>

<style lang="scss" scoped>
  .u-ratio-kpi-card {
    padding: 12px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        margin-right: 5px;
      }
    }

    .u-progress-bar {
      width: 100%;
    }
    .kpi-figure {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      .figure-percent {
        font-size: var(--heading-01);
        font-weight: bold;
      }
      .figure-delta {
        font-size: var(--paragraph-03);
        &.-positive {
          color: var(--color-green-500);
        }
        &.-negative {
          color: var(--color-red-500);
        }
      }
    }
    .kpi-legend-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 4px;
      width: 100%;
      .kpi-legend {
        color: var(--color-neutral-700);
        font-size: var(--caption);
      }
    }
  }
</style>
