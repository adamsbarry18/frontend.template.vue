<template>
  <el-table-column
    v-if="isVisible"
    :class="['u-list-column', className]"
    :prop="sortProp"
    :sortable="sortableProp"
    :width="width"
    :min-width="minWidth"
    :sort-method="sortMethodFunction"
    :sort-by="sortByProp"
    :sort-orders="['ascending', 'descending']"
    :align="align"
    :type="type"
  >
    <!-- En-tête : utilise le slot "header" si défini, sinon affiche le label -->
    <template #header>
      <slot name="header">
        <div class="u-list-column-header" :title="label" :class="headerClass">
          {{ label }}
        </div>
      </slot>
    </template>

    <!-- Cellules : transmet la donnée de la ligne -->
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

  const props = defineProps({
    columnKey: { type: String },
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
    label: { type: String },
    className: { type: String },
    sortable: { type: [Boolean, String], default: false },
    sortProp: { type: String },
    sortMethod: { type: Function },
    sortBy: { type: String },
    width: { type: String },
    type: { type: String },
    minWidth: { type: String },
    align: { type: String, default: 'center' },
    headerClass: { type: String, default: '' },
  });

  // Injection de dépendances
  const listKey = inject('listKey', '');
  const columnVisibility = inject('columnVisibility', {});

  // Variable réactive pour gérer le tri personnalisé
  const hasCustomSort = ref(false);

  const isVisible = computed(() => {
    const fullKey = `${listKey}@${props.columnKey}`;
    if (props.columnKey && columnVisibility.hasOwnProperty(fullKey)) {
      return columnVisibility[fullKey];
    }
    return true;
  });

  // Propriété calculée pour la valeur de "sortable" selon la présence d'un tri personnalisé
  const sortableProp = computed(() => {
    return hasCustomSort.value ? 'custom' : props.sortable;
  });

  // Propriété calculée pour "sort-by"
  const sortByProp = computed(() => {
    return hasCustomSort.value ? null : props.sortBy;
  });

  // Propriété calculée pour la fonction de tri
  const sortMethodFunction = computed<((a: any, b: any) => number) | undefined>(
    () => {
      if (hasCustomSort.value) {
        return undefined;
      }
      return props.sortMethod
        ? (props.sortMethod as (a: any, b: any) => number)
        : defaultSortMethod;
    }
  );

  const defaultSortMethod = (a: any, b: any): number => {
    if (!props.sortProp) return 0;

    if (
      !a.hasOwnProperty(props.sortProp) &&
      !b.hasOwnProperty(props.sortProp)
    ) {
      return 0;
    }
    if (!a.hasOwnProperty(props.sortProp)) {
      return -1;
    }
    if (!b.hasOwnProperty(props.sortProp)) {
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

  // Méthode pour activer/désactiver le tri personnalisé
  function setCustomSort(value: boolean) {
    hasCustomSort.value = value;
  }
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
