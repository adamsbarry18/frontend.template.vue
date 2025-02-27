<template>
  <el-table-column
    v-if="isVisible"
    :class-name="className"
    :prop="sortProp"
    :sortable="sortableProp"
    :width="width"
    :min-width="minWidth"
    :sort-method="sortMethodFunction"
    :sort-by="sortByProp"
    :sort-orders="['ascending', 'descending']"
    class="u-list-column"
    :align="align"
    :type="type"
  >
    <template #header>
      <slot name="header" />
      <div class="u-list-column-header" :title="label" :class="headerClass">
        {{ label }}
      </div>
    </template>
    <template #default="scope">
      <slot :row="scope.row" />
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
  import { computed, ref, inject } from 'vue';
  import { ElTableColumn } from 'element-plus';
  import { LIST_COLUMN_VISIBILITY } from '@/libs/utils/List';
  import i18n from '@/i18n';

  interface Props {
    columnKey?: string;
    columnDefaultVisibility?: string;
    label?: string;
    className?: string;
    sortable: boolean | string;
    sortProp?: string;
    sortMethod?: (a: any, b: any) => number;
    sortBy?: string;
    width?: string;
    type?: string;
    minWidth?: string;
    align: string;
    headerClass?: string;
    filterable?: boolean;
    filterLabel?: string;
    filterFunction?: Function;
    filterType?: string;
    filterProperty?: string;
    filterConfig?: Record<string, unknown>;
  }

  const props = withDefaults(defineProps<Props>(), {
    columnDefaultVisibility: LIST_COLUMN_VISIBILITY.ALWAYS,
    sortable: false,
    align: 'center',
    headerClass: '',
    filterable: false,
  });

  // Injection des dépendances globales
  const listKey = inject<string>('listKey', '');
  const columnVisibility = inject<Record<string, boolean>>(
    'columnVisibility',
    {}
  );

  // Variable réactive pour le tri personnalisé
  const hasCustomSort = ref<boolean>(false);

  const isVisible = computed<boolean>(() => {
    if (props.columnKey && listKey !== '' && columnVisibility) {
      const key = `${listKey}@${props.columnKey}`;
      if (Object.prototype.hasOwnProperty.call(columnVisibility, key)) {
        return columnVisibility[key];
      }
    }
    return true;
  });

  const sortableProp = computed<boolean | string>(() =>
    hasCustomSort.value ? 'custom' : props.sortable
  );

  const sortByProp = computed<string | null>(() =>
    hasCustomSort.value ? null : props.sortBy || null
  );

  function defaultSortMethod(a: any, b: any): number {
    if (!props.sortProp) return 0;
    if (
      !a.hasOwnProperty(props.sortProp) &&
      !b.hasOwnProperty(props.sortProp)
    ) {
      return 0;
    } else if (!a.hasOwnProperty(props.sortProp)) {
      return -1;
    } else if (!b.hasOwnProperty(props.sortProp)) {
      return 1;
    }
    if (
      typeof a[props.sortProp] === 'string' &&
      typeof b[props.sortProp] === 'string'
    ) {
      return a[props.sortProp].localeCompare(
        b[props.sortProp],
        i18n.global.locale,
        {
          numeric: true,
        }
      );
    }
    if (a[props.sortProp] === b[props.sortProp]) {
      return 0;
    }
    return a[props.sortProp] > b[props.sortProp] ? 1 : -1;
  }

  const sortMethodFunction = computed<((a: any, b: any) => number) | null>(
    () =>
      hasCustomSort.value
        ? null
        : props.sortMethod
          ? props.sortMethod
          : defaultSortMethod
  );

  function setCustomSort(value: boolean): void {
    hasCustomSort.value = value;
  }

  defineExpose({ setCustomSort });
</script>

<style lang="scss">
  .u-list-wrapper .el-table th div.cell {
    background-color: red;
    .u-list-column-header {
      padding: 0;
      max-height: 52px;
      text-transform: uppercase;
      line-height: 16px;
      white-space: normal;
      word-break: normal;
      font-size: var(--caption);
    }
  }
</style>
