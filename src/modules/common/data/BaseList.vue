<template>
  <div class="u-list-wrapper base-list">
    <base-list-header
      :list-service="listService"
      @filter-change="onFilterChange"
    >
      <template #header>
        <slot name="header" />
      </template>
    </base-list-header>

    <div v-if="loading" class="u-list-container">
      <slot name="items" :items="items">
        <div v-for="(item, key) in items" :key="key">
          <slot name="item" :item="item" />
        </div>
      </slot>
      <div v-if="items.length === 0 && !loading" class="empty-state">
        <img
          class="empty-image"
          src="@/assets/images/svg/list_empty.svg"
          alt=""
        />
        <slot name="empty-label">
          <span>{{
            isFiltered
              ? $t('commons.list.results.empty')
              : $t('commons.list.empty')
          }}</span>
        </slot>
      </div>
    </div>

    <u-list-pagination
      v-if="pagination"
      ref="paginationRef"
      :total="pagination.itemsTotal"
      :size="pagination.size"
      :default-page="pagination.defaultPage"
      @page-change="onPageChange"
    />

    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import ListService from './services/listService';
  import UListPagination from './UListPagination.vue';
  import BaseListHeader from './BaseListHeader.vue';

  const props = defineProps<{
    listService: ListService | null;
  }>();

  const items = ref<any[]>([]);
  const loading = ref(true);
  const paginationRef = ref<InstanceType<typeof UListPagination> | null>(null);

  const pagination = computed(() => {
    return props.listService?.pagination || null;
  });

  const search = computed(() => {
    return props.listService?.search || null;
  });

  const isFiltered = computed(() => {
    return !!search.value?.isFiltered;
  });

  onMounted(async () => {
    if (items.value.length) {
      props.listService?.onRetrieveData((data: any[]) => {
        items.value = data;
      });

      if (props.listService?.autoload) await retrieveData();
    }
  });

  async function onPageChange(pageNumber: number) {
    props.listService?.pagination?.changePage(pageNumber);
    await retrieveData();
  }

  async function onFilterChange() {
    if (props.listService) {
      items.value = await props.listService.onFilterChange();
      if (paginationRef.value) {
        paginationRef.value.currentPage =
          props.listService.pagination?.pageNumber || 1;
      }
    }
  }

  async function retrieveData() {
    loading.value = true;
    try {
      await props.listService?.retrieveData();
    } catch (err) {
      console.error('retrieveData error', err);
    } finally {
      loading.value = false;
    }
  }
</script>

<style lang="scss" scoped>
  .u-list-wrapper {
    .u-list-container {
      overflow-y: auto;
    }
  }
  .base-list {
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      & > img {
        height: 160px;
        object-fit: contain;
        margin: 8px;
      }
    }
  }
</style>
