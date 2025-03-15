<template>
  <div class="u-category-funnel">
    <div
      class="categories-wrapper"
      :style="{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }"
    >
      <div
        v-for="category in categories"
        :key="category.title"
        class="category-label"
      >
        <p class="category-title">{{ category.title }}</p>
        <p class="category-value">
          {{ numberFormat(category.value, { condensed: true }) }}
        </p>
        <p class="category-subtitle">{{ category.subtitle }}</p>
      </div>
    </div>
    <v-chart
      ref="chart"
      class="funnel-chart"
      :option="graphOptions"
      autoresize
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { getGraphColorPalette } from '@/libs/utils/Color';
  import { numberFormat } from '../../libs/utils/Number';

  interface Category {
    title: string;
    value: number;
    subtitle?: string;
  }

  // Définition des props avec typage
  const props = defineProps<{
    categories: Category[];
    colors?: string[];
  }>();

  // Utilisation de la palette de couleurs par défaut si aucune n'est fournie
  const colors = computed(() => props.colors ?? getGraphColorPalette());

  // Calcul de l'option graphique pour ECharts
  const graphOptions = computed(() => ({
    tooltip: {
      trigger: 'item',
      valueFormatter: (value: number) =>
        numberFormat(value, { condensed: true }),
    },
    color: colors.value,
    legend: { show: false },
    textStyle: { fontFamily: 'Roboto' },
    series: [
      {
        name: 'Funnel',
        type: 'funnel',
        orient: 'horizontal',
        funnelAlign: 'center',
        left: '0%',
        right: '0%',
        label: { show: false },
        labelLine: { show: false },
        sort: 'none',
        data: [
          ...props.categories.map((category) => ({
            value: category.value,
            name: category.title,
            // On calcule la largeur de la barre en fonction du nombre de catégories
            itemStyle: { width: `${100 / props.categories.length}%` },
          })),
          // Ajout d'un point invisible pour obtenir une bordure plate en bas
          {
            value: Math.min(...props.categories.map((c) => c.value)),
            name: 'invisible',
            itemStyle: { width: '0%' },
          },
        ],
      },
    ],
  }));
</script>

<style lang="scss" scoped>
  .u-category-funnel {
    position: relative;
    padding-top: 40px;
    margin-top: 20px;

    .categories-wrapper {
      position: absolute;
      width: 100%;
      top: 0;
      display: grid;
      height: 100%;

      .category-label {
        display: flex;
        flex-direction: column;
        align-items: center;

        &:not(:last-child) {
          border-right: 1px solid var(--color-neutral-100);
        }
        .category-title {
          font-size: var(--caption);
          text-transform: uppercase;
          text-align: center;
        }
        .category-value {
          color: var(--color-neutral-800);
          font-size: var(--heading-04);
          font-weight: 700;
        }
        .category-subtitle {
          font-size: var(--caption);
        }
      }
    }
    .funnel-chart {
      height: 260px;
    }
  }
</style>
