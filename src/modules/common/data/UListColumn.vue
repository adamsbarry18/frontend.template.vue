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
      <slot name="header">
        <div class="u-list-column-header" :title="label" :class="headerClass">
          {{ label }}
        </div>
      </slot>
    </template>
    <template #default="scope">
      <slot :row="scope.row" />
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
  import { computed, ref, PropType } from 'vue';
  import { ElTableColumn } from 'element-plus';
  import { LIST_COLUMN_VISIBILITY } from '@/libs/utils/List';
  import i18n from '@/i18n';

  const props = defineProps({
    columnKey: {
      type: String,
    },
    columnDefaultVisibility: {
      type: String,
      default: LIST_COLUMN_VISIBILITY.ALWAYS,
      validator: (item: string) =>
        [
          LIST_COLUMN_VISIBILITY.ALWAYS,
          LIST_COLUMN_VISIBILITY.VISIBLE,
          LIST_COLUMN_VISIBILITY.INVISIBLE,
        ].includes(item),
    },
    label: {
      type: String,
    },
    className: {
      type: String,
    },
    sortable: {
      type: [Boolean, String],
      default: false,
    },
    sortProp: {
      type: String,
    },
    sortMethod: {
      type: Function as PropType<(a: any, b: any) => number>,
    },
    sortBy: {
      type: String,
    },
    width: {
      type: String,
    },
    type: {
      type: String,
    },
    minWidth: {
      type: String,
    },
    align: {
      type: String,
      default: 'center',
    },
    headerClass: {
      type: String,
      default: '',
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    filterLabel: {
      type: String,
    },
    filterFunction: {
      type: Function,
    },
    filterType: {
      type: String,
    },
    filterProperty: {
      type: String,
    },
    filterConfig: {
      type: Object,
    },
    // Nouvelles props pour remplacer inject()
    listKey: {
      type: String,
      required: true,
    },
    columnVisibility: {
      type: Object as PropType<Record<string, boolean>>,
      required: true,
    },
  });

  // State
  const hasCustomSort = ref(false);

  // Computed properties
  const isVisible = computed(() => {
    if (
      props.columnKey &&
      props.columnVisibility &&
      Object.prototype.hasOwnProperty.call(
        props.columnVisibility,
        `${props.listKey}@${props.columnKey}`
      )
    ) {
      return props.columnVisibility[`${props.listKey}@${props.columnKey}`];
    }
    return true;
  });

  const sortableProp = computed(() => {
    return hasCustomSort.value ? 'custom' : props.sortable;
  });

  const sortByProp = computed(() => {
    return hasCustomSort.value ? null : props.sortBy;
  });

  const sortMethodFunction = computed(() => {
    if (hasCustomSort.value) {
      return null;
    }
    return props.sortMethod ? props.sortMethod : defaultSortMethod;
  });

  // Methods
  const defaultSortMethod = (a: any, b: any): number => {
    if (!props.sortProp) return 0;

    if (
      !Object.prototype.hasOwnProperty.call(a, props.sortProp) &&
      !Object.prototype.hasOwnProperty.call(b, props.sortProp)
    ) {
      return 0;
    }
    if (!Object.prototype.hasOwnProperty.call(a, props.sortProp)) {
      return -1;
    }
    if (!Object.prototype.hasOwnProperty.call(b, props.sortProp)) {
      return 1;
    }
    if (
      typeof a[props.sortProp] === 'string' &&
      typeof b[props.sortProp] === 'string'
    ) {
      return a[props.sortProp].localeCompare(
        b[props.sortProp],
        i18n.global.locale,
        { numeric: true }
      );
    }
    if (a[props.sortProp] === b[props.sortProp]) {
      return 0;
    }
    return a[props.sortProp] > b[props.sortProp] ? 1 : -1;
  };

  const setCustomSort = (value: boolean) => {
    hasCustomSort.value = value;
  };

  defineExpose({
    setCustomSort,
  });
</script>

<style lang="scss">
  .u-list-wrapper .el-table th div.cell {
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
