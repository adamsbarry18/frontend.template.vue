<template>
  <div class="u-datu-kpi-card -card-like">
    <h4>{{ title }}</h4>
    <p class="-subtitle">{{ subtitle }}</p>
    <div class="kpi-figure" :class="{ '-alone': !previousValue }">
      <div class="kpi-value-wrapper">
        <span class="kpi">{{ formattedValue }}</span>
        <span
          class="kpi-detail"
          :class="{ [`-${kpiDetailSize}`]: !!kpiDetailSize }"
        >
          {{ kpiDetail }}
        </span>
      </div>
      <template v-if="previousValue">
        <div class="separator" />
        <div class="kpi-delta">
          <template v-if="withNumberQualification">
            <div>
              <span class="kpi-primary" :style="{ color: deltaColor }">{{
                deltaPercent
              }}</span>
              <span class="kpi-raw" :style="{ color: deltaColor }"
                >({{ formattedDelta }})</span
              >
            </div>
          </template>
          <template v-else>
            <span class="kpi-primary" :style="{ color: deltaColor }">
              {{ formattedDelta }}
            </span>
          </template>
          <div class="caption">
            {{ $t('commons.comparison-vs-last-12-months') }}
          </div>
        </div>
      </template>
    </div>
    <u-info
      v-if="hasInfoSlot"
      class="kpi-help"
      icon-color="var(--color-neutral-500)"
    >
      <slot name="info" />
    </u-info>
  </div>
</template>

<script setup lang="ts">
  import { computed, useSlots } from 'vue';
  import { checkIsReducedNumberZero, numberFormat } from '@/libs/utils/Number';
  import { UInfo } from '@/modules/ui';

  interface Props {
    title: string;
    subtitle: string;
    value: number;
    kpiDetail?: string;
    kpiDetailSize?: string;
    previousValue?: number;
    withNumberQualification?: boolean;
    valueFormatOptions?: Record<string, any>;
    deltaFormatOptions?: Record<string, any>;
    deltaColorFunction?: (delta: number) => string;
  }

  const props = defineProps<Props>();

  // Valeurs par défaut pour certaines props
  const withNumberQualification = props.withNumberQualification ?? true;
  const valueFormatOptions = props.valueFormatOptions ?? { condensed: true };
  const deltaFormatOptions = props.deltaFormatOptions ?? {
    condensed: true,
    signNumber: true,
    maxPrecision: 1,
  };
  const deltaColorFunction =
    props.deltaColorFunction ??
    ((delta: number) => {
      if (delta > 0) return 'var(--color-status-success)';
      if (delta < 0) return 'var(--color-status-error)';
      return 'var(--color-black)';
    });

  // Gestion des slots
  const slots = useSlots();

  // Calculer la différence entre la valeur actuelle et la valeur précédente
  const delta = computed(() => {
    return props.value - (props.previousValue ?? 0);
  });

  // Couleur de la variation selon la valeur delta
  const deltaColor = computed(() => {
    if (
      checkIsReducedNumberZero(delta.value, deltaFormatOptions.maxPrecision)
    ) {
      return deltaColorFunction(0);
    }
    return deltaColorFunction(delta.value);
  });

  // Formattage de la valeur principale
  const formattedValue = computed(() => {
    return numberFormat(props.value, valueFormatOptions);
  });

  // Formattage de la variation
  const formattedDelta = computed(() => {
    return numberFormat(delta.value, deltaFormatOptions);
  });

  // Calcul du pourcentage de variation (si previousValue est défini)
  const deltaPercent = computed(() => {
    if (!props.previousValue) return '';
    return numberFormat((delta.value / props.previousValue) * 100, {
      unit: '%',
      signNumber: true,
      maxPrecision: 1,
    });
  });

  // Déterminer la présence d'un slot "info"
  const hasInfoSlot = computed(() => !!slots.info);
</script>

<style lang="scss" scoped>
  .u-datu-kpi-card {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 12px;

    .kpi-figure {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 12px;

      &.-alone {
        justify-content: flex-start;
      }

      .kpi-value-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;

        .kpi {
          font-size: var(--heading-01);
          font-weight: bold;
        }

        .kpi-detail {
          &.-high {
            font-size: var(--heading-01);
            font-weight: bold;
          }
          &.-small {
            font-size: var(--paragraph-03);
          }
        }
      }

      .separator {
        width: 1px;
        min-height: 40px;
        height: 100%;
        margin: 0 12px;
        background-color: var(--color-neutral-300);
      }

      .kpi-delta {
        text-align: center;

        .kpi-primary {
          font-size: var(--heading-03);
          font-weight: bold;
        }
        .kpi-raw {
          font-size: var(--paragraph-03);
          padding-left: 4px;
        }
        .caption {
          font-size: var(--caption);
          color: var(--color-neutral-800);
        }
      }
    }

    .kpi-help {
      position: absolute;
      top: 12px;
      right: 12px;
    }
  }
</style>
