<template>
  <transition name="filter-fade" :duration="350">
    <u-filter
      v-show="filterPanelActive"
      v-model="filter"
      :data-count="currentTotal"
      v-model:search="searchBarInput"
      :config="filterConfig"
      @collapse="filterPanelActive = false"
      @change="onFilterChange"
    />
  </transition>
</template>

<script seup lang="ts">
  import UFilter from '@/commons/filter/UFilter.vue';
  import SearchService from './services/searchService';

  defineProps({
    searchService: {
      type: SearchService,
      required: false,
      default: null,
    },
  });
</script>
