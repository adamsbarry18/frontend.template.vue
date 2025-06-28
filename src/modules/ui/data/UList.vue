<template>
  <div class="u-list-wrapper" :class="{ '-show-table-header': showTableHeader }">
    <div
      v-if="showHeader"
      class="header-wrapper"
      :class="{
        '-filter-active': filterPanelActive,
        '-show-header-right': showHeaderRight,
      }"
    >
      <!-- Header content remains unchanged -->
      <div class="header">
        <div class="header-left">
          <div
            v-if="selectable && showSelectionSummary"
            class="selection-count"
            :class="{ '-with-selection': selection.length > 0 }"
          >
            {{
              $te(entitySelectedLabelKey)
                ? $t(entitySelectedLabelKey, { count: selection.length })
                : $t('commons.list-selected-entities-count', {
                    count: selection.length,
                  })
            }}
            <u-info v-if="selection.length > 0" placement="bottom" tooltip-class="selection-summary">
              <div v-for="(item, index) in selection" :key="index" class="selection-summary-item">
                <slot name="selection" :row="item" />
                <u-button
                  class="delete-selection-button"
                  type="secondary"
                  size="small"
                  icon="icon-cross"
                  :icon-size="16"
                  icon-color="var(--color-neutral-900)"
                  @click="toggleRowSelection(item, false)"
                />
              </div>
            </u-info>
          </div>
          <slot name="header" />
          <u-search-bar
            v-show="showSearchbar"
            v-model="searchBarInput"
            class="search-bar"
            :placeholder="$t('commons.searchbar.default-list')"
            icon-color="var(--color-neutral-700)"
            icon-position="left"
            clear
            @change="onSearchChange"
          >
            <template #suffix v-if="hasAvailableFilters">
              <button class="filter-icon" @click="filterPanelActive = true">
                <icon-base icon="icon-filter" :size="22" color="var(--color-white)" />
                <p>{{ $t('commons.list.filters') }}</p>
                <u-filter-resume
                  v-if="filterCount > 0"
                  :filter-config="filterConfig"
                  :active-filter="filter"
                  @clear-filters="onClearFilters"
                />
              </button>
            </template>
          </u-search-bar>
        </div>
        <div class="header-right">
          <slot name="header-right" />
          <u-select-group
            v-if="!showTableHeader"
            :value="computedCurrentSort"
            :options="computedSortOptions"
            @change="updateTableSort"
          />
          <div v-if="showHeaderRight" class="numbers-size">
            <icon-base :icon="entityIcon" :size="26" color="white" class="count-icon" />
            <p>
              {{
                $te(entityLabelKey)
                  ? $t(entityLabelKey, { count: formsattedListCount })
                  : $t('commons.list-entities-count', {
                      count: formsattedListCount,
                    })
              }}
            </p>
          </div>
        </div>
      </div>
      <transition name="filter-fade" :duration="350">
        <u-filter
          v-show="filterPanelActive"
          v-model="filter"
          :data-count="currentTotal"
          v-model:search="searchBarInput"
          :config="filterConfig"
          @collapse="filterPanelActive = false"
          @change="onFilterChange"
        />
      </transition>
    </div>
    <div class="u-list-container">
      <u-contextual-menu ref="contextualMenu" :list="scopedContextualMenuItems" />
      <u-list-selection-actions
        v-if="selection.length > 0 && selectable && showTableHeader"
        :selection="selection"
        :actions="listActions"
        :paginated-data="paginatedData"
        :data="data"
        :select-all-across-pages="showSelectAllAcrossPages"
        @clear-all="clearSelection"
        @check-all="selectAll"
        @select-all-across-pages="onSelectAllAcrossPages"
      />
      <div
        v-if="hasConfigurableColumns && showTableHeader"
        v-show="editableColumns.length > 0"
        class="column-settings-button-wrapper"
      >
        <icon-base
          ref="settingsButton"
          icon="icon-settings"
          class="column-settings-button -button-like"
          :color="isSettingsPopperActive ? 'var(--color-neutral-800)' : 'var(--color-neutral-700)'"
          :size="24"
          @click="onSettingsClick"
        />
        <u-list-column-settings
          v-if="hasConfigurableColumns && showTableHeader"
          ref="columnSettingsPopper"
          :columns="editableColumns"
          :defaults="defaultVisibility"
          @hide="onSettingsExit"
          @column-visibility-change="onColumnVisibilityChange"
        />
      </div>

      <el-table
        ref="table"
        :data="displayedData"
        :default-sort="savedDefaultSort as any"
        :show-header="showTableHeader"
        :row-class-name="rowClassNameWrapper"
        :row-key="isTree || reserveSelection ? rowKey : undefined"
        :lazy="isTree"
        :load="load"
        class="u-list"
        :class="{ '-is-tree': isTree, '-cursor-pointer': hasPointer }"
        :span-method="spanMethod"
        :border="hasBorder"
        @selection-change="onSelectionChange"
        @row-click="onRowClick"
        @row-contextmenu="onRowRightClick"
        @row-dblclick="onRowDoubleClick"
        @sort-change="onSortChange"
        @expand-change="onExpandChange"
        @wheel="onScroll"
        @cell-mouse-enter="onCellHover"
      >
        <template #empty>
          <div v-if="loading || !isMounted" />
          <slot v-else-if="filterCount === 0 && searchBarInput" name="empty">
            <img class="empty_image" src="@/assets/images/svg/list_empty.svg" alt="" />
            <p>{{ $t('commons.list.empty') }}</p>
          </slot>
          <div v-else>
            <img src="@/assets/images/svg/list_empty_filter.svg" alt="" />
            <p>{{ $t('commons.list.empty') }}</p>
            <span
              class="-button-like"
              @click="onClearFilters"
              v-html="
                $t('commons.list.empty.filters.clear', {
                  filterCount: filterCount,
                })
              "
            />
          </div>
        </template>
        <el-table-column
          v-if="selectable"
          width="50"
          type="selection"
          :selectable="selectableFilter"
          :reserve-selection="reserveSelection"
        />
        <el-table-column v-if="isTree" width="45" />
        <slot />
        <el-table-column
          v-if="hasConfigurableColumns && showTableHeader && editableColumns.length > 0"
          width="55"
        >
          <template #header>
            <div class="column-settings" />
          </template>
        </el-table-column>
        <slot name="append" />
      </el-table>
    </div>
    <u-list-pagination
      v-if="showPagination"
      :key="paginationKey"
      :total="currentTotal"
      :size="pageSize"
      :default-page="defaultPage"
      @page-change="onPaginationPageChange"
    />
    <u-list-row-buttons
      v-show="rowButtonsVisible"
      :pos="hoverElementPosition"
      :x-pos="xPosActionBtn()"
      @mouseleave="onLeaveRowButtons"
    >
      <div v-if="currentRowHover !== null" class="u-list-row-buttons">
        <slot name="action" :row="currentRowHover" />
      </div>
    </u-list-row-buttons>
  </div>
</template>

<script setup lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import i18n from '@/i18n';
  import { useRoute, useRouter } from 'vue-router';
  import { ElTable, ElTableColumn, TreeNode } from 'element-plus';
  import { applyFiltersToList } from '@/libs/utils/Filter';
  import { debounce } from '@/libs/utils/Debounce';
  import { orderBy } from '@/libs/utils/Sort';
  import { ref, computed, onMounted, onBeforeUnmount, useSlots, PropType, nextTick, provide } from 'vue';

  import {
    UContextualMenu,
    UFilter,
    UFilterResume,
    USearchBar,
    UButton,
    UListColumnSettings,
    UListPagination,
    USelectGroup,
    UInfo,
    UListRowButtons,
    UListSelectionActions,
  } from '@/modules/ui';
  import IconBase from '@/modules/ui/icons/IconBase.vue';

  import {
    setSort,
    getListSort,
    hasSavedSort,
    setVisibility,
    isColumnVisible,
    hasSavedVisibility,
    LIST_COLUMN_VISIBILITY,
  } from '@/libs/utils/List';

  const props = defineProps({
    data: { type: Array, default: () => [] },
    total: { type: Number, default: 0 },
    pageSize: { type: Number, default: 25 },
    entityIcon: { type: String, default: 'icon-object' },
    entityLabelKey: { type: String, default: 'commons.list-entities-count' },
    entitySelectedLabelKey: {
      type: String,
      default: 'commons.list-selected-entities-count',
    },
    selectable: { type: Boolean, default: false },
    selectableFilter: {
      type: Function as PropType<(row: any, index: number) => boolean>,
      default: null,
    },
    reserveSelection: { type: Boolean, default: false },
    showHeader: { type: Boolean, default: true },
    showTableHeader: { type: Boolean, default: true },
    showSelectionSummary: { type: Boolean, default: false },
    showSearchbar: { type: Boolean, default: true },
    showPagination: { type: Boolean, default: false },
    showSelectAllAcrossPages: { type: Boolean, default: false },
    hasConfigurableColumns: { type: Boolean, default: true },
    isTree: { type: Boolean, default: false },
    showCounts: { type: Boolean, default: true },
    rowClassName: { type: Function },
    listKey: { type: String, default: 'list' },
    rowKey: { type: String, default: 'id' },
    height: { type: String },
    listActions: { type: Array, default: () => [] },
    searchFunction: {
      type: Function,
      default: (row: any, searchInput = '') => {
        if (!row.name) return true;
        return row.name?.toLowerCase().includes(searchInput?.toLowerCase());
      },
    },
    defaultSort: { type: Object, default: () => ({}) },
    sortOptions: {
      type: Array<{ label: string; prop: string; order: string }>,
      default: () => [],
      validator: (options: { label: string; prop: string; order: string }[]) =>
        options.every((o) => o.label && o.prop && ['ascending', 'descending'].includes(o.order)),
    },
    load: {
      type: Function as PropType<(row: any, treeNode: TreeNode, resolve: (data: any[]) => void) => void>,
    },
    loading: { type: Boolean, default: false },
    extraFilterConfig: { type: Object, default: () => ({}) },
    spanMethod: {
      type: Function as PropType<
        (data: {
          row: any;
          rowIndex: number;
          column: any;
          columnIndex: number;
        }) => number[] | { rowspan: number; colspan: number } | undefined
      >,
      default: undefined,
    },
    hasPointer: { type: Boolean, default: true },
    backendSortable: { type: Boolean, default: false },
    hasBorder: { type: Boolean, default: false },
    storeFiltersUrl: { type: Boolean, default: true },
    dataNavInput: { type: String, default: null },
  });

  const emit = defineEmits([
    'selection-change',
    'row-click',
    'row-rightclick',
    'row-dblclick',
    'sort-change',
    'filter-change',
    'search-change',
    'change',
    'scroll',
    'scrolled-to-bottom',
    'expand-change',
  ]);

  const table = ref<InstanceType<typeof ElTable> | null>(null);
  const contextualMenu = ref<InstanceType<typeof UContextualMenu> | null>(null);
  const columnSettingsPopper = ref<InstanceType<typeof UListColumnSettings> | null>(null);
  const settingsButton = ref<InstanceType<typeof IconBase> | null>(null);
  const contextualMenuTarget = ref<any>(null);
  const editableColumns = ref<any[]>([]);
  const selection = ref<any[]>([]);
  const defaultVisibility = ref<Record<string, string>>({});
  const columnVisibility = ref<Record<string, boolean>>({});
  const filter = ref<Record<string, any>>({});
  const filterConfig = ref<Record<string, any>>({});
  const currentSort = ref<{ prop: string; order: string } | null>(null);
  const columnSortedComponent = ref<any>(null);
  const isSettingsPopperActive = ref(false);
  const filterPanelActive = ref(false);
  const rightClickEvent = ref<MouseEvent | null>(null);
  const searchBarInput = ref('');
  const filterChangeDebouncer = ref<(() => void) | null>(null);
  const searchChangeDebouncer = ref<(() => void) | null>(null);
  const onChangeDebouncer = ref<(() => void) | null>(null);
  const hoverElementPosition = ref<any>({});
  const currentRowHover = ref<any>(null);
  const oldRowNodeHover = ref<HTMLElement | null>(null);
  const rowButtonsVisible = ref(false);
  const isScrolling = ref(false);
  const scrollingTimeout = ref<any | null>(null);
  const isMounted = ref(false);
  const currentPage = ref(1);
  const defaultPage = ref(1);
  const paginationKey = ref('defaultPaginationKey');
  provide('listKey', props.listKey);
  provide('columnVisibility', columnVisibility.value);
  const route = useRoute();
  const router = useRouter();

  // Computed properties
  const savedDefaultSort = computed(() => {
    let sort;
    if (props.listKey && hasSavedSort(props.listKey)) {
      sort = getListSort(props.listKey);
    } else {
      sort = props.defaultSort;
    }
    if (sort && sort.prop && (sort.order === 'ascending' || sort.order === 'descending')) {
      return sort;
    }
    return undefined;
  });

  const filteredData = computed(() => {
    if (!isMounted.value || !props.data) return [];
    const res = props.searchFunction
      ? props.data.filter((a) => props.searchFunction!(a, searchBarInput.value))
      : props.data;
    return applyFiltersToList(res, filter.value, filterConfig.value);
  });

  const isRemoteData = computed(() => !!props.total && props.total > 0);

  const paginatedData = computed(() => {
    if (isRemoteData.value && props.data?.length) return props.data;
    if (!filteredData.value.length) return [];
    const sort = currentSort.value;
    if (sort && columnSortedComponent.value) {
      return orderBy(
        filteredData.value,
        sort.prop,
        sort.order,
        columnSortedComponent.value.sortMethod,
        columnSortedComponent.value.sortBy
      ).slice((currentPage.value - 1) * props.pageSize, currentPage.value * props.pageSize);
    }
    return filteredData.value.slice(
      (currentPage.value - 1) * props.pageSize,
      currentPage.value * props.pageSize
    );
  });

  const displayedData = computed(() => (props.showPagination ? paginatedData.value : filteredData.value));

  const currentTotal = computed(() => props.total || filteredData.value.length);

  const filterCount = computed(() => Object.keys(filter.value).length);

  const formsattedListCount = computed(() => {
    if (props.total) return currentTotal.value;
    if (filterCount.value !== 0 || searchBarInput.value !== '')
      return `${filteredData.value.length} / ${props.data?.length || 0}`;
    return filteredData.value.length;
  });

  const hasAvailableFilters = computed(() => Object.keys(filterConfig.value).length > 0);

  const scopedContextualMenuItems = computed(() =>
    props.listActions
      .filter(
        (i: any) =>
          !i.hasOwnProperty('filterFunc') ||
          (contextualMenuTarget.value && (i as any).filterFunc(contextualMenuTarget.value))
      )
      .map((i: any) => getScopedContextualMenuItem(i))
  );

  const showHeaderRight = computed(() => props.showCounts && !props.showPagination);

  const slots = useSlots();

  const computedCurrentSort = computed(() => {
    if (!currentSort.value) return null;
    const { prop, order } = currentSort.value;
    const key = `${prop}#${order}`;
    return { value: key, prop, order };
  });

  const computedSortOptions = computed(() =>
    props.sortOptions.map((option) => {
      const { label, prop, order } = option;
      const key = `${prop}#${order}`;
      return { label, key, value: { value: key, prop, order } };
    })
  );

  // Lifecycle hooks
  onMounted(() => {
    parseTableColumns();
    const tableWrapper = table.value?.$refs.bodyWrapper as HTMLDivElement | undefined;
    tableWrapper?.addEventListener('mouseleave', onMouseLeaveList);
    editableColumns.value = generateEditableColumnList();
    filterConfig.value = generateFilterConfig();
    filter.value = parseFiltersFromUrl();
    searchBarInput.value = parseSearchInputFromUrl();
    emit('filter-change', filter.value);
    const sort = currentSort.value || savedDefaultSort.value;
    if (sort && sort.prop && sort.order) updateTableSort({ prop: sort.prop, order: sort.order });
    setTimeout(() => {
      isMounted.value = true;
      setDefaultPage(parsePageFromUrl() || 1);
      onChange();
    }, 50);
  });

  onBeforeUnmount(() => {
    const tableWrapper = table.value?.$refs.bodyWrapper as HTMLDivElement | undefined;
    tableWrapper?.removeEventListener('mouseleave', onMouseLeaveList);
  });

  function onScroll(evt: WheelEvent) {
    emit('scroll');
    if (evt.deltaY > 0) checkScrolledToBottom();
    rowButtonsVisible.value = false;
    isScrolling.value = true;
    if (scrollingTimeout.value) clearTimeout(scrollingTimeout.value);
    scrollingTimeout.value = setTimeout(() => (isScrolling.value = false), 150);
  }

  function checkScrolledToBottom() {
    const tableWrapperEl = table.value?.$el.querySelector('div.el-table__body-wrapper') as
      | HTMLDivElement
      | undefined;
    const BOTTOM_OFFSET = 150;
    if (tableWrapperEl) {
      const heightTableWrapper = tableWrapperEl.scrollHeight - tableWrapperEl.offsetHeight;
      if (tableWrapperEl.scrollTop + BOTTOM_OFFSET > heightTableWrapper) {
        emit('scrolled-to-bottom');
      }
    } else {
      // Handle case where tableWrapperEl is not found, maybe log an error
      console.error('Table body wrapper not found for scroll check.');
    }
  }

  function setDefaultPage(page: number) {
    defaultPage.value = page;
    currentPage.value = page;
    paginationKey.value = uuidv4();
  }

  function onLeaveRowButtons(event: MouseEvent) {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (
      !relatedTarget?.classList.contains('u-list-row-buttons') &&
      relatedTarget?.tagName?.toLowerCase() !== 'td'
    ) {
      rowButtonsVisible.value = false;
      oldRowNodeHover.value?.classList.remove('color-hover');
    }
  }

  function rowClassNameWrapper({ row, rowIndex }: { row: any; rowIndex: number }) {
    let res = 'u-list-row';
    if (props.rowClassName) res += ` ${props.rowClassName({ row, rowIndex })}`;
    return res;
  }

  function onCellHover(row: any, column: any, cell: HTMLElement) {
    if (oldRowNodeHover.value && cell.parentNode !== oldRowNodeHover.value) {
      oldRowNodeHover.value.classList.remove('color-hover');
      rowButtonsVisible.value = false;
    }
    if (!isScrolling.value && cell.parentNode instanceof HTMLElement) {
      showRowButtons(row, cell.parentNode);
    }
  }

  function onMouseLeaveList(event: MouseEvent) {
    const relatedTarget = event.relatedTarget as Element | null;
    if (
      !relatedTarget?.classList.contains('u-list-row-buttons') &&
      !['button', 'svg', 'path', 'td'].includes(relatedTarget?.nodeName?.toLowerCase() || '')
    ) {
      rowButtonsVisible.value = false;
      if (oldRowNodeHover.value) {
        oldRowNodeHover.value?.classList.remove('color-hover');
      }
    }
  }

  function showRowButtons(row: any, rowElement: HTMLElement) {
    currentRowHover.value = row;
    oldRowNodeHover.value = rowElement;
    if (oldRowNodeHover.value) {
      oldRowNodeHover.value.classList.add('color-hover');
      const posTab = (table.value?.$refs.bodyWrapper as HTMLDivElement).getBoundingClientRect();
      hoverElementPosition.value = oldRowNodeHover.value.getBoundingClientRect();
      const isRowInTable = Math.trunc(hoverElementPosition.value.top) >= Math.trunc(posTab.top);
      const isRowWithinTable = Math.trunc(hoverElementPosition.value.bottom) <= Math.trunc(posTab.bottom);
      rowButtonsVisible.value = isRowInTable && isRowWithinTable;
    } else {
      rowButtonsVisible.value = false;
    }
  }

  function getScopedContextualMenuItem(item: any) {
    const res: any = {};
    if (item.icon) res.icon = item.icon;
    if (item.label) res.label = item.label;
    if (item.onClick) {
      res.onClick = () =>
        item.multiTarget
          ? item.onClick([contextualMenuTarget.value], rightClickEvent.value)
          : item.onClick(contextualMenuTarget.value, rightClickEvent.value);
    }
    if (item.children) res.children = item.children.map((child: any) => getScopedContextualMenuItem(child));
    return res;
  }

  function onSelectionChange(newSelection: any[]) {
    selection.value = [...newSelection];
    emit('selection-change', selection.value);
  }

  function onRowClick(row: any, column: any, event: MouseEvent) {
    let rowNode: HTMLElement | null = event.target instanceof HTMLElement ? event.target : null;
    while (rowNode && !rowNode.classList.contains('u-list-row')) {
      rowNode = rowNode.parentNode instanceof HTMLElement ? rowNode.parentNode : null;
    }
    if (rowNode) showRowButtons(row, rowNode);
    if (canToggleRowSelection(row)) toggleRowSelection(row);
    emit('row-click', row);
  }

  function onRowRightClick(row: any, col: any, event: MouseEvent) {
    if ((event.target as HTMLElement).matches('.u-list-row-buttons, .u-list-row-buttons *')) return;
    if (scopedContextualMenuItems.value.length > 0) {
      if (canToggleRowSelection(row)) {
        clearSelection();
        toggleRowSelection(row, true);
      }
      rightClickEvent.value = event;
      openContextualMenu(row, event);
    }
    emit('row-rightclick', row, event);
  }

  function onPaginationPageChange(page: number) {
    currentPage.value = page;
    onChange();
  }

  function openContextualMenu(row: any, event: MouseEvent) {
    contextualMenuTarget.value = row;
    contextualMenu.value?.showMenu({ x: event.clientX, y: event.clientY });
    event.preventDefault();
  }

  function onRowDoubleClick(row: any) {
    emit('row-dblclick', row);
  }

  function canToggleRowSelection(row: any) {
    return props.selectable && (!props.selectableFilter || props.selectableFilter(row, 0));
  }

  function toggleRowSelection(row: any, selected?: boolean) {
    table.value?.toggleRowSelection(row, selected);
  }

  function onSettingsClick() {
    nextTick(() => columnSettingsPopper.value?.showSettings());
  }

  function onClearFilters() {
    filter.value = {};
    searchBarInput.value = '';
    onFilterChange();
  }

  function onSettingsExit() {
    setTimeout(() => (isSettingsPopperActive.value = false), 100);
  }

  function updateTableSort(sort: { prop: string; order: string }) {
    const { prop, order } = sort;
    table.value?.sort(prop, order);
  }

  function onSortChange(event: { prop: string; order: string }) {
    const { prop, order } = event;
    if (props.listKey) setSort({ list: props.listKey, value: { prop, order } });
    currentSort.value = { prop, order };
    emit('sort-change', event);
    setDefaultPage(1);
    columnSortedComponent.value = slots.default?.().find((c) => c.props?.columnKey === prop);
    onChange();
  }

  // Gestion des changements de visibilité
  const onColumnVisibilityChange = (column: string, value: boolean) => {
    columnVisibility.value[column] = value;
    setVisibility({
      column,
      value: value ? LIST_COLUMN_VISIBILITY.VISIBLE : LIST_COLUMN_VISIBILITY.INVISIBLE,
    });
  };

  function clearSelection() {
    table.value?.clearSelection();
  }

  function selectAll() {
    table.value?.toggleAllSelection();
  }

  function onSelectAllAcrossPages() {
    onSelectionChange(props.data || []);
  }

  function xPosActionBtn() {
    const posTab = table.value?.$el.getBoundingClientRect();
    return posTab ? window.innerWidth - posTab.right + 30 : 0;
  }

  function onChange(timeout = 50) {
    if (!onChangeDebouncer.value) {
      onChangeDebouncer.value = debounce(async () => {
        if (route && props.storeFiltersUrl) {
          const query = { ...route.query };
          let shouldChangeRoute = false;
          if (query.page) {
            if (currentPage.value === 1) {
              delete query.page;
              shouldChangeRoute = true;
            } else if (query.page.toString() !== currentPage.value.toString()) {
              query.page = currentPage.value.toString();
              shouldChangeRoute = true;
            }
          } else if (currentPage.value !== 1) {
            query.page = currentPage.value.toString();
            shouldChangeRoute = true;
          }
          if (shouldChangeRoute && router) await router.replace({ query }).catch(() => {});
        }
        const filters: Record<string, any> = {};
        for (const key of Object.keys(filter.value)) {
          filters[filterConfig.value[key].property] = {
            type: filterConfig.value[key].type,
            value: filter.value[key],
          };
        }
        emit('change', {
          page: currentPage.value,
          size: props.pageSize,
          sort: currentSort.value,
          q: searchBarInput.value || null,
          filters,
        });
      }, timeout);
    }
    if (onChangeDebouncer.value) {
      onChangeDebouncer.value();
    }
  }

  function onFilterChange() {
    if (!filterChangeDebouncer.value) {
      filterChangeDebouncer.value = debounce(
        async () => {
          emit('filter-change', JSON.parse(JSON.stringify(filter.value)));
          await onFilterOrSearchChange();
        },
        isRemoteData.value ? 800 : 250
      );
    }
    if (filterChangeDebouncer.value) {
      filterChangeDebouncer.value();
    }
  }

  function onSearchChange(search: string) {
    if (!searchChangeDebouncer.value) {
      searchChangeDebouncer.value = debounce(async () => {
        emit('search-change', search);
        await onFilterOrSearchChange();
      }, 250);
    }
    if (searchChangeDebouncer.value) {
      searchChangeDebouncer.value();
    }
  }

  async function onFilterOrSearchChange() {
    setDefaultPage(1);
    onChange(700);
    if (props.storeFiltersUrl) {
      await clearURLFilters();
      await setFiltersInUrl();
    }
  }

  function onExpandChange(row: any, expanded: boolean) {
    emit('expand-change', row, expanded);
  }

  function getFilterUrlKey(filterKey: string) {
    return `f_${filterKey}`;
  }

  function parseFiltersFromUrl() {
    const res: Record<string, any> = {};
    for (const key of Object.keys(filterConfig.value)) {
      const urlKey = getFilterUrlKey(key);
      if (route.query[urlKey]) {
        try {
          if (filterConfig.value[key].type === 'daterange') {
            const content = JSON.parse(route.query[urlKey] as string);
            res[key] = parseDateFilterValue(content);
          } else {
            res[key] = JSON.parse(route.query[urlKey] as string);
          }
        } catch (err) {
          console.error(`Could not parse filter key ${key}`);
        }
      }
    }
    return res;
  }

  function parseSearchInputFromUrl() {
    return route.query['list-search'] ? String(route.query['list-search']) : '';
  }

  function parsePageFromUrl() {
    return route.query.page ? parseInt(route.query.page as string, 10) : 1;
  }

  function parseDateFilterValue(content: any[]) {
    if (!content || content.length !== 2 || (content[0] === null && content[1] === null)) return [null, null];
    const res = [
      content[0] === null ? null : new Date(content[0]),
      content[1] === null ? null : new Date(content[1]),
    ];
    if ((res[0] && isNaN(res[0].getTime())) || (res[1] && isNaN(res[1].getTime())))
      throw new Error('Invalid date');
    return res;
  }

  async function clearURLFilters() {
    const query = { ...route.query };
    let hasChanged = false;
    for (const key of Object.keys(filterConfig.value)) {
      const urlKey = getFilterUrlKey(key);
      if (query[urlKey]) {
        delete query[urlKey];
        hasChanged = true;
      }
    }
    if (query['list-search']) {
      delete query['list-search'];
      hasChanged = true;
    }
    if (hasChanged && router) await router.replace({ query }).catch(() => {});
  }

  async function setFiltersInUrl() {
    const query = { ...route.query };
    let hasChanged = false;
    for (const key of Object.keys(filter.value)) {
      if (filter.value[key] !== null) {
        hasChanged = true;
        if (filterConfig.value[key].type === 'daterange') {
          const dates = [
            filter.value[key][0]?.toISOString().substring(0, 10),
            filter.value[key][1]?.toISOString().substring(0, 10),
          ];
          query[getFilterUrlKey(key)] = JSON.stringify(dates);
        } else {
          query[getFilterUrlKey(key)] = JSON.stringify(filter.value[key]);
        }
      }
    }
    if (!searchBarInput.value && query['list-search']) {
      delete query['list-search'];
      hasChanged = true;
    }
    if (searchBarInput.value && searchBarInput.value !== query['list-search']) {
      query['list-search'] = searchBarInput.value;
      hasChanged = true;
    }
    if (hasChanged && router) await router.replace({ query }).catch(() => {});
  }

  function generateFilterConfig() {
    const res = { ...props.extraFilterConfig };
    const slots = useSlots();
    if (slots.default) {
      const filterableColumns = slots.default().filter((c) => {
        const propsData = c.props;
        return propsData?.filterable !== false && propsData?.columnKey && propsData?.filterType;
      });
      for (const column of filterableColumns) {
        const propsData = column.props!;
        res[propsData.columnKey] = {
          type: propsData.filterType,
          property: propsData.filterProperty,
          label: propsData.filterLabel || i18n.global.t(propsData.columnKey),
        };
        if (propsData.filterFunction) res[propsData.columnKey].function = propsData.filterFunction;
        if (propsData.filterConfig) Object.assign(res[propsData.columnKey], propsData.filterConfig);
      }
    }
    return res;
  }

  function generateEditableColumnList() {
    const defaultSlot = slots.default ? slots.default() : [];
    if (props.hasConfigurableColumns && props.showTableHeader && defaultSlot.length > 0) {
      const columns = defaultSlot
        .filter((c) => c.props && (c.props['column-key'] || c.props.columnKey))
        .map((c) => initializeEditableColumn(c));
      return columns;
    }
    return [];
  }

  function initializeEditableColumn(columnComponent: any) {
    const key = columnComponent.props['column-key'] || columnComponent.props.columnKey;
    defaultVisibility.value[key] =
      columnComponent.props['column-default-visibility'] || LIST_COLUMN_VISIBILITY.VISIBLE;
    let visibility: boolean | null = null;
    if (props.listKey) {
      const fullKey = `${props.listKey}@${key}`;
      if (hasSavedVisibility(fullKey)) {
        visibility = isColumnVisible(fullKey);
      } else {
        visibility = defaultVisibility.value[key] !== LIST_COLUMN_VISIBILITY.INVISIBLE;
      }
      columnVisibility.value[fullKey] = visibility;
    }
    return { key, label: columnComponent.props.label || key };
  }

  function parseTableColumns() {
    if (!props.backendSortable || !slots.default) return;
    slots.default?.().forEach((c: any) => {
      if (c.type.name === 'u-list-column' && c.props?.sortable !== false) {
        (c.ref as any)?.setCustomSort?.(true);
      }
    });
  }
</script>

<style lang="scss">
  .el-table__empty-text {
    line-height: normal;
    p {
      margin: 15px 0 5px 0;
      color: var(--color-neutral-500);
    }
    img.empty_image {
      height: clamp(120px, 14vh, 200px);
    }
  }

  .u-list-wrapper .u-list-container .u-list.el-table--enable-row-hover.-cursor-pointer .el-table__body tr {
    cursor: pointer;
  }

  .u-list-wrapper {
    display: flex;
    position: relative;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    &.-show-table-header .el-loading-mask {
      top: 53px; // Fixed height to show header during loading
    }

    .el-loading-mask {
      background-color: var(--color-background-white);
    }
    .filter-fade-enter-active {
      transition: all 0.33s ease-in-out 0s;
    }

    .filter-fade-leave-active {
      transition: all 0.35s ease-in-out 0s;
    }

    .filter-fade-enter-active,
    .filter-fade-leave-active {
      transform: scaleY(1);
      max-height: 250px;
    }
    .filter-fade-enter,
    .filter-fade-leave-to {
      transform: scaleY(0);
      max-height: 0;
    }

    .u-list-row-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
      right: 20px;
      text-align: right;
      white-space: nowrap;
      & > :first-child {
        margin-left: 10px;
      }
      & > :last-child {
        margin-right: 10px;
      }
    }

    .header-wrapper {
      position: relative;
      transition: margin-bottom 0.25s ease-in-out 0.1s;
      &.-filter-active {
        transition: margin-bottom 0.18s ease-in-out 0.1s;
        margin-bottom: -75px;
      }
      &.-show-header-right {
        .header {
          .search-bar {
            max-width: 360px;
          }
        }
      }

      .header {
        display: flex;
        justify-content: space-between;
        z-index: 2;
        padding: 20px;
        width: 100%;
        gap: 12px;
        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
          .numbers-size {
            margin: 0;
            p {
              margin: 0;
            }
          }
        }
        .header-left {
          display: flex;
          flex-grow: 1;
          align-items: center;
          gap: 12px;

          .selection-count {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            padding: 0 12px;
            border-radius: 4px;
            font-size: var(--paragraph-03);
            color: var(--color-neutral-800);
            border: 1px solid var(--color-neutral-300);
            background: var(--color-neutral-50);

            &.-with-selection {
              font-weight: 700;
              color: var(--color-neutral-900);
              border: 1px solid var(--color-primary-500);
              background: var(--color-white);
            }
          }

          &.u-button {
            min-width: 135px;
            white-space: nowrap;
          }

          .search-bar {
            flex: 1;
            .main-input {
              padding-left: 0;
            }
            .filter-icon {
              display: flex;
              align-items: center;
              z-index: 2;
              border-radius: 0 3px 3px 0;
              background: var(--color-neutral-600);
              height: 100%;
              p {
                margin: 0;
                padding: 4px;
                color: var(--color-white);
                font-weight: 500;
              }
            }
          }
        }
      }
      .u-filter {
        position: relative;
        top: -77px;
        transform-origin: top center;
        z-index: 6;
      }
    }

    .u-list-container {
      position: relative;
      flex-grow: 1;
      overflow-y: hidden;

      .column-settings-button-wrapper {
        position: absolute;
        right: 0;
        z-index: 3;
        background-color: var(--color-neutral-100);
        padding: 13px;
        padding-right: 30px;
      }

      .u-list {
        display: flex;
        flex-direction: column;
        background: inherit;
        height: 100%;

        .cell {
          word-break: break-word;
          color: var(--color-neutral-800);
          font-size: var(--paragraph-03);
          span,
          div,
          strong,
          a {
            font-size: var(--paragraph-03);
          }
          &:has(.el-table__expand-icon) {
            overflow: initial;
          }
          .el-table__indent {
            display: block;
          }
          .el-table__placeholder {
            display: inline;
          }
        }

        .ascending {
          .caret-wrapper {
            right: 0;
            border: 1px solid var(--color-primary-500);
            border-radius: 50%;
            width: 18px;
            height: 18px;
            .sort-caret {
              border: solid 5px transparent;
            }
            .descending {
              display: none;
            }
            .ascending {
              top: 0;
              left: 3px;
              border-bottom-color: var(--color-primary-500);
            }
          }
        }

        .descending {
          .caret-wrapper {
            right: 0;
            border: 1px solid var(--color-primary-500);
            border-radius: 50%;
            width: 18px;
            height: 18px;
            .sort-caret {
              border: solid 5px transparent;
            }
            .ascending {
              display: none;
            }
            .descending {
              bottom: 0;
              left: 3px;
              border-top-color: var(--color-primary-500);
            }
          }
        }

        .caret-wrapper {
          right: 3px;
          flex-shrink: 0;
          margin-left: 6px;
          width: 18px;
          height: 40px;
        }

        .sort-caret {
          pointer-events: none;

          &.ascending {
            top: 10px;
            border-bottom-color: var(--color-neutral-300);
          }

          &.descending {
            bottom: 8px;
            border-top-color: var(--color-neutral-300);
          }
        }

        &.el-table--enable-row-hover {
          .el-table__header-wrapper {
            .el-table__header {
              min-height: 57px;
            }
            .el-checkbox__inner {
              border-color: var(--color-neutral-500);
            }
            .cell {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0;
              color: var(--color-neutral-800);
            }
          }

          .el-table__body {
            tr {
              td {
                transition: none;
                height: 48px;
              }
            }
          }
          .el-table__body-wrapper {
            flex: 1;
            overflow-y: auto;
          }
        }

        &.el-table {
          &::before {
            background-color: var(--color-white);
          }

          tr {
            background: transparent;
          }

          th {
            border-bottom: 1px solid var(--color-neutral-300);
            background: var(--color-neutral-100);
          }

          .el-table__body {
            overflow: hidden;
            td {
              border-bottom: 1px solid var(--color-neutral-300);
              background: var(--color-white);
              &.el-table__expanded-cell {
                background: var(--color-neutral-100);
                &:hover {
                  background: var(--color-neutral-100) !important;
                }
              }

              .el-table__expand-icon {
                & > i {
                  font-size: var(--paragraph-01);
                  font-weight: bold;
                }
              }
            }

            tr {
              &:hover {
                & > td {
                  background-color: var(--color-neutral-100);
                }
              }
              &.color-hover {
                & > td {
                  background-color: var(--color-neutral-100);
                }
              }
            }
            .el-table__row--level-1:not(.color-hover) {
              background-color: var(--color-neutral-100);
              td {
                background-color: var(--color-neutral-100);
              }
            }
          }
        }

        .el-checkbox {
          margin: 0;
        }
        th {
          .el-checkbox {
            margin-left: 3px;
          }
        }
        th,
        td {
          &:first-child {
            .cell {
              padding-left: 20px;
            }
          }
        }
      }
    }
  }

  .selection-summary {
    display: flex;
    flex-direction: column;

    .selection-summary-item {
      display: flex;
      align-items: center;
      gap: 16px;

      &:not(:first-child) {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid var(--color-neutral-300);
      }

      .delete-selection-button {
        margin-left: auto;
        height: 30px;
        width: 30px;
        min-height: 30px;
        min-width: 30px;
        padding: 0;
      }
    }
  }
</style>
