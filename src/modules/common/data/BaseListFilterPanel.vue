<template>
  <transition name="filter-fade" :duration="350">
    <u-filter
      v-show="filterPanelActive"
      v-model="filter"
      :datu-count="currentTotal"
      v-model:search="searchBarInput"
      :config="filterConfig"
      @collapse="filterPanelActive = false"
      @change="onFilterChange"
    />
  </transition>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { UFilter } from '@/modules/common';
  import SearchService from './services/searchService';

  const props = defineProps<{
    searchService: SearchService | null;
  }>();

  const emit = defineEmits<{
    (e: 'filter-change'): void;
  }>();

  const filterPanelActive = computed(() => {
    return props.searchService?.filterPanelActive || false;
  });

  const filter = computed(() => {
    return props.searchService?.filters || {};
  });

  const currentTotal = computed(() => {
    return 0;
  });

  const searchBarInput = computed(() => {
    return props.searchService?.input || '';
  });

  const filterConfig = computed(() => {
    return props.searchService?.filterConfig || {};
  });

  function onFilterChange() {
    emit('filter-change');
  }
</script>
