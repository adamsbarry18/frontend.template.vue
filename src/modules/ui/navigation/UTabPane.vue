<template>
  <el-tab-pane
    :name="index.toString()"
    :disabled="disabled"
    :closable="closable"
  >
    <template #label>
      <span
        :class="{
          'custom-tabs-label': !!icon,
          'tab-error': error,
          'tab-disabled': disabled,
        }"
      >
        <icon-base
          v-if="icon"
          class="tab-icon"
          size="24"
          :icon="icon"
          :color="iconColor"
        />
        <span>{{ label }}</span>
      </span>
    </template>
    <slot />
  </el-tab-pane>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue';
  import { ElTabPane } from 'element-plus';
  import { IconBase } from '@/modules/ui'; // Import IconBase

  // Types
  type TabIndex = string | number;

  // Props
  defineProps({
    index: {
      type: [String, Number] as PropType<TabIndex>,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: null,
    },
    error: {
      type: Boolean,
      default: false,
    },
    closable: {
      // Add closable prop
      type: Boolean,
      default: false,
    },
    iconColor: {
      type: String,
      default: undefined,
    },
  });
</script>

<style scoped>
  .custom-tabs-label .el-icon {
    vertical-align: middle;
  }
  .custom-tabs-label span {
    vertical-align: middle;
    margin-left: 4px;
  }
  .tab-error {
    color: var(--color-status-error);
  }
  .tab-disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
</style>
