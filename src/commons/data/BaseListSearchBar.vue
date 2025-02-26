<template>
  <u-search-bar
    v-model="searchValue"
    class="search-bar"
    :placeholder="searchService?.getPlaceholder"
    icon-color="var(--color-neutral-700)"
    icon-position="left"
    clear
    @change="onSearchChange"
  >
    <button
      v-if="hasAvailableFilters"
      class="filter-icon"
      @click="toggleFilterPanel"
    >
      <icon-base icon="icon-filter" :size="22" color="var(--color-white)" />
      <p>{{ $t('commons.list.filters') }}</p>
      <u-filter-resume
        v-if="filterCount > 0"
        :filter-config="filterConfig"
        :active-filter="filters"
        @clear-filters="onClearFilters"
      />
    </button>
  </u-search-bar>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { debounce } from '@/libs/utils/Debounce.js';
  import USearchBar from '../others/USearchBar.vue';
  import UFilterResume from '../filter/UFilterResume.vue';
  import IconBase from '../icons/IconBase.vue';
  import SearchService from './services/searchService';

  // Props
  interface Props {
    searchService?: SearchService | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    searchService: null,
  });

  // Emits
  const emit = defineEmits<{
    (e: 'search-change', search: string): void;
  }>();

  // Computed properties
  const hasAvailableFilters = computed(() => {
    if (!props.searchService) return false;
    return Object.keys(props.searchService.getFilterConfig).length > 0;
  });

  const filterConfig = computed(() => {
    return props.searchService?.getFilterConfig || {};
  });

  const filters = computed(() => {
    return props.searchService?.getFilters || {};
  });

  const filterCount = computed(() => {
    if (!props.searchService) return 0;
    return Object.keys(props.searchService.getFilters).length;
  });

  // Two-way binding for search input
  const searchValue = computed({
    get: () => props.searchService?.getInput || '',
    set: (value: string) => {
      if (props.searchService) {
        props.searchService.setInput = value;
      }
    },
  });

  // Methods
  const searchChangeDebouncer = ref<ReturnType<typeof debounce> | null>(null);

  const onSearchChange = (search: string) => {
    if (!searchChangeDebouncer.value) {
      searchChangeDebouncer.value = debounce(async () => {
        emit('search-change', search);
      }, 250);
    }

    searchChangeDebouncer.value();
  };

  const toggleFilterPanel = () => {
    if (props.searchService) {
      props.searchService.setFilterPanelActive = true;
    }
  };

  const onClearFilters = () => {
    if (props.searchService) {
      props.searchService.setFilters = {};
      emit('search-change', props.searchService.getInput);
    }
  };
</script>
