import UList from '@/modules/common/data/UList.vue';
import UListColumn from '@/modules/common/data/UListColumn.vue';
import UButton from '@/modules/common/basic/UButton.vue';
import { listActions, listData } from '../_data/list';
import { action } from '@storybook/addon-actions';

export default {
  title: 'data/List',
  component: UList,
};

export const CompleteUsage = () => ({
  components: { UList, UListColumn, UButton },
  template: `
  <u-list
    list-key="complet_list"
    :data="listData"
    :list-actions="listActions"
    selectable
    reserve-selection
    show-pagination
    :page-size="5"
    has-border
    show-selection-summary
    :sort-options="sortOptions"
    :default-sort="defaultSort"
    @selection-change="handleSelectionChange"
    @change="handleTableChange"
  >

    <!-- Actions globales dans l'en-tête -->
    <template #header-right>
      <div>
        <u-button type="primary" icon="icon-add" @click="addUser">
          Ajouter
        </u-button>
      </div>
    </template>

    <!-- Définition des colonnes -->
    <u-list-column
      column-key="column_name"
      column-default-visibility="always"
      label="Nom"
      sortable
      sort-prop="name"
    >
      <template #default="{ row }">
        <span>{{ row.name }}</span>
      </template>
    </u-list-column>
    <u-list-column
      column-key="column_active"
      column-default-visibility="visible"
      label="Active"
      sortable
      sort-prop="active"
    >
      <template #default="{ row }">
        <span>{{ row.active }}</span>
      </template>
    </u-list-column>
    <u-list-column
      column-key="column_cr"
      column-default-visibility="visible"
      label="% CR"
      sortable
      sort-prop="cgPercent"
    >
      <template #default="{ row }">
        <span>{{ row.cgPercent }}%</span>
      </template>
    </u-list-column>
    <u-list-column
      column-key="column_creation"
      column-default-visibility="invisible"
      label="Création"
      sortable
      sort-prop="created_at"
    >
      <template #default="{ row }">
        <span>{{ $d(row.created_at, 'middle') }} - <b>{{ row.created_by }}</b></span>
      </template>
    </u-list-column>
    <u-list-column
      column-key="column_update"
      column-default-visibility="invisible"
      label="Update"
      sortable
      sort-prop="updated_at"
    >
      <template #default="{ row }">
        <span>{{ $d(row.updated_at, 'middle') }} - <b>{{ row.updated_by }}</b></span>
      </template>
    </u-list-column>

    <!-- Slot d'actions pour chaque ligne -->
    <template #action="{ row }">
      <u-button type="primary" icon="icon-user" @click="alertRow(row)" />
      <u-button type="primary" icon="icon-connect" />
      <u-button type="warning" icon="icon-activate" />
    </template>

    <!-- Slot de résumé de sélection -->
    <template #selection="{ row }">
      <span>{{ row.name }} sélectionné</span>
    </template>
  </u-list>
`,
  setup() {
    const handleSelectionChange = (...args) => {
      action('selection-change')(...args);
    };
    const handleTableChange = (ctx) => {
      action('change')(ctx);
    };
    const alertRow = (row) => window.alert(JSON.stringify(row));
    const addUser = () => window.alert('Ajouter un utilisateur');
    const sortOptions = [
      { label: 'Nom A-Z', prop: 'name', order: 'ascending' },
      { label: 'Nom Z-A', prop: 'name', order: 'descending' },
      { label: 'Création récent', prop: 'created_at', order: 'descending' },
      { label: 'Création ancien', prop: 'created_at', order: 'ascending' },
    ];
    const defaultSort = { prop: 'name', order: 'ascending' };

    return {
      listActions,
      listData,
      handleSelectionChange,
      handleTableChange,
      alertRow,
      addUser,
      sortOptions,
      defaultSort,
    };
  },
});
