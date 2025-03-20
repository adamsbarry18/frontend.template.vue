import { ref } from 'vue';
import { ElTable } from 'element-plus';
import UListColumn from '@/modules/common/data/UListColumn.vue';
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
        :list-key="listKey"
        :column-visibility="columnVisibility"
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
        :list-key="listKey"
        :column-visibility="columnVisibility"
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
    const listKey = 'testList';
    const columnVisibility = {
      'testList@colName': true,
      'testList@colActions': true,
    };
    const onSortChange = () => console.log('sort-change');
    return { data, listKey, columnVisibility, onSortChange };
  },
});
