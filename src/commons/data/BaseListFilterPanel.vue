<template>
  <transition name="filter-fade" :duration="350">
    <u-filter
      v-show="filterPanelActive"
      v-model="filter"
      :data-count="currentTotal"
      :search.sync="searchBarInput"
      :config="filterConfig"
      @collapse="filterPanelActive = false"
      @change="onFilterChange"
    />
  </transition>
</template>

<script seup lang="ts">
  import SearchService from './services/searchService';
  import UFilter from '../filter/UFilter.vue';

  defineProps({
    searchService: {
      type: SearchService,
      required: false,
      default: null,
    },
  });
</script>
