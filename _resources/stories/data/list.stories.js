import UList from '@/modules/common/data/UList.vue';
import UListColumn from '@/modules/common/data/UListColumn.vue';
import UButton from '@/modules/common/basic/UButton.vue';
import { listActions, listData } from '../_data/list';
import { action } from '@storybook/addon-actions';

export default {
  title: 'data/List',
  component: UList,
};

export const ListWithBorder = () => ({
  components: { UList, UListColumn, UButton },
  template: `
  <u-list
    list-key="listkey"
    :data="listData"
    :list-actions="listActions"
    :page-size="5"
    show-pagination
    selectable
    has-border
    @selection-change="handleSelectionChange"
  >
    <u-list-column label="Nom" column-default-visibility="invisible" sortable sort-prop="name">
      <template #default="{ row }">
        <span>{{ row.name }}</span>
      </template>
    </u-list-column>
    <u-list-column label="Actions" sortable sort-prop="actions">
      <template #default="{ row }">
        <span>{{ row.actions }} i</span>
      </template>
    </u-list-column>
    <u-list-column label="Active" sortable sort-prop="active">
      <template #default="{ row }">
        <span>{{ row.active }}</span>
      </template>
    </u-list-column>
    <u-list-column label="% CR" sortable sort-prop="cgPercent">
      <template #default="{ row }">
        <span>{{ row.cgPercent }}%</span>
      </template>
    </u-list-column>
    <u-list-column label="Création" sortable sort-prop="created_at">
      <template #default="{ row }">
        <span>{{ row.created_at }} - <b>{{ row.created_by }}</b></span>
      </template>
    </u-list-column>
    <u-list-column label="Update" sortable sort-prop="updated_at">
      <template #default="{ row }">
        <span>{{ row.updated_at }} - <b>{{ row.updated_by }}</b></span>
      </template>
    </u-list-column>
    <template #action="{ row }">
      <u-button type="primary" icon="icon-user" @click="alertRow(row)" />
      <u-button type="primary" icon="icon-connect" />
      <u-button type="warning" icon="icon-activate" />
    </template>
  </u-list>
`,
  setup() {
    const handleSelectionChange = (...args) => {
      console.log('selection-change', ...args);
    };
    const alertRow = (row) => window.alert(JSON.stringify(row));
    return { listActions, listData, handleSelectionChange, alertRow };
  },
});

export const WithColumnVisibility = () => ({
  components: { UList, UListColumn, UButton },
  template: `
  <u-list
    list-key="story"
    :data="listData"
    :list-actions="listActions"
    selectable
    @selection-change="handleSelectionChange"
  >
    <u-list-column column-key="column_name" column-default-visibility="always" label="Nom" sortable sort-prop="name">
      <template #default="{ row }">
        <span>{{ row.name }}</span>
      </template>
    </u-list-column>
    <u-list-column column-key="column_actions" column-default-visibility="always" label="Actions" sortable sort-prop="actions">
      <template #default="{ row }">
        <span>{{ row.actions }} i</span>
      </template>
    </u-list-column>
    <u-list-column column-key="column_active" column-default-visibility="visible" label="Active" sortable sort-prop="active">
      <template #default="{ row }">
        <span>{{ row.active }}</span>
      </template>
    </u-list-column>
    <u-list-column column-key="column_cr" column-default-visibility="visible" label="% CR" sortable sort-prop="cgPercent">
      <template #default="{ row }">
        <span>{{ row.cgPercent }}%</span>
      </template>
    </u-list-column>
    <u-list-column column-key="column_creation" column-default-visibility="invisible" label="Création" sortable sort-prop="created_at">
      <template #default="{ row }">
        <span>{{ row.created_at }} - <b>{{ row.created_by }}</b></span>
      </template>
    </u-list-column>
    <u-list-column column-key="column_update" column-default-visibility="invisible" label="Update" sortable sort-prop="updated_at">
      <template #default="{ row }">
        <span>{{ row.updated_at }} - <b>{{ row.updated_by }}</b></span>
      </template>
    </u-list-column>
    <template #action="{ row }">
      <u-button type="primary" icon="icon-user" @click="alertRow(row)" />
      <u-button type="primary" icon="icon-connect" />
      <u-button type="warning" icon="icon-activate" />
    </template>
  </u-list>
`,
  setup() {
    const handleSelectionChange = (...args) => {
      action('selection-change')(...args);
    };
    const alertRow = (row) => window.alert(JSON.stringify(row));
    return { listActions, listData, handleSelectionChange, alertRow };
  },
});

export const WithPagination = () => ({
  components: { UList, UListColumn, UButton },
  template: `
  <u-list
    :data="listData"
    :show-pagination="true"
    :page-size="5"
    :list-actions="listActions"
    selectable
    @selection-change="handleSelectionChange"
    @change="handleTableChange"
  >
    <u-list-column label="Nom" sortable sort-prop="name">
      <template #default="{ row }">
        <span>{{ row.name }}</span>
      </template>
    </u-list-column>
    <u-list-column label="Actions" sortable sort-prop="actions">
      <template #default="{ row }">
        <span>{{ row.actions }} i</span>
      </template>
    </u-list-column>
    <u-list-column label="Active" sortable sort-prop="active">
      <template #default="{ row }">
        <span>{{ row.active }}</span>
      </template>
    </u-list-column>
    <u-list-column label="% CR" sortable sort-prop="cgPercent">
      <template #default="{ row }">
        <span>{{ row.cgPercent }}%</span>
      </template>
    </u-list-column>
    <u-list-column label="Création" sortable sort-prop="created_at">
      <template #default="{ row }">
        <span>{{ row.created_at }} - <b>{{ row.created_by }}</b></span>
      </template>
    </u-list-column>
    <u-list-column label="Update" sortable sort-prop="updated_at">
      <template #default="{ row }">
        <span>{{ row.updated_at }} - <b>{{ row.updated_by }}</b></span>
      </template>
    </u-list-column>
    <template #action="{ row }">
      <u-button type="primary" icon="icon-user" @click="alertRow(row)" />
      <u-button type="primary" icon="icon-connect" />
      <u-button type="warning" icon="icon-activate" />
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
    return {
      listActions,
      listData,
      handleSelectionChange,
      handleTableChange,
      alertRow,
    };
  },
});

export const WithoutTableHeader = () => ({
  components: { UList, UListColumn, UButton },
  template: `
  <u-list
    list-key="story"
    row-key="id"
    :data="listData"
    :show-selection-summary="true"
    :show-pagination="true"
    :page-size="5"
    :show-table-header="false"
    :list-actions="listActions"
    selectable
    :selectable-filter="selectableFilter"
    reserve-selection
    :sort-options="sortOptions"
    @selection-change="handleSelectionChange"
  >
    <u-list-column column-key="column_name" label="Nom" sortable sort-prop="name">
      <template #default="{ row }">
        <span>{{ row.name }}</span>
      </template>
    </u-list-column>
    <u-list-column column-key="column_actions" label="Actions" sortable sort-prop="actions">
      <template #default="{ row }">
        <span>{{ row.actions }} i</span>
      </template>
    </u-list-column>
    <u-list-column column-key="column_active" label="Active" sortable sort-prop="active">
      <template #default="{ row }">
        <span>{{ row.active }}</span>
      </template>
    </u-list-column>
    <u-list-column column-key="column_cr" label="% CR" sortable sort-prop="cgPercent">
      <template #default="{ row }">
        <span>{{ row.cgPercent }}%</span>
      </template>
    </u-list-column>
    <u-list-column column-key="column_creation" label="Création" sortable sort-prop="created_at">
      <template #default="{ row }">
        <span>{{ row.created_at }} - <b>{{ row.created_by }}</b></span>
      </template>
    </u-list-column>
    <u-list-column column-key="column_update" label="Update" sortable sort-prop="updated_at">
      <template #default="{ row }">
        <span>{{ row.updated_at }} - <b>{{ row.updated_by }}</b></span>
      </template>
    </u-list-column>
    <template #action="{ row }">
      <u-button type="primary" icon="icon-user" @click="alertRow(row)" />
      <u-button type="primary" icon="icon-connect" />
      <u-button type="warning" icon="icon-activate" />
    </template>
    <template #selection="{ row }">
      {{ row.name }} with <b>{{ row.actions }} i</b> by <b>{{ row.created_by }}</b>
    </template>
  </u-list>
`,
  setup() {
    const handleSelectionChange = (...args) => {
      action('selection-change')(...args);
    };
    const selectableFilter = (row) => row.cgPercent > 5;
    const sortOptions = [
      { label: 'Newest', prop: 'updated_at', order: 'descending' },
      { label: 'Oldest', prop: 'updated_at', order: 'ascending' },
      { label: 'A-Z', prop: 'name', order: 'ascending' },
      { label: 'Z-A', prop: 'name', order: 'descending' },
    ];
    const alertRow = (row) => window.alert(JSON.stringify(row));
    return {
      listActions,
      listData,
      handleSelectionChange,
      selectableFilter,
      sortOptions,
      alertRow,
    };
  },
});

export const WithSelectAll = () => ({
  components: { UList, UListColumn, UButton },
  template: `
  <u-list
    :data="listData"
    :show-pagination="true"
    :page-size="5"
    :show-select-all-across-pages="true"
    :list-actions="listActions"
    selectable
    @selection-change="handleSelectionChange"
    @change="handleTableChange"
  >
    <u-list-column label="Nom" sortable sort-prop="name">
      <template #default="{ row }">
        <span>{{ row.name }}</span>
      </template>
    </u-list-column>
    <u-list-column label="Actions" sortable sort-prop="actions">
      <template #default="{ row }">
        <span>{{ row.actions }} i</span>
      </template>
    </u-list-column>
    <u-list-column label="Active" sortable sort-prop="active">
      <template #default="{ row }">
        <span>{{ row.active }}</span>
      </template>
    </u-list-column>
    <u-list-column label="% CR" sortable sort-prop="cgPercent">
      <template #default="{ row }">
        <span>{{ row.cgPercent }}%</span>
      </template>
    </u-list-column>
    <u-list-column label="Création" sortable sort-prop="created_at">
      <template #default="{ row }">
        <span>{{ row.created_at }} - <b>{{ row.created_by }}</b></span>
      </template>
    </u-list-column>
    <u-list-column label="Update" sortable sort-prop="updated_at">
      <template #default="{ row }">
        <span>{{ row.updated_at }} - <b>{{ row.updated_by }}</b></span>
      </template>
    </u-list-column>
    <template #action="{ row }">
      <u-button type="primary" icon="icon-user" @click="alertRow(row)" />
      <u-button type="primary" icon="icon-connect" />
      <u-button type="warning" icon="icon-activate" />
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
    return {
      listActions,
      listData,
      handleSelectionChange,
      handleTableChange,
      alertRow,
    };
  },
});

export const NotSelectable = () => ({
  components: { UList, UListColumn, UButton },
  template: `
  <u-list
    :data="listData"
    :show-select-all-across-pages="true"
    :show-counts="false"
    :show-searchbar="false"
    :list-actions="listActions"
  >
    <u-list-column label="Nom" sortable sort-prop="name">
      <template #default="{ row }">
        <span>{{ row.name }}</span>
      </template>
    </u-list-column>
    <u-list-column label="Actions" sortable sort-prop="actions">
      <template #default="{ row }">
        <span>{{ row.actions }} i</span>
      </template>
    </u-list-column>
    <u-list-column label="Active" sortable sort-prop="active">
      <template #default="{ row }">
        <span>{{ row.active }}</span>
      </template>
    </u-list-column>
    <u-list-column label="% CR" sortable sort-prop="cgPercent">
      <template #default="{ row }">
        <span>{{ row.cgPercent }}%</span>
      </template>
    </u-list-column>
    <u-list-column label="Création" sortable sort-prop="created_at">
      <template #default="{ row }">
        <span>{{ row.created_at }} - <b>{{ row.created_by }}</b></span>
      </template>
    </u-list-column>
    <u-list-column label="Update" sortable sort-prop="updated_at">
      <template #default="{ row }">
        <span>{{ row.updated_at }} - <b>{{ row.updated_by }}</b></span>
      </template>
    </u-list-column>
    <template #action="{ row }">
      <u-button type="primary" icon="icon-user" @click="alertRow(row)" />
      <u-button type="primary" icon="icon-connect" />
      <u-button type="warning" icon="icon-activate" />
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
    return {
      listActions,
      listData,
      handleSelectionChange,
      handleTableChange,
      alertRow,
    };
  },
});

export const MinimumColumnHeaderHeight = () => ({
  components: { UList, UListColumn, UButton },
  template: `
  <u-list :data="listData" :show-header="false">
    <u-list-column label="Nom">
      <template #default="{ row }">
        <span>{{ row.name }}</span>
      </template>
    </u-list-column>
    <u-list-column label="Actions">
      <template #default="{ row }">
        <span>{{ row.actions }} i</span>
      </template>
    </u-list-column>
    <u-list-column label="Active">
      <template #default="{ row }">
        <span>{{ row.active }}</span>
      </template>
    </u-list-column>
    <u-list-column label="% CR">
      <template #default="{ row }">
        <span>{{ row.cgPercent }}%</span>
      </template>
    </u-list-column>
    <u-list-column label="Création">
      <template #default="{ row }">
        <span>{{ row.created_at }} - <b>{{ row.created_by }}</b></span>
      </template>
    </u-list-column>
    <u-list-column label="Update" column-key="updated_at" column-default-visibility="invisible">
      <template #default="{ row }">
        <span>{{ row.updated_at }} - <b>{{ row.updated_by }}</b></span>
      </template>
    </u-list-column>
  </u-list>
`,
  setup() {
    return { listData };
  },
});

export const CompleteUsage = () => ({
  components: { UList, UListColumn, UButton },
  template: `
  <u-list
    list-key="complete"
    :data="listData"
    :list-actions="listActions"
    selectable
    reserve-selection
    show-pagination
    :page-size="5"
    has-border
    show-table-header
    show-selection-summary
    has-configurable-columns
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
        <span>{{ row.created_at }} - <b>{{ row.created_by }}</b></span>
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
        <span>{{ row.updated_at }} - <b>{{ row.updated_by }}</b></span>
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

    <!-- Slot append pour ajouter une colonne supplémentaire -->
    <template #append>
      <u-list-column label="Extra" width="100">
        <template #default="{ row }">
          <span style="text-align: center; font-style: italic;">Info suppl.</span>
        </template>
      </u-list-column>
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
