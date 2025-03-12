<template>
  <u-search-bar
    v-model="searchService.input"
    class="search-bar"
    :placeholder="searchService.placeholder"
    icon-color="var(--color-neutral-700)"
    icon-position="left"
    clear
    @change="onSearchChange"
  >
    <button
      v-if="hasAvailableFilters"
      slot="suffix"
      class="filter-icon"
      @click="searchService.filterPanelActive = true"
    >
      <icon-base icon="icon-filter" :size="22" color="var(--color-white)" />
      <p>{{ $t('commons.list.filters') }}</p>
      <u-filter-resume
        v-if="filterCount > 0"
        slot="suffix"
        :filter-config="searchService.filterConfig"
        :active-filter="searchService.filters"
        @clear-filters="onClearFilters"
      />
    </button>
  </u-search-bar>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { debounce } from '@/libs/utils/Debounce.js';
  import USearchBar from '../others/USearchBar.vue';
  import UFilterResume from '../filter/UFilterResume.vue';
  import IconBase from '../icons/IconBase.vue';
  import SearchService from './services/searchService';

  const props = defineProps<{
    searchService: SearchService;
  }>();

  const emit = defineEmits<{
    (e: 'search-change', search: string): void;
  }>();

  const hasAvailableFilters = computed(() => {
    return Object.keys(props.searchService.filterConfig).length > 0;
  });

  const filterCount = computed(() => {
    return Object.keys(props.searchService.filters || {}).length;
  });

  let searchChangeDebouncer: (() => void) | null = null;

  function onSearchChange(search: string) {
    if (!searchChangeDebouncer) {
      searchChangeDebouncer = debounce(async () => {
        emit('search-change', search);
      }, 250);
    }

    searchChangeDebouncer();
  }

  function onClearFilters() {
    emit('search-change', props.searchService.input);
  }
</script>
