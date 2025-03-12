<template>
  <div
    class="u-list-wrapper"
    :class="{ '-show-table-header': showTableHeader }"
  >
    <u-shortcut-subscriber
      v-if="filterPanelActive"
      @shortcut-trigger="onShortcutEscapeFilters"
    />
    <div
      v-if="showHeader"
      class="header-wrapper"
      :class="{
        '-filter-active': filterPanelActive,
        '-show-header-right': showHeaderRight,
      }"
    >
      <div class="header">
        <div class="header-left">
          <div
            v-if="selectable && showSelectionSummary"
            class="selection-count"
            :class="{ '-with-selection': selection.length > 0 }"
          >
            {{
              $te(entitySelectedLabelKey)
                ? $t(entitySelectedLabelKey, {
                    count: selection.length,
                  })
                : $t('commons.list-selected-entities-count', {
                    count: selection.length,
                  })
            }}
            <u-info
              v-if="selection.length > 0"
              placement="bottom"
              tooltip-class="selection-summary"
            >
              <div
                v-for="(item, index) in selection"
                :key="index"
                class="selection-summary-item"
              >
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
            :datu-nav="dataNavInput"
            :placeholder="$t('commons.searchbar.default-list')"
            icon-color="var(--color-neutral-700)"
            icon-position="left"
            clear
            @change="onSearchChange"
          >
            <button
              v-if="hasAvailableFilters"
              slot="suffix"
              class="filter-icon"
              @click="filterPanelActive = true"
            >
              <icon-base
                icon="icon-filter"
                :size="22"
                color="var(--color-white)"
              />
              <p>{{ $t('commons.list.filters') }}</p>
              <u-filter-resume
                v-if="filterCount > 0"
                slot="suffix"
                :filter-config="filterConfig"
                :active-filter="filter"
                @clear-filters="onClearFilters"
              />
            </button>
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
            <icon-base
              :icon="entityIcon"
              :size="26"
              color="white"
              class="count-icon"
            />
            <p>
              {{
                $te(entityLabelKey)
                  ? $t(entityLabelKey, {
                      count: formattedListCount,
                    })
                  : $t('commons.list-entities-count', {
                      count: formattedListCount,
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
          :datu-count="currentTotal"
          :search.sync="searchBarInput"
          :config="filterConfig"
          @collapse="filterPanelActive = false"
          @change="onFilterChange"
        />
      </transition>
    </div>
    <div class="u-list-container">
      <u-contextual-menu
        ref="contextualMenu"
        :list="scopedContextualMenuItems"
      />
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
      <u-shortcut-subscriber
        v-if="selection.length > 0"
        @shortcut-trigger="onShortcutEscapeSelection"
      />
      <div
        v-if="hasConfigurableColumns && showTableHeader"
        v-show="editableColumns.length > 0"
        class="column-settings-button-wrapper"
      >
        <icon-base
          v-if="editableColumns.length > 0"
          ref="settingsButton"
          icon="icon-settings"
          class="column-settings-button -button-like"
          :color="
            isSettingsPopperActive
              ? 'var(--color-neutral-800)'
              : 'var(--color-neutral-700)'
          "
          :size="24"
          @click.native="onSettingsClick"
        />
      </div>
      <u-list-column-settings
        v-if="hasConfigurableColumns && showTableHeader"
        ref="columnSettingsPopper"
        :columns="editableColumns"
        :defaults="defaultVisibility"
        @hide="onSettingsExit"
        @column-visibility-change="onColumnVisibilityChange"
      />
      <el-table
        ref="table"
        :data="displayedData"
        :default-sort="savedDefaultSort"
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
        @wheel.native="onScroll"
        @cell-mouse-enter="onCellHover"
      >
        <div slot="empty">
          <div v-if="loading || !isMounted" />
          <slot
            v-else-if="filterCount === 0 && searchBarInput === ''"
            name="empty"
          >
            <img
              class="empty_image"
              src="@/assets/images/svg/list_empty.svg"
              alt=""
            />
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
        </div>
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
          v-if="
            hasConfigurableColumns &&
            showTableHeader &&
            editableColumns.length > 0
          "
          width="55"
        >
          <div slot="header" class="column-settings" />
        </el-table-column>
        <slot slot="append" name="append" />
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
      @mouseleave.native="onLeaveRowButtons"
    >
      <div v-if="currentRowHover !== null" class="u-list-row-buttons">
        <slot name="action" :row="currentRowHover" />
      </div>
    </u-list-row-buttons>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
    provide,
    useSlots,
    PropType,
  } from 'vue';
  import { v4 as uuidv4 } from 'uuid';
  import UContextualMenu from '@/commons/navigation/UContextualMenu.vue';
  import UFilter from '@/commons/filter/UFilter.vue';
  import UFilterResume from '@/commons/filter/UFilterResume.vue';
  import USearchBar from '@/commons/others/USearchBar.vue';
  import UButton from '@/commons/basic/UButton.vue';
  import UListColumnSettings from '@/commons/data/UListColumnSettings.vue';
  import UListPagination from '@/commons/data/UListPagination.vue';
  import UShortcutSubscriber from '@/commons/others/UShortcutSubscriber.vue';
  import USelectGroup from '@/commons/forms/USelectGroup.vue';
  import UInfo from '@/commons/others/UInfo.vue';
  import IconBase from '../icons/IconBase.vue';
  import { applyFiltersToList } from '@/libs/utils/Filter';
  import { debounce } from '@/libs/utils/Debounce';
  import { orderBy } from '../../libs/utils/Sort';
  import { ElTable, ElTableColumn, TreeNode } from 'element-plus';
  import UListRowButtons from './UListRowButtons.vue';
  import UListSelectionActions from './UListSelectionActions.vue';
  import {
    setSort,
    getListSort,
    hasSavedSort,
    setVisibility,
    isColumnVisible,
    hasSavedVisibility,
    LIST_COLUMN_VISIBILITY,
  } from '../../libs/utils/List';
  import i18n from '@/i18n';
  import { useRoute, useRouter } from 'vue-router';

  // Définir les props
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
    listKey: { type: String, default: '' },
    rowKey: { type: String, default: 'id' },
    height: { type: String },
    listActions: { type: Array, default: () => [] },
    searchFunction: {
      type: Function,
      default: (row, searchInput = '') => {
        if (!row.name) return true;
        return row.name.toLowerCase().includes(searchInput.toLowerCase());
      },
    },
    defaultSort: { type: Object, default: () => ({}) },
    sortOptions: {
      type: Array<{ label: string; prop: string; order: string }>,
      default: () => [],
      validator: (options: { label: string; prop: string; order: string }[]) =>
        options.every(
          (o) =>
            o.label && o.prop && ['ascending', 'descending'].includes(o.order)
        ),
    },
    load: {
      type: Function as PropType<
        (row: any, treeNode: TreeNode, resolve: (data: any[]) => void) => void
      >,
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

  // Définir les événements émis
  const emits = defineEmits([
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

  // Références
  const contextualMenu = ref(null);
  const table = ref(null);
  const settingsButton = ref(null);
  const columnSettingsPopper = ref(null);

  // État réactif
  const contextualMenuTarget = ref(null);
  const editableColumns = ref([]);
  const selection = ref([]);
  const defaultVisibility = ref({});
  const columnVisibility = ref({});
  const filter = ref({});
  const filterConfig = ref({});
  const currentSort = ref(null);
  const columnSortedComponent = ref(null);
  const isSettingsPopperActive = ref(false);
  const filterPanelActive = ref(false);
  const rightClickEvent = ref(null);
  const searchBarInput = ref('');
  const filterChangeDebouncer = ref(null);
  const searchChangeDebouncer = ref(null);
  const onChangeDebouncer = ref(null);
  interface Position {
    top: number;
    bottom: number;
    left: number;
    right: number;
  }
  const hoverElementPosition = ref<Partial<Position>>({});
  const currentRowHover = ref(null);
  const oldRowNodeHover = ref(null);
  const rowButtonsVisible = ref(false);
  const isScrolling = ref(false);
  const scrollingTimeout = ref(null);
  const isMounted = ref(false);
  const currentPage = ref(1);
  const defaultPage = ref(1);
  const paginationKey = ref('defaultPaginationKey');

  // Fournir des données aux composants enfants
  provide('listKey', props.listKey);
  provide('columnVisibility', columnVisibility);

  // Accès au routeur
  const route = useRoute();
  const router = useRouter();

  // Propriétés calculées
  const savedDefaultSort = computed(() => {
    if (props.listKey && hasSavedSort(props.listKey)) {
      const sort = getListSort(props.listKey);
      // Ensure the order is explicitly 'ascending' or 'descending'
      if (
        sort &&
        sort.order &&
        sort.order !== 'ascending' &&
        sort.order !== 'descending'
      ) {
        sort.order = sort.order === 'asc' ? 'ascending' : 'descending';
      }
      return sort as { prop: string; order: 'ascending' | 'descending' };
    }
    return props.defaultSort as {
      prop: string;
      order: 'ascending' | 'descending';
    };
  });

  const filteredData = computed(() => {
    if (!isMounted.value) return [];
    const res = props.searchFunction
      ? props.data.filter((a) => props.searchFunction(a, searchBarInput.value))
      : props.data;
    return applyFiltersToList(res, filter.value, filterConfig.value);
  });

  const isRemoteData = computed(() => props.total > 0);

  const paginatedData = computed(() => {
    if (isRemoteData.value && props.data?.length) return props.data;
    if (filteredData.value?.length) {
      const sort = currentSort.value;
      if (sort && columnSortedComponent.value) {
        return orderBy(
          filteredData.value,
          sort.prop,
          sort.order,
          columnSortedComponent.value.sortMethod,
          columnSortedComponent.value.sortBy
        ).slice(
          (currentPage.value - 1) * props.pageSize,
          currentPage.value * props.pageSize
        );
      }
      return filteredData.value.slice(
        (currentPage.value - 1) * props.pageSize,
        currentPage.value * props.pageSize
      );
    }
    return [];
  });

  const displayedData = computed(() =>
    props.showPagination ? paginatedData.value : filteredData.value
  );
  const currentTotal = computed(() => props.total || filteredData.value.length);
  const pageCount = computed(() =>
    Math.ceil(currentTotal.value / props.pageSize)
  );
  const filterCount = computed(() => Object.keys(filter.value).length);

  const formattedListCount = computed(() => {
    if (props.total) return currentTotal.value;
    if (filterCount.value !== 0 || searchBarInput.value !== '') {
      return `${filteredData.value.length} / ${props.data.length}`;
    }
    return filteredData.value.length;
  });

  const hasAvailableFilters = computed(
    () => Object.keys(filterConfig.value).length > 0
  );

  const scopedContextualMenuItems = computed(() =>
    props.listActions
      .filter(
        (i: any) =>
          !i.hasOwnProperty('filterFunc') ||
          (contextualMenuTarget.value &&
            i.filterFunc?.(contextualMenuTarget.value))
      )
      .map((i) => getScopedContextualMenuItem(i))
  );

  const showHeaderRight = computed(
    () => props.showCounts && !props.showPagination
  );

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

  // Méthodes
  function onShortcutEscapeFilters() {
    filterPanelActive.value = false;
  }

  function onShortcutEscapeSelection() {
    clearSelection();
  }

  function onScroll(evt) {
    emits('scroll');
    if (evt.deltaY > 0) checkScrolledToBottom();
    rowButtonsVisible.value = false;
    contextualMenu.value.show = false;
    isScrolling.value = true;
    clearTimeout(scrollingTimeout.value);
    scrollingTimeout.value = setTimeout(() => (isScrolling.value = false), 150);
  }

  function checkScrolledToBottom() {
    const tableWrapperEl = table.value.$el.querySelector(
      'div.el-table__body-wrapper'
    );
    const BOTTOM_OFFSET = 150;
    if (
      tableWrapperEl &&
      tableWrapperEl.scrollTop + BOTTOM_OFFSET >
        tableWrapperEl.scrollHeight - tableWrapperEl.offsetHeight
    ) {
      emits('scrolled-to-bottom');
    }
  }

  function setDefaultPage(page) {
    defaultPage.value = page;
    currentPage.value = page;
    paginationKey.value = uuidv4();
  }

  function onLeaveRowButtons(event) {
    if (
      !event.relatedTarget?.classList.contains('u-list-row-buttons') &&
      event.relatedTarget?.tagName !== 'TD'
    ) {
      rowButtonsVisible.value = false;
      if (oldRowNodeHover.value)
        oldRowNodeHover.value.classList.remove('color-hover');
    }
  }

  function rowClassNameWrapper({ row, rowIndex }) {
    let res = 'u-list-row';
    if (props.rowClassName) res += ` ${props.rowClassName(row, rowIndex)}`;
    return res;
  }

  function onCellHover(row, column, cell) {
    if (oldRowNodeHover.value && cell.parentNode !== oldRowNodeHover.value) {
      oldRowNodeHover.value.classList.remove('color-hover');
      rowButtonsVisible.value = false;
    }
    if (!isScrolling.value) showRowButtons(row, cell.parentNode);
  }

  function showRowButtons(row, rowElement) {
    currentRowHover.value = row;
    oldRowNodeHover.value = rowElement;
    oldRowNodeHover.value.classList.add('color-hover');
    const posTab = table.value.$refs.bodyWrapper.getBoundingClientRect();
    hoverElementPosition.value = oldRowNodeHover.value.getBoundingClientRect();
    rowButtonsVisible.value =
      Math.trunc(hoverElementPosition.value.top) >= Math.trunc(posTab.top) &&
      Math.trunc(hoverElementPosition.value.bottom) <=
        Math.trunc(posTab.bottom);
  }

  function getScopedContextualMenuItem(item) {
    const res: any = {};
    if (item.icon) res.icon = item.icon;
    if (item.label) res.label = item.label;
    if (item.onClick) {
      res.onClick = item.multiTarget
        ? () =>
            item.onClick([contextualMenuTarget.value], rightClickEvent.value)
        : () => item.onClick(contextualMenuTarget.value, rightClickEvent.value);
    }
    if (item.children)
      res.children = item.children.map((child) =>
        getScopedContextualMenuItem(child)
      );
    return res;
  }

  function onSelectionChange(selectionArray) {
    selection.value = [...selectionArray];
    emits('selection-change', selection.value);
  }

  function onRowClick(row, column, event) {
    let rowNode = event.target;
    while (rowNode && !rowNode.classList?.contains('u-list-row'))
      rowNode = rowNode.parentNode;
    if (rowNode) showRowButtons(row, rowNode);
    if (canToggleRowSelection(row)) toggleRowSelection(row, true);
    emits('row-click', row);
  }

  function onRowRightClick(row, col, $event) {
    if ($event.target.matches('.u-list-row-buttons, .u-list-row-buttons *'))
      return;
    if (scopedContextualMenuItems.value.length > 0) {
      if (canToggleRowSelection(row)) {
        clearSelection();
        toggleRowSelection(row, true);
      }
      rightClickEvent.value = $event;
      openContextualMenu(row, $event);
    }
    emits('row-rightclick', row, $event);
  }

  function onPaginationPageChange(page) {
    currentPage.value = page;
    onChange();
  }

  function openContextualMenu(row, event) {
    contextualMenuTarget.value = row;
    contextualMenu.value.showMenu({ x: event.clientX, y: event.clientY });
    event.preventDefault();
  }

  function onRowDoubleClick(row) {
    emits('row-dblclick', row);
  }

  function canToggleRowSelection(row) {
    const rowIndex = displayedData.value.indexOf(row);
    return (
      props.selectable &&
      (!props.selectableFilter || props.selectableFilter(row, rowIndex))
    );
  }

  function toggleRowSelection(row, selected) {
    table.value.toggleRowSelection(row, selected);
  }

  function onSettingsClick() {
    if (!isSettingsPopperActive.value) {
      isSettingsPopperActive.value = true;
      columnSettingsPopper.value.showSettings(settingsButton.value.$el);
    }
  }

  function onClearFilters() {
    filter.value = {};
    searchBarInput.value = '';
    onFilterChange();
  }

  function onSettingsExit() {
    setTimeout(() => (isSettingsPopperActive.value = false), 100);
  }

  function updateTableSort(sort) {
    const { prop, order } = sort;
    if (typeof table.value?.sort === 'function') table.value.sort(prop, order);
  }

  function onSortChange(event) {
    const { prop, order } = event;
    if (props.listKey) setSort({ list: props.listKey, value: { prop, order } });
    currentSort.value = { prop, order };
    emits('sort-change', event);
    setDefaultPage(1);
    columnSortedComponent.value = useSlots()
      .default()
      .find((c) => c.props?.columnKey === prop);
    onChange();
  }

  function onColumnVisibilityChange(column, value) {
    columnVisibility.value[column] = value;
    setVisibility({ column, value });
  }

  function clearSelection() {
    table.value.clearSelection();
  }

  function selectAll() {
    table.value.toggleAllSelection();
  }

  function onSelectAllAcrossPages() {
    onSelectionChange(props.data);
  }

  function xPosActionBtn() {
    if (table.value) {
      const posTab = table.value.$el.getBoundingClientRect();
      return window.innerWidth - posTab.right + 30;
    }
    return 0;
  }

  function onChange(timeout = 50) {
    if (!onChangeDebouncer.value) {
      onChangeDebouncer.value = debounce(async () => {
        if (route && props.storeFiltersUrl) {
          const query = { ...(route.query || {}) };
          let shouldChangeRoute = false;
          if (query.hasOwnProperty('page')) {
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
          if (shouldChangeRoute) router.replace({ query });
        }
        const filters = {};
        for (const key of Object.keys(filter.value)) {
          filters[filterConfig.value[key].property] = {
            type: filterConfig.value[key].type,
            value: filter.value[key],
          };
        }
        const ctx = {
          page: currentPage.value,
          size: props.pageSize,
          sort: currentSort.value,
          q: searchBarInput.value || null,
          filters: { ...filters },
        };
        emits('change', ctx);
      }, timeout);
    }
    onChangeDebouncer.value();
  }

  function onFilterChange() {
    if (!filterChangeDebouncer.value) {
      filterChangeDebouncer.value = debounce(
        async () => {
          emits('filter-change', JSON.parse(JSON.stringify(filter.value)));
          await onFilterOrSearchChange();
        },
        isRemoteData.value ? 800 : 250
      );
    }
    filterChangeDebouncer.value();
  }

  function onSearchChange(search) {
    if (!searchChangeDebouncer.value) {
      searchChangeDebouncer.value = debounce(async () => {
        emits('search-change', search);
        await onFilterOrSearchChange();
      }, 250);
    }
    searchChangeDebouncer.value();
  }

  async function onFilterOrSearchChange() {
    setDefaultPage(1);
    onChange(700);
    if (props.storeFiltersUrl) {
      await clearURLFilters();
      await setFiltersInUrl();
    }
  }

  function onExpandChange(row, expanded) {
    emits('expand-change', row, expanded);
  }

  function getFilterUrlKey(filterKey) {
    return `f_${filterKey}`;
  }

  function parseFiltersFromUrl() {
    const res = {};
    for (const key of Object.keys(filterConfig.value)) {
      if (route.query.hasOwnProperty(getFilterUrlKey(key))) {
        try {
          if (filterConfig.value[key].type === 'daterange') {
            const queryParam = route.query[getFilterUrlKey(key)];
            const content = JSON.parse(
              Array.isArray(queryParam) ? queryParam[0] : queryParam
            );
            res[key] = parseDateFilterValue(content);
          } else {
            const queryParam = route.query[getFilterUrlKey(key)];
            res[key] = JSON.parse(
              Array.isArray(queryParam) ? queryParam[0] : queryParam
            );
          }
        } catch (err) {
          console.error(`Could not parse filter key ${key}`);
        }
      }
    }
    return res;
  }

  function parseSearchInputFromUrl() {
    return route?.query?.hasOwnProperty('list-search')
      ? String(route.query['list-search'])
      : '';
  }

  function parsePageFromUrl() {
    return route?.query?.hasOwnProperty('page')
      ? parseInt(
          Array.isArray(route.query.page)
            ? route.query.page[0]
            : route.query.page,
          10
        )
      : 1;
  }

  function parseDateFilterValue(content) {
    let res = null;
    if (
      !content ||
      content.length !== 2 ||
      (content[0] === null && content[1] === null)
    ) {
      res = [null, null];
    } else if (content[0] === null) {
      res = [null, new Date(content[1])];
    } else if (content[1] === null) {
      res = [new Date(content[0]), null];
    } else {
      res = [new Date(content[0]), new Date(content[1])];
    }
    if (
      (res[0] !== null && isNaN(res[0].getTime())) ||
      (res[1] !== null && isNaN(res[1].getTime()))
    ) {
      throw new Error('Invalid date');
    }
    return res;
  }

  async function clearURLFilters() {
    const query = { ...route?.query };
    let hasChanged = false;
    for (const key of Object.keys(filterConfig.value)) {
      if (query.hasOwnProperty(getFilterUrlKey(key))) {
        delete query[getFilterUrlKey(key)];
        hasChanged = true;
      }
    }
    if (query['list-search']) {
      hasChanged = true;
      delete query['list-search'];
    }
    if (hasChanged && router) await router.replace({ query }).catch(() => {});
  }

  async function setFiltersInUrl() {
    const query = { ...route?.query };
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
      hasChanged = true;
      delete query['list-search'];
    }
    if (searchBarInput.value && searchBarInput.value !== query['list-search']) {
      hasChanged = true;
      query['list-search'] = searchBarInput.value;
    }
    if (hasChanged && router) await router.replace({ query }).catch(() => {});
  }

  function generateFilterConfig() {
    const res = { ...props.extraFilterConfig };
    const slots = useSlots();
    if (slots && slots.default) {
      const filterableColumns = slots.default().filter((c) => {
        if (!c.props || !c.props.columnKey || !c.props.filterType) return false;
        return c.props.filterable !== false;
      });
      for (const column of filterableColumns) {
        res[column.props.columnKey] = {
          type: column.props.filterType,
          property: column.props.filterProperty,
          label: column.props.filterLabel
            ? column.props.filterLabel
            : i18n.global.t(column.props.columnKey),
        };
        if (column.props.filterFunction)
          res[column.props.columnKey].function = column.props.filterFunction;
        if (column.props.filterConfig)
          Object.assign(res[column.props.columnKey], column.props.filterConfig);
      }
    }
    return res;
  }

  function generateEditableColumnList() {
    const slots = useSlots();
    if (
      slots &&
      slots.default &&
      props.hasConfigurableColumns &&
      props.showTableHeader
    ) {
      return slots
        .default()
        .filter((c) => c.props && c.props.columnKey)
        .map((c) => initializeEditableColumn(c));
    }
    return [];
  }

  function initializeEditableColumn(columnComponent) {
    let visibility = null;
    const key = columnComponent.props.columnKey;
    defaultVisibility.value[key] =
      columnComponent.props.columnDefaultVisibility || 'visible';
    if (props.listKey) {
      if (hasSavedVisibility(`${props.listKey}@${key}`)) {
        visibility = isColumnVisible(`${props.listKey}@${key}`);
      } else {
        visibility =
          defaultVisibility.value[key] !== LIST_COLUMN_VISIBILITY.INVISIBLE;
        setVisibility({ column: `${props.listKey}@${key}`, value: visibility });
      }
      columnVisibility.value[`${props.listKey}@${key}`] = visibility;
    }
    return { key, label: columnComponent.props.label ?? key };
  }

  function parseTableColumns() {
    const slots = useSlots();
    if (slots && slots.default && props.backendSortable) {
      for (const column of slots.default()) {
        if (
          column.type &&
          typeof column.type === 'object' &&
          'name' in column.type &&
          column.type.name === 'UListColumn' &&
          column.props.sortable !== false
        ) {
          column.props.customSort = true;
        }
      }
    }
  }

  // Hooks de cycle de vie
  onMounted(() => {
    parseTableColumns();
    const tableWrapper = table.value.$refs.bodyWrapper;
    tableWrapper?.addEventListener('mouseleave', (event) => {
      if (
        !event.relatedTarget?.classList.contains('u-list-row-buttons') &&
        !['button', 'svg', 'path', 'td'].includes(
          event.relatedTarget?.nodeName.toLowerCase()
        )
      ) {
        rowButtonsVisible.value = false;
        if (oldRowNodeHover.value)
          oldRowNodeHover.value.classList.remove('color-hover');
      }
    });
    editableColumns.value = generateEditableColumnList();
    filterConfig.value = generateFilterConfig();
    filter.value = parseFiltersFromUrl();
    searchBarInput.value = parseSearchInputFromUrl();
    emits('filter-change', filter.value);
    const sort = currentSort.value || savedDefaultSort.value;
    if (sort) updateTableSort(sort);
    setTimeout(() => {
      isMounted.value = true;
      setDefaultPage(parsePageFromUrl() || 1);
      onChange();
    }, 50);
  });

  onBeforeUnmount(() => {
    const tableWrapper = table.value.$refs.bodyWrapper;
    tableWrapper?.removeEventListener('mouseleave');
  });
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

  .u-list-wrapper
    .u-list-container
    .u-list.el-table--enable-row-hover.-cursor-pointer
    .el-table__body
    tr {
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
      right: 0;
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
        gap: 12px;
        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
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
            height: 100%;
            .main-input {
              padding-left: 0;
            }
            .filter-icon {
              display: flex;
              align-items: center;
              z-index: 2;
              border-radius: 0 3px 3px 0;
              background: var(--color-neutral-600);
              padding: 0 10px;
              height: 100%;
              p {
                margin: 1px 0 0 6px;
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
