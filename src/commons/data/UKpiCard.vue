<script setup lang="ts">
  import { computed, defineProps, withDefaults, useSlots } from 'vue';
  import UFigure from '@/commons/data/UFigure.vue';
  import UInfo from '@/commons/others/UInfo.vue';
  import UTooltip from '@/commons/others/UTooltip.vue';
  import IconBase from '../icons/IconBase.vue';

  // Interface pour typer les props
  interface Props {
    title?: string;
    description?: string;
    value: string | number;
    valueLabel?: string;
    trendValue?: string;
    trendType?: 'increase' | 'neutral' | 'decrease';
    trendLabel?: string;
    arrow?: boolean;
    tooltipContent?: string;
  }

  // Définition des props avec valeurs par défaut
  const props = withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    valueLabel: '',
    trendValue: '',
    trendType: 'neutral',
    trendLabel: '',
    arrow: false,
    tooltipContent: '',
  });

  // Gestion des slots
  const slots = useSlots();
  const hasInfoSlot = computed(() => !!slots.info);

  // Propriété calculée pour la couleur de la tendance
  const trendColor = computed(() => {
    if (props.trendType === 'neutral') {
      return 'var(--color-neutral-800)';
    }
    return props.trendType === 'increase'
      ? 'var(--color-green-500)'
      : 'var(--color-red-500)';
  });
</script>

<template>
  <div class="kpi-card -card-like">
    <h4 class="title">{{ title }}</h4>
    <p v-if="description && description !== ''" class="-description">
      {{ description }}
    </p>
    <div class="content">
      <div class="left">
        <u-figure :label="valueLabel" :value="value" />
      </div>
      <div class="right">
        <div v-if="trendValue !== null" class="increase-wrapper">
          <div>
            <icon-base
              v-if="arrow && trendType !== 'neutral'"
              class="arrow"
              icon="icon-arrow-back"
              :color="trendColor"
              :style="{
                transform:
                  trendType === 'increase' ? 'rotate(90deg)' : 'rotate(-90deg)',
              }"
              :size="20"
            />
            <u-tooltip v-if="tooltipContent !== ''" placement="right">
              <span class="percentage-increase" :style="{ color: trendColor }">
                {{ trendValue }}
              </span>
              <template #content>
                <p>{{ tooltipContent }}</p>
              </template>
            </u-tooltip>
            <span
              v-else
              class="percentage-increase"
              :style="{ color: trendColor }"
            >
              {{ trendValue }}
            </span>
          </div>
          <span class="label-increase">{{ trendLabel }}</span>
          <u-info
            v-if="hasInfoSlot"
            class="info-increase"
            icon-color="var(--color-neutral-500)"
          >
            <slot name="info" />
          </u-info>
        </div>
      </div>
    </div>
    <div class="graph" />
  </div>
</template>

<style lang="scss">
  .kpi-card {
    display: flex;
    flex-direction: column;
    padding: 20px;
    .content {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      .left {
        text-align: left;
        .u-figure {
          flex-direction: row;
          align-items: baseline;
          .u-figure-label {
            margin-left: 4px;
            color: var(--color-neutral-500);
          }
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        .label-increase {
          padding-left: 5px;
          color: var(--color-neutral-500);
          font-size: var(--caption);
          font-weight: normal;
        }
        .increase-wrapper {
          display: flex;
          position: relative;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;
          .info-increase {
            position: relative;
            top: 8px;
          }
          .percentage-increase {
            font-size: var(--subheading);
            font-weight: bold;
          }
        }
      }
    }
  }
</style>
