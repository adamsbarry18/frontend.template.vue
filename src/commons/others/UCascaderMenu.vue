<template>
  <el-cascader
    v-model="value"
    :class="{
      '-disabled-input': disabled,
    }"
    :options="options"
    :placeholder="placeholder"
    :disabled="disabled"
    :filterable="false"
    :props="{ checkStrictly: allowParentSelection, expandTrigger }"
    class="u-cascader-menu"
    popper-class="u-cascader-menu-popper"
    @change="handleChange"
    @blur="handleBlur"
    @visible-change="handleVisibleChange"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import type { CascaderOption, CascaderProps } from 'element-plus';
  import { ElCascader } from 'element-plus';
  import i18n from '@/i18n';

  // Props definition
  interface Props {
    placeholder?: string;
    options?: CascaderOption[];
    input?: Array<string | number>;
    allowParentSelection?: boolean;
    expandTrigger?: CascaderProps['expandTrigger'];
    disabled?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: () => i18n.global.t('commons.searchbar.default-placeholder'),
    options: () => [],
    input: undefined,
    allowParentSelection: false,
    expandTrigger: 'click',
    disabled: false,
  });

  // Emits definition
  const emit = defineEmits<{
    (e: 'select', value: Array<string | number> | null): void;
  }>();

  // Reactive state
  const value = ref<Array<string | number> | null>(null);
  const lastValue = ref<Array<string | number> | null>(null);
  const hasSelectedItem = ref(false);

  // Lifecycle hooks
  onMounted(() => {
    value.value = null;
    lastValue.value = value.value;
  });

  // Methods
  const handleBlur = (evt: FocusEvent) => {
    if (evt.relatedTarget !== null) {
      hasSelectedItem.value = true;
    }
  };

  const handleChange = () => {
    lastValue.value = value.value;
    emit('select', lastValue.value !== null ? [...lastValue.value] : null);
    // Revert value to placeholder
    value.value = [props.placeholder];
  };

  const handleVisibleChange = (visibility: boolean) => {
    if (!visibility && hasSelectedItem.value) {
      hasSelectedItem.value = false;
      lastValue.value = null;
    }
  };
</script>

<style lang="scss">
  .u-cascader-menu {
    width: 100%;
    .el-input__wrapper {
      background-color: var(--color-white) !important;
      box-shadow: 0 0 0 1px var(--color-input-border) !important;
      border-radius: 4px !important;
    }
    .el-input__inner {
      width: 100%;
      border: none !important;
    }

    .el-cascader-node__label {
      padding: 0;
    }

    &.-disabled-input {
      input {
        &::placeholder {
          opacity: 1 !important;
          color: var(--color-neutral-800) !important;
        }
      }
      .el-cascader-node__label {
        cursor: not-allowed;
      }
    }

    .el-input {
      & > input {
        border: 1px solid var(--color-input-border);
        background-color: var(--color-white);
        height: 35px;
        line-height: 35px;
      }
    }

    &-popper.el-cascader__dropdown {
      .el-cascader-menu__list {
        height: 190px;
      }
    }
  }
</style>
