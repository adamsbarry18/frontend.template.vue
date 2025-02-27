import UListSelectionActions from '@/commons/data/UListSelectionActions.vue';
import { ref } from 'vue';
import { action } from '@storybook/addon-actions';

export default {
  title: 'data/ListSelectionActions',
  component: UListSelectionActions,
};

export const ListSelectionActions = () => ({
  components: { UListSelectionActions },
  template: `
  <div style="display: flex; flex-direction: column; gap: 40px; padding: 20px;">
    <!-- Case 1: All Items Selected -->
    <section>
      <h3>All Items Selected</h3>
      <u-list-selection-actions
        v-model="selectionAll"
        :selection="selectionAll"
        :paginatedData="paginatedData"
        :data="data"
        :actions="actions"
        @clear-all="handleClearAll"
        @check-all="handleCheckAll"
        @select-all-across-pages="handleSelectAllAcrossPages"
      />
      <p>Selected: {{ selectionAll }}</p>
    </section>

    <!-- Case 2: Partial Selection -->
    <section>
      <h3>Partial Selection</h3>
      <u-list-selection-actions
        v-model="selectionPartial"
        :selection="selectionPartial"
        :paginatedData="paginatedData"
        :data="data"
        :actions="actions"
        @clear-all="handleClearAll"
        @check-all="handleCheckAll"
        @select-all-across-pages="handleSelectAllAcrossPages"
      />
      <p>Selected: {{ selectionPartial }}</p>
    </section>

    <!-- Case 3: Page Selection Only -->
    <section>
      <h3>Page Selection Only (Select All Across Pages Enabled)</h3>
      <u-list-selection-actions
        v-model="selectionPageOnly"
        :selection="selectionPageOnly"
        :paginatedData="paginatedData"
        :data="data"
        :actions="actions"
        :selectAllAcrossPages="true"
        @clear-all="handleClearAll"
        @check-all="handleCheckAll"
        @select-all-across-pages="handleSelectAllAcrossPages"
      />
      <p>Selected: {{ selectionPageOnly }}</p>
    </section>
  </div>
`,
  setup() {
    // Full dataset (all items)
    const data = ref(['item1', 'item2', 'item3', 'item4', 'item5', 'item6']);
    // Paginated data (current page)
    const paginatedData = ref(['item1', 'item2', 'item3', 'item4']);

    // Case 1: All items are selected (i.e. selection equals full data)
    const selectionAll = ref([...data.value]);

    // Case 2: Partial selection (some items selected)
    const selectionPartial = ref(['item1', 'item2']);

    // Case 3: Page selection only (selected items equal paginated data, but not full data)
    const selectionPageOnly = ref([...paginatedData.value]);

    // Sample actions array for the selection actions toolbar
    const actions = ref([
      {
        id: 'edit',
        label: 'Edit',
        icon: 'icon-edit',
        multiTarget: true,
        onClick: (target: any, event: MouseEvent) => {
          action('edit')(target, event);
        },
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: 'icon-delete',
        multiTarget: false,
        onClick: (target: any, event: MouseEvent) => {
          action('delete')(target, event);
        },
      },
    ]);

    // Handlers for emitted events
    const handleClearAll = action('clear-all');
    const handleCheckAll = action('check-all');
    const handleSelectAllAcrossPages = action('select-all-across-pages');

    return {
      data,
      paginatedData,
      selectionAll,
      selectionPartial,
      selectionPageOnly,
      actions,
      handleClearAll,
      handleCheckAll,
      handleSelectAllAcrossPages,
    };
  },
});
