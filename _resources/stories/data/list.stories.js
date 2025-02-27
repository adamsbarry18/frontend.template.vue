import UList from '@/commons/data/UList.vue';
import UListColumn from '@/commons/data/UListColumn.vue';
import UButton from '@/commons/basic/UButton.vue';
import { listActions, listData } from '../_data/list';
import { ref } from 'vue';

export default {
  title: 'Data/List',
  components: { UList, UListColumn, UButton },
};

export const List = () => ({
  components: { UList, UListColumn, UButton },
  template: `
    <u-list
      list-key="story"
      :data="listData"
      :list-actions="listActions"
      :selectable="true"
      :has-border="true"
      @selection-change="handleSelectionChange"
    >
      <u-list-column label="Nom" column-default-visibility="invisible" sortable sort-prop="name" align="left">
        <template v-slot="{ scope }">{{ scope.row.name }}</template>
      </u-list-column>
      <u-list-column label="Actions" sortable sort-prop="actions" align="left">
        <template v-slot="{ scope }">{{ scope.row.actions }} i</template>
      </u-list-column>
      <u-list-column label="Active" sortable sort-prop="active" align="left">
        <template v-slot="{ scope }">{{ scope.row.active }}</template>
      </u-list-column>
      <u-list-column label="% CR" sortable sort-prop="cgPercent" align="left">
        <template v-slot="{ scope }">{{ scope.row.cgPercent }}%</template>
      </u-list-column>
      <u-list-column label="Création" sortable sort-prop="created_at" align="left">
        <template v-slot="{ scope }">{{ scope.row.created_at }} - <b>{{ scope.row.created_by }}</b></template>
      </u-list-column>
      <u-list-column label="Update" sortable sort-prop="updated_at" align="left">
        <template v-slot="{ scope }">{{ scope.row.updated_at }} - <b>{{ scope.row.updated_by }}</b></template>
      </u-list-column>

      <template #action="{ scope }">
        <u-button type="primary" icon="icon-user" @click="alert(scope.row)"></u-button>
        <u-button type="primary" icon="icon-connect"></u-button>
        <u-button type="warning" icon="icon-activate"></u-button>
      </template>
    </u-list>
  `,
  setup() {
    const handleSelectionChange = () => {
      console.log('selection-change: ');
    };
    return {
      listActions,
      listData,
      handleSelectionChange,
    };
  },
});
