<template>
  <u-tooltip placement="top">
    <template #content>
      <span>{{ tooltipFormatter(modelValue) }}</span>
    </template>
    <div class="u-confidence-indicator">
      <span class="confidence-label">{{ label }}</span>
      <div class="confidence-bars" :class="thresholdClass">
        <div class="bar" :class="{ '-active': thresholdIndex + 1 >= 1 }" />
        <div class="bar" :class="{ '-active': thresholdIndex + 1 >= 2 }" />
        <div class="bar" :class="{ '-active': thresholdIndex + 1 >= 3 }" />
        <div class="bar" :class="{ '-active': thresholdIndex + 1 >= 4 }" />
      </div>
    </div>
  </u-tooltip>
</template>

<script setup lang="ts">
  import { computed, PropType } from 'vue';
  import { UTooltip } from '@/modules/common';
  import i18n from '@/i18n';

  const props = defineProps({
    modelValue: {
      type: Number,
      required: true,
    },
    thresholds: {
      type: Array as PropType<number[]>,
      default: () => [65, 80, 90],
    },
    thresholdLabels: {
      type: Array as PropType<string[]>,
      default: () => [
        i18n.global.t('commons.confidence-indicator.threshold-0'),
        i18n.global.t('commons.confidence-indicator.threshold-1'),
        i18n.global.t('commons.confidence-indicator.threshold-2'),
        i18n.global.t('commons.confidence-indicator.threshold-3'),
      ],
    },
    tooltipFormatter: {
      type: Function as PropType<(value: number) => string>,
      default: (value: number) => `${value} %`,
    },
  });

  // Calcul en 0-based : nombre de seuils dépassés
  const thresholdIndex = computed(
    () => props.thresholds.filter((t) => props.modelValue >= t).length
  );
  // Pour l'affichage CSS, on utilise un index 1-based (au moins 1)
  const thresholdClass = computed(
    () => `-threshold-${thresholdIndex.value + 1}`
  );
  // Le label est choisi selon l'index 0-based fourni
  const label = computed(() => props.thresholdLabels[thresholdIndex.value]);
</script>

<style lang="scss" scoped>
  .u-confidence-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &.-inline {
      flex-direction: row;
      .confidence-label {
        margin-right: 4px;
        font-weight: 800;
      }
    }

    &.-bold {
      > .confidence-label {
        font-weight: 800;
      }
    }

    &.-large {
      .confidence-label {
        text-transform: capitalize;
        font-size: var(--subheading) !important;
      }
    }

    > .confidence-label {
      padding: 4px 0;
      line-height: 12px;
      white-space: nowrap;
      text-transform: uppercase;
      font-size: var(--caption) !important;
      color: var(--color-neutral-800);
    }

    .confidence-bars {
      display: flex;
      justify-content: center;

      &.-threshold-1 {
        --color-confidence-bar-active: var(--color-neutral-500);
      }
      &.-threshold-2 {
        --color-confidence-bar-active: var(--color-yellow-600);
      }
      &.-threshold-3 {
        --color-confidence-bar-active: var(--color-blue-300);
      }
      &.-threshold-4 {
        --color-confidence-bar-active: var(--color-green-500);
      }

      .bar {
        margin: 1px;
        border-radius: 1px;
        background-color: var(--color-neutral-300);
        width: 16px;
        height: 5px;

        &.-active {
          background-color: var(--color-confidence-bar-active);
        }
      }
    }
  }
</style>
