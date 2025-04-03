<template>
  <div class="u-donut-chart">
    <v-chart
      v-if="data && data.length > 0"
      ref="chart"
      class="donut"
      :option="options"
      autoresize
      @legendselectchanged="onLegendSelectChanged"
    />
    <chart-no-data v-else />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onBeforeUnmount } from 'vue';
  import { debounce } from '@/libs/utils/Debounce';
  import { getCssVariable } from '@/libs/utils/Style';
  import { getGraphColorPalette } from '@/libs/utils/Color';
  import { ChartNoData } from '@/modules/common';
  import { numberFormat } from '@/libs/utils/Number';

  const props = defineProps({
    centerText: {
      type: String,
      default: '',
    },
    centerTextFontSize: {
      type: String,
      default: () => getCssVariable('--paragraph-01'),
    },
    centerSubtext: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: null,
    },
    colors: {
      type: Array,
      default: () => getGraphColorPalette(),
    },
    data: {
      type: Array,
      required: true,
    },
    showLabel: {
      type: Boolean,
      default: false,
    },
    layout: {
      type: String,
      default: 'auto',
      validator: (value: string) =>
        ['auto', 'vertical', 'horizontal'].includes(value),
    },
    valueFormatter: {
      type: Function,
      default: (value) => numberFormat(value, { condensed: true }),
    },
    tooltipFormat: {
      type: [Boolean, String, Function],
      default: () => (p) =>
        `${p.seriesName} <br/>${p.name}: ${numberFormat(p.value, { condensed: true })} (${numberFormat(p.percent, { unit: '%' })})`,
    },
    minRadius: {
      type: String,
      default: '65%',
    },
    maxRadius: {
      type: String,
      default: '90%',
    },
    withSum: {
      type: Boolean,
      default: false,
    },
    withLegend: {
      type: Boolean,
      default: false,
    },
  });

  // Reactive window width and legend state
  const windowWidth = ref(window.innerWidth);
  const legendSelected = ref<Record<string, boolean> | null>(null);

  // Setup resize debouncer
  const resizeDebouncer = debounce(() => {
    windowWidth.value = window.innerWidth;
  }, 500);
  window.addEventListener('resize', resizeDebouncer);

  // Computed properties
  const sum = computed(() => {
    return props.data
      .filter(
        (item: any) => !legendSelected.value || legendSelected.value[item.name]
      )
      .reduce((acc: any, item: any) => acc + item.value, 0);
  });

  const isLayoutVertical = computed<boolean>(() => {
    if (props.layout === 'vertical') return true;
    if (props.layout === 'horizontal') return false;
    return windowWidth.value <= 1400;
  });

  const horizontalPosition = computed<string>(() => {
    return !props.withLegend ? '50%' : isLayoutVertical.value ? '50%' : '32%';
  });

  const verticalPosition = computed<number>(() => {
    return !props.withLegend ? 50 : isLayoutVertical.value ? 40 : 50;
  });

  const titleTopOffset = computed<number>(() => {
    return (
      verticalPosition.value -
      (props.centerSubtext && props.centerSubtext.includes('\n') ? 5 : 2)
    );
  });

  const options = computed<any>(() => {
    const opts: any = {
      textStyle: {
        fontFamily: 'Roboto',
        fontSize: getCssVariable('--paragraph-03'),
      },
      color: props.colors,
      title: {
        text: props.withSum
          ? props.valueFormatter!(sum.value)
          : props.centerText,
        subtext: props.centerSubtext,
        top: `${titleTopOffset.value}%`,
        left: horizontalPosition.value,
        textAlign: 'middle',
        textVerticalAlign: 'middle',
        itemGap:
          props.centerSubtext && props.centerSubtext.includes('\n') ? 5 : -2,
        textStyle: {
          fontSize: props.withSum
            ? getCssVariable('--heading-01')
            : props.centerTextFontSize,
          fontWeight: 700,
        },
        subtextStyle: {
          fontSize: getCssVariable('--caption'),
          color: getCssVariable('--color-neutral-600'),
        },
      },
      legend: {
        show: props.withLegend,
        orient: isLayoutVertical.value ? 'horizontal' : 'vertical',
        right: isLayoutVertical.value ? 'auto' : '5%',
        top: isLayoutVertical.value ? 'auto' : 'middle',
        bottom: isLayoutVertical.value ? '0' : 'auto',
        itemGap: 16,
        selected: legendSelected.value ?? {},
      },
      series: [
        {
          name: props.title,
          type: 'pie',
          silent: !props.tooltipFormat,
          center: [horizontalPosition.value, `${verticalPosition.value}%`],
          radius: [props.minRadius, props.maxRadius],
          avoidLabelOverlap: false,
          label: {
            show: props.showLabel,
            formatter: ({ percent }: { percent: number }) =>
              numberFormat(percent, { maxPrecision: 0, unit: '%' }),
            position: 'inside',
          },
          emphasis: {
            label: {
              show: props.showLabel,
              fontSize: '20',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: props.data,
        },
      ],
    };

    if (props.tooltipFormat) {
      opts.tooltip = {
        trigger: 'item',
        formatter: props.tooltipFormat,
        appendToBody: true,
      };
    }
    return opts;
  });

  // Legend select changed handler
  function onLegendSelectChanged(params: any) {
    legendSelected.value = params.selected;
  }

  // Cleanup on unmount
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeDebouncer);
  });

  // Expose chart update method if needed
  const chart = ref(null);
  function updateChart(): void {
    if (chart.value) {
      chart.value.resize();
    }
  }

  // Expose chart ref and updateChart for parent usage if needed
  defineExpose({ updateChart });
</script>

<style lang="scss">
  .u-donut-chart {
    width: 100%;
    height: 250px;
    .donut,
    .donut > div,
    .donut canvas {
      height: 100% !important;
      width: 100% !important;
    }
  }
</style>
