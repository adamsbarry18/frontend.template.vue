<template>
  <v-chart ref="chart" class="u-bar-chart" :option="options" autoresize />
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  const props = defineProps({
    data: {
      required: true,
    },
  });

  // Options par défaut
  const defaultDimensions = ['segments', 'count', 'revenue'];

  const defaultXAxis = {
    type: 'category',
    axisLabel: {
      color: '#969fa9',
    },
    axisTick: {
      lineStyle: {
        width: 0,
      },
    },
  };

  const defaultYAxis = {
    max: 100,
    axisLabel: {
      formatter: '{value} %',
      color: '#969fa9',
    },
    axisLine: {
      lineStyle: {
        width: 0,
        color: '#969fa9',
      },
    },
    axisTick: {
      lineStyle: {
        color: '#969fa9',
      },
    },
  };

  const defaultSeries = [
    {
      name: 'Répartition effectifs',
      type: 'bar',
      color: '#7f78ff',
      itemStyle: { borderRadius: [3, 3, 0, 0] },
      barGap: '0%',
    },
    {
      name: 'Répartition CA 12 mois',
      type: 'bar',
      color: '#ffcd40',
      itemStyle: { borderRadius: [3, 3, 0, 0] },
      barGap: '0%',
    },
  ];

  const baseOptions = {
    grid: {
      left: 50,
      bottom: 32,
      right: 0,
    },
    textStyle: {
      fontFamily: 'Roboto',
    },
    legend: {
      right: '0',
    },
    tooltip: {},
    dataset: {
      source: props.data,
      dimensions: defaultDimensions,
    },
    xAxis: defaultXAxis,
    yAxis: defaultYAxis,
    series: defaultSeries,
  };

  // Fusionne les options de base avec d'éventuelles options personnalisées
  const options = computed(() => {
    return baseOptions;
  });
</script>

<style lang="scss" scoped>
  .u-bar-chart {
    width: 100%;
    height: 100%;
  }
</style>
