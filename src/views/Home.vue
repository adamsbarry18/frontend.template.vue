<template>
  <div class="list">
    <h1>Test components</h1>

    <div>
      <u-list
        list-key="users"
        :data="listData"
        :list-actions="listActions"
        :selectable="true"
        :show-pagination="true"
        :page-size="5"
        @selection-change="handleSelectionChange"
      >
        <u-list-column
          column-key="column_name"
          column-default-visibility="always"
          label="Nom"
          sortable
          sort-prop="name"
        >
          <template #default="{ row }">{{ row.name }}</template>
        </u-list-column>
        <u-list-column
          column-key="column_actions"
          column-default-visibility="always"
          label="Actions"
          sortable
          sort-prop="actions"
        >
          <template #default="{ row }">{{ row.actions }}</template>
        </u-list-column>
        <u-list-column
          column-key="column_active"
          column-default-visibility="visible"
          label="Active"
          sortable
          sort-prop="active"
        >
          <template #default="{ row }">{{ row.active }}</template>
        </u-list-column>
        <u-list-column
          column-key="column_cr"
          column-default-visibility="visible"
          label="% CR"
          sortable
          sort-prop="cgPercent"
        >
          <template #default="{ row }">{{ row.cgPercent }}%</template>
        </u-list-column>
        <u-list-column
          column-key="column_creation"
          column-default-visibility="invisible"
          label="Création"
          sortable
          sort-prop="created_at"
        >
          <template #default="{ row }">{{ row.created_at }}</template>
        </u-list-column>
        <u-list-column
          column-key="column_update"
          column-default-visibility="invisible"
          label="Update"
          sortable
          sort-prop="updated_at"
        >
          <template #default="{ row }">{{ row.updated_at }}</template>
        </u-list-column>

        <template #action="{ row }">
          <u-button
            type="primary"
            icon="icon-view"
            @click="alert(row)"
          ></u-button>
          <u-button type="delete" icon="icon-delete"></u-button>
          <u-button type="tertiary" icon="icon-edit"></u-button>
        </template>
      </u-list>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import { listData, listActions } from '../../_resources/stories/_data/list';
  import UButton from '@/commons/basic/UButton.vue';
  import UList from '@/commons/data/UList.vue';
  import UListColumn from '@/commons/data/UListColumn.vue';

  const handleSelectionChange = () => {
    console.log('selection-change: ');
  };

  const alert = (row) => {
    window.alert(JSON.stringify(row));
  };
  const value = ref('je suis clicked');
  const handleClick = () => {
    alert(value.value);
  };
  onMounted(() => {
    console.log('list data app: ', listData);
  });
</script>

<style lang="scss">
  .list {
    padding: 20px;
  }
</style>
