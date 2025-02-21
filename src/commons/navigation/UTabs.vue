<template>
  <el-tabs
    v-model="activeTab"
    :type="type"
    :closable="closable"
    :tab-position="tabPosition"
    :editable="editable"
    :class="`demo-tabs ${customClass}`"
    @tab-click="handleTabClick"
    @tab-remove="handleTabRemove"
    @edit="handleEdit"
  >
    <slot />
  </el-tabs>
</template>

<script setup lang="ts">
  import { ref, watch, computed, PropType } from 'vue';
  import type { TabsPaneContext, TabPaneName } from 'element-plus';
  import { ElTabs } from 'element-plus';

  // Props
  const props = defineProps({
    modelValue: {
      // Use modelValue for v-model
      type: [String, Number],
      required: true,
    },
    type: {
      type: String as PropType<'card' | 'border-card' | ''>,
      default: '',
    },
    closable: {
      type: Boolean,
      default: false,
    },
    tabPosition: {
      type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
      default: 'top',
    },
    editable: {
      // For add/remove buttons *on the tab bar*
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits([
    'update:modelValue',
    'tab-click',
    'tab-remove',
    'edit',
  ]);

  // Use a computed property for v-model compatibility
  const activeTab = computed({
    get: () => props.modelValue.toString(),
    set: (value) => emit('update:modelValue', value),
  });

  // Handlers
  const handleTabClick = (pane: TabsPaneContext, event: Event) => {
    emit('tab-click', pane, event);
  };

  const handleTabRemove = (name: TabPaneName) => {
    emit('tab-remove', name);
  };

  const handleEdit = (
    targetName: TabPaneName | undefined,
    action: 'remove' | 'add'
  ) => {
    emit('edit', targetName, action);
  };
</script>

<style scoped>
  .demo-tabs > .el-tabs__content {
    padding: 32px;
    color: var(--color-grey-400);
    font-size: 32px;
    font-weight: 600;
  }

  .el-tabs--right .el-tabs__content,
  .el-tabs--left .el-tabs__content {
    height: 100%;
  }
</style>
