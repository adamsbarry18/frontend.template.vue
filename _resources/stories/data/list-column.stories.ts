import { ref, provide } from 'vue';
import { ElTable } from 'element-plus';
import UListColumn from '@/commons/data/UListColumn.vue';
import { action } from '@storybook/addon-actions';

const listData = [
  {
    id: 1,
    name: 'Alice',
    actions: 42,
    active: 3,
    cgPercent: 11,
  },
  {
    id: 2,
    name: 'Barry',
    actions: 23,
    active: 5,
    cgPercent: 2,
  },
  {
    id: 3,
    name: 'Zar',
    actions: 3,
    active: 5,
    cgPercent: 2,
  },
  {
    id: 4,
    name: 'Veronica',
    actions: 5,
    active: 5,
    cgPercent: 2,
  },
  {
    id: 5,
    name: 'Pape',
    actions: 23,
    active: 5,
    cgPercent: 2,
  },
];

export default {
  title: 'data/ListColumn',
};

export const ListColumn = () => ({
  components: { ElTable, UListColumn },
  template: `
  <div style="padding: 20px;">
    <el-table :data="data" style="width: 100%">
      <!-- Colonne pour le nom -->
      <u-list-column 
        column-key="col1" 
        label="Name" 
        sort-prop="name" 
        width="200" 
        align="left"
        sortable
        @sort-change="onSortChange"
      >
        <template #header>
          <div>Custom Header: Name</div>
        </template>
        <template #default="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </u-list-column>
      <!-- Colonne pour les actions -->
      <u-list-column 
        column-key="col2" 
        label="Actions" 
        sort-prop="actions" 
        width="100" 
        align="right"
        sortable
        @sort-change="onSortChange"
      >
        <template #header>
          <div>Custom Header: Actions</div>
        </template>
        <template #default="{ row }">
          <span>{{ row.actions }}</span>
        </template>
      </u-list-column>
    </el-table>
  </div>
`,
  setup() {
    // Fournir des valeurs globales pour listKey et columnVisibility
    provide('listKey', 'testList');
    provide('columnVisibility', {
      'testList@col1': true,
      'testList@col2': true,
    });

    const data = ref(listData);
    const onSortChange = action('sort-change');

    return { data, onSortChange };
  },
});
