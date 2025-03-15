<template>
  <div ref="wrapper" class="u-funnel-wrapper" @mousemove="updateMouseX">
    <!-- Loader (affiché pendant le chargement si nécessaire) -->
    <div v-if="loading" class="funnel-loader">
      <!-- Vous pouvez insérer ici un spinner ou autre indicateur de chargement -->
      Loading...
    </div>

    <!-- Si des données sont disponibles -->
    <template v-else-if="hasData">
      <!-- Liste des catégories avec résumé -->
      <div class="category-list">
        <div
          v-for="(category, index) in categories"
          :key="category.label"
          class="category-wrapper"
          :style="{ flexBasis: roundCategorySize + '%' }"
        >
          <h4>{{ category.label }}</h4>
          <span class="category-total">{{
            numberFormat(getCategoryTotal(index), { condensed: true })
          }}</span>
          <p v-if="category.subtitle" class="category-subtitle">
            {{ category.subtitle }}
          </p>
          <!-- Slot personnalisé pour le résumé d'une catégorie -->
          <slot
            :name="`category-summary-${index}`"
            :index="index"
            :percentage="getLossPercentage(index)"
          >
            <span v-if="index !== 0" class="category-summary">
              {{
                $t('commons.funnel.category-summary', {
                  percentage: numberFormat(getLossPercentage(index), {
                    condensed: true,
                    unit: '%',
                    precision: 1,
                  }),
                  total:
                    index > 0 ? categories[index - 1].label?.toLowerCase() : '',
                })
              }}
            </span>
          </slot>
        </div>
      </div>

      <!-- Overlay de séparation entre catégories -->
      <div class="category-separation-overlay" :style="{ height: chartHeight }">
        <div
          v-for="(category, index) in categories"
          :key="category.label"
          class="category-separation"
          :style="{ left: `${index * categorySize}%` }"
        ></div>
      </div>

      <!-- Graphique (via le composant global VChart) -->
      <v-chart
        ref="chart"
        class="u-funnel-chart"
        :option="options"
        :style="{ height: chartHeight }"
        autoresize
      />

      <!-- Légende affichée en bas -->
      <div class="legend-footer">
        <div
          v-for="(dimension, index) in dimensions"
          :key="dimension"
          class="dimension-legend"
        >
          <div
            class="legend-marker"
            :style="{ backgroundColor: getColorString(colorPalette[index]) }"
          ></div>
          <span>{{ dimension }}</span>
        </div>
      </div>
    </template>

    <!-- Composant de remplacement si aucune donnée n'est présente -->
    <chart-no-data v-else />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { graphic } from 'echarts';
  import ChartNoData from './ChartNoData.vue';
  import { numberFormat } from '../../libs/utils/Number';

  // Définition des types
  interface Category {
    label: string;
    subtitle?: string;
  }

  interface GraphDataRow {
    // Format attendu : [categoryIndex: number, value: number, dimension: string]
    0: number;
    1: number;
    2: string;
  }

  // Définition des props
  const props = defineProps<{
    data: GraphDataRow[]; // Données du graphique
    categories: Category[]; // Liste des catégories
    chartHeight?: string; // Hauteur du graphique (ex: "260px")
    loading?: boolean; // Indicateur de chargement (contrôlé par le parent)
    customOptions?: object; // Options supplémentaires pour le graphique
    colors?: any[]; // Palette de couleurs personnalisée (gradients ou couleurs simples)
  }>();

  // Valeurs par défaut
  const chartHeight = computed(() => props.chartHeight || '260px');
  const loading = computed(() => props.loading ?? false);

  // Référence à l'élément wrapper pour mesurer la largeur
  const wrapper = ref<HTMLElement | null>(null);
  // Position de la souris pour le tooltip (index de la catégorie survolée)
  const mouseX = ref(0);

  // Calcul de la largeur en pourcentage attribuée à chaque catégorie
  const categorySize = computed(() => 100 / props.categories.length);
  const roundCategorySize = computed(() => Math.round(categorySize.value));

  // Vérifie si des données sont présentes
  const hasData = computed(() => props.data && props.data.length > 0);

  // Extraction des dimensions uniques présentes dans les données
  const dimensions = computed(() => {
    const set = new Set(props.data.map((row) => row[2]));
    return Array.from(set);
  });

  // Palette de couleurs par défaut (peut être surchargée via la prop colors)
  const defaultColorPalette = [
    new graphic.LinearGradient(0, 0, 1, 1, [
      { offset: 0, color: '#8b85ff' },
      { offset: 0.333, color: '#9b9fff' },
      { offset: 0.666, color: '#9b9fff' },
      { offset: 0.675, color: '#c8cae4' },
      { offset: 1, color: '#c8cae4' },
    ]),
    new graphic.LinearGradient(0, 0, 1, 1, [
      { offset: 0, color: '#c8cae4' },
      { offset: 0.333, color: '#9b9fff' },
      { offset: 0.666, color: '#9b9fff' },
      { offset: 0.675, color: '#c8cae4' },
      { offset: 1, color: '#c8cae4' },
    ]),
    new graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: '#f9c52f' },
      { offset: 1, color: '#ffe76e' },
    ]),
  ];
  const colorPalette = computed(() => props.colors ?? defaultColorPalette);

  // Options du graphique par défaut, fusionnées avec customOptions le cas échéant
  const options = computed(() => {
    const baseOptions = {
      grid: { left: 0, top: 20, bottom: 40, right: 0 },
      textStyle: { fontFamily: 'Roboto' },
      axisPointer: { type: 'none', lineStyle: { color: 'rgba(0,0,0,0)' } },
      tooltip: {
        trigger: 'axis',
        formatter: tooltipFormatter,
      },
      color: colorPalette.value,
      singleAxis: {
        top: 0,
        bottom: 40,
        left: 0,
        right: 0,
        type: 'value',
        minInterval: 1,
        axisLabel: { show: false },
        axisLine: { lineStyle: { width: 0 } },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      series: [
        {
          type: 'themeRiver',
          label: { show: false },
          emphasis: {
            itemStyle: { shadowBlur: 0, shadowColor: 'rgba(0, 0, 0, 0.3)' },
          },
          data: props.data,
        },
      ],
    };
    return props.customOptions
      ? { ...baseOptions, ...props.customOptions }
      : baseOptions;
  });

  // Fonction de formatage du tooltip
  function tooltipFormatter() {
    const idx = mouseX.value;
    let res = [`<b>${props.categories[idx]?.label || ''} : </b>`];
    for (const dimension of dimensions.value) {
      const row = props.data.find(
        (row) => row[0] === idx && row[2] === dimension
      );
      if (row) {
        const color = getColorString(
          colorPalette.value[dimensions.value.indexOf(dimension)]
        );
        const marker = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`;
        res.push(
          `${marker}${dimension}: <b>${numberFormat(row[1], { condensed: true })}</b>`
        );
      }
    }
    return res.join('<br />');
  }

  // Fonction utilitaire pour obtenir une couleur sous forme de chaîne
  function getColorString(color: any): string {
    return typeof color === 'string'
      ? color
      : color?.colorStops && color.colorStops.length > 0
        ? color.colorStops[0].color
        : '';
  }

  // Calcul du total pour une catégorie donnée (index)
  function getCategoryTotal(index: number): number {
    return props.data
      .filter((row) => row[0] === index)
      .reduce((acc, row) => acc + row[1], 0);
  }

  // Calcul du pourcentage de perte par rapport à la catégorie précédente
  function getLossPercentage(index: number): number {
    if (index === 0) return 0;
    const totalCurrent = getCategoryTotal(index);
    const totalPrevious = getCategoryTotal(index - 1);
    return totalPrevious ? (totalCurrent / totalPrevious) * 100 : 0;
  }

  // Met à jour la position de la souris pour déterminer la catégorie survolée
  function updateMouseX(event: MouseEvent) {
    if (wrapper.value) {
      const width = wrapper.value.offsetWidth;
      const ratio = event.offsetX / width;
      mouseX.value = Math.floor(ratio * props.categories.length);
    }
  }

  onMounted(() => {
    // Vous pouvez effectuer ici des opérations asynchrones (ex: chargement de données)
  });
</script>

<style lang="scss">
  .u-funnel-wrapper {
    display: flex;
    position: relative;
    flex-direction: column;
    margin: 20px 8px;

    .category-list {
      display: flex;
      .category-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        & > h4 {
          text-transform: uppercase;
          color: var(--color-neutral-500);
          font-size: var(--caption);
        }
        .category-total {
          font-size: var(--subheading);
          font-weight: 800;
        }
        .category-summary {
          text-align: center;
          color: var(--color-neutral-500);
          font-size: var(--paragraph-03);
        }
      }
    }
    .category-separation-overlay {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      .category-separation {
        position: absolute;
        transform: translateX(-50%);
        background: var(--color-neutral-300);
        width: 1px;
        height: 100%;
      }
    }
    .u-funnel-chart {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .legend-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      .dimension-legend {
        padding: 8px;
        .legend-marker {
          display: inline-block;
          margin-right: 5px;
          border-radius: 10px;
          width: 10px;
          height: 10px;
        }
      }
    }
    .funnel-loader {
      width: 100%;
      height: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
