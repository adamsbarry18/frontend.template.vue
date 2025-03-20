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
            :icon="entity.entityIcon"
            :size="26"
            color="white"
            class="count-icon"
          />
          <p>
            {{
              $t(entity.entityLabelKey, {
                count: listService.itemsTotal,
              })
            }}
          </p>
        </div>
        <u-select-group
          v-if="sort"
          v-model="sort.selectValue"
          :options="sort.selectOptions"
          :placeholder="sort.placeholder"
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
        v-model="searchService.filters"
        :datu-count="paginationService.itemsTotal"
        v-model:search="searchService.input"
        :config="searchService.filterConfig"
        @collapse="searchService.filterPanelActive = false"
        @change="onFilterChange"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import BaseListSearchBar from './BaseListSearchBar.vue';
  import UFilter from '@/modules/common/filter/UFilter.vue';
  import USelectGroup from '@/modules/common/forms/USelectGroup.vue';
  import IconBase from '../icons/IconBase.vue';
  import ListService from './services/listService';

  const props = withDefaults(
    defineProps<{
      listService?: ListService | null;
    }>(),
    {
      listService: null,
    }
  );

  const emit = defineEmits<{
    (e: 'filter-change'): void;
  }>();

  const paginationService = computed(() => {
    return props.listService?.pagination || null;
  });

  const searchService = computed(() => {
    return props.listService?.search || null;
  });

  const showHeader = computed(() => {
    return (
      showHeaderRight.value ||
      (!!searchService.value && !!paginationService.value) ||
      (!!searchService.value && !paginationService.value)
    );
  });

  const showHeaderRight = computed(() => {
    return !!entity.value || !!sort.value;
  });

  const filterPanelActive = computed(() => {
    return searchService.value?.filterPanelActive || false;
  });

  const showCounts = computed(() => {
    return props.listService?.showCounts || false;
  });

  const entity = computed(() => {
    return props.listService?.entity || null;
  });

  const sort = computed(() => {
    return props.listService?.sort || null;
  });

  function onFilterChange() {
    emit('filter-change');
  }
  onMounted(() => {
    console.log('list service data: ', props.listService.data);
  });
  defineExpose({ showCounts });
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
