<template>
  <div
    v-if="showHeader"
    class="header-wrapper"
    :class="{
      '-filter-active': filterPanelActive,
      '-show-header-right': showHeaderRight,
    }"
  >
    <div v-if="searchService || showHeaderRight" class="header">
      <div class="header-left">
        <slot name="header" />
        <base-list-search-bar
          v-if="searchService"
          :search-service="searchService"
          @search-change="onFilterChange"
        />
      </div>
      <div v-if="showHeaderRight" class="header-right">
        <div v-if="entity" class="numbers-size">
          <icon-base
            :icon="entity.getEntityIcon"
            :size="26"
            color="white"
            class="count-icon"
          />
          <p>
            {{
              $t(entity.getEntityLabelKey, { count: listService.getItemsTotal })
            }}
          </p>
        </div>
        <u-select-group
          v-if="sort"
          v-model="sort.selectValue"
          :options="sort.selectOptions"
          :placeholder="sort.getPlaceholder"
          @change="onFilterChange"
        />
      </div>
    </div>
    <transition
      v-if="searchService && paginationService"
      name="filter-fade"
      :duration="350"
    >
      <u-filter
        v-show="filterPanelActive"
        v-model="searchService.getFilters"
        :datu-count="paginationService.itemsTotal"
        :search.sync="searchService.getInput"
        :config="searchService.getFilterConfig"
        @collapse="searchService.setFilterPanelActive = false"
        @change="onFilterChange"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { computed, defineProps, defineEmits } from 'vue';
  import BaseListSearchBar from './BaseListSearchBar.vue';
  import UFilter from '@/commons/filter/UFilter.vue';
  import USelectGroup from '@/commons/forms/USelectGroup.vue';
  import ListService from './services/listService';

  // Typage des props
  interface Props {
    listService: ListService<any> | null;
  }

  // Définir les props et les événements émis
  const props = defineProps<Props>();
  const emit = defineEmits<{
    (event: 'filter-change'): void;
  }>();

  // Propriétés calculées basées sur listService
  const paginationService = computed(
    () => props.listService?.getPagination ?? null
  );
  const searchService = computed(() => props.listService?.getSearch ?? null);
  const entity = computed(() => props.listService?.getEntity ?? null);
  const sort = computed(() => props.listService?.getSort ?? null);
  const showCounts = computed(() => props.listService?.getShowCounts ?? false);
  const filterPanelActive = computed(
    () => searchService.value?.getFilterPanelActive ?? false
  );
  const showHeaderRight = computed(() => !!entity.value || !!sort.value);
  const showHeader = computed(() => {
    return (
      showHeaderRight.value ||
      (searchService.value && paginationService.value) ||
      (searchService.value && !paginationService.value)
    );
  });

  // Méthode pour gérer le changement de filtre
  const onFilterChange = () => {
    emit('filter-change');
  };
</script>

<style lang="scss" scoped>
  .header-right {
    .el-input__inner {
      height: 34px;
    }
  }
  .header {
    padding: 0 0 20px 0 !important;
  }
</style>
