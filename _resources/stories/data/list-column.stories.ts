import { ref, provide } from 'vue';
import { ElTable } from 'element-plus';
import UListColumn from '@/commons/data/UListColumn.vue';
import { listData } from '../_data/list';

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
        column-key="colName"
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
        column-key="colActions"
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
    const data = ref(listData);
    const onSortChange = () => console.log('sort-change');

    provide('listKey', 'testList');

    // Définir la visibilité des colonnes :
    // - La colonne "Name" (clé 'colName') sera visible.
    // - La colonne "Actions" (clé 'colActions') sera masquée.
    const columnVisibility = {
      'testList@colName': true,
      'testList@colActions': true,
    };
    provide('columnVisibility', columnVisibility);

    return { data, onSortChange };
  },
});
