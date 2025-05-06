<template>
  <el-cascader
    v-model="value"
    :class="{
      '-disabled': disabled,
      '-focused': isFocused,
    }"
    :options="options"
    :placeholder="placeholderLabel"
    :filterable="true"
    :props="cascaderProps"
    :filter-method="matchQuery"
    class="u-cascader-input"
    popper-class="u-cascader-input-popper"
    @change="handleChange"
    @click="handleClick"
    @blur="handleBlur"
    @visible-change="visibleChange"
  >
    <template #default="{ node, data }">
      <div
        class="cascader-node-label-wrapper"
        :title="`${data.label} ${!node.isLeaf ? `(${data.children.length})` : ''}`"
      >
        <span class="main-node-label">
          {{ data.label }}
        </span>
        <span v-if="!node.isLeaf && showChildrenCount" class="children-count">
          ({{ data.children.length }})
        </span>
      </div>
    </template>
  </el-cascader>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, onUpdated, nextTick, PropType } from 'vue';
  import { ElCascader, type CascaderValue } from 'element-plus';
  import i18n from '@/i18n';

  const props = defineProps({
    placeholder: {
      type: String,
      default: i18n.global.t('commons.searchbar.default-placeholder'),
    },
    options: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    input: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    labelFormatter: {
      type: Function,
      required: true,
    },
    allowParentSelection: {
      type: Boolean,
      default: false,
    },
    expandTrigger: {
      type: String as PropType<'click' | 'hover'>,
      default: 'click',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showChildrenCount: {
      type: Boolean,
      default: false,
    },
    focusOnMount: {
      type: Boolean,
    },
  });

  const emit = defineEmits(['change']);

  const value = ref<CascaderValue>(props.input || []);
  const hasChanged = ref(false);
  const isFocused = ref(false);
  const elCascaderRef = ref<InstanceType<typeof ElCascader>>();

  const cascaderProps = computed(() => ({
    checkStrictly: props.allowParentSelection,
    expandTrigger: props.expandTrigger,
  }));

  const placeholderLabel = computed(() => {
    return (value.value as any[])?.length > 0
      ? props.labelFormatter([...(value.value as any[])])
      : props.placeholder;
  });

  const inputCascader = computed((): HTMLInputElement | null => {
    return elCascaderRef.value?.$el.querySelector('.el-input__inner') as HTMLInputElement;
  });

  watch(
    () => props.input,
    (val) => {
      value.value = val || [];
    }
  );

  onMounted(() => {
    value.value = props.input || [];
    formatLabel();

    if (props.focusOnMount) {
      nextTick(() => {
        elCascaderRef.value?.$el?.click();
        (elCascaderRef.value?.$refs.input as HTMLInputElement)?.focus();
      });
    }
  });

  onUpdated(() => {
    if (hasChanged.value) {
      hasChanged.value = false;
      formatLabel();
    }
  });

  const handleChange = () => {
    emit('change', (value.value as any[])?.length ? [...(value.value as any[])] : null);
    hasChanged.value = true;
  };

  const handleClick = () => {
    isFocused.value = true;
  };

  const handleBlur = () => {
    isFocused.value = false;
  };

  const visibleChange = (isVisible: boolean) => {
    if (isVisible) {
      nextTick(() => {
        (elCascaderRef.value?.$refs.input as HTMLInputElement)?.focus();
      });
    } else {
      formatLabel();
    }
  };

  const formatLabel = () => {
    if (props.labelFormatter && (value.value as any[])?.length) {
      nextTick(() => {
        if (elCascaderRef.value?.$el && inputCascader.value) {
          inputCascader.value.value = props.labelFormatter([...(value.value as any[])]);
        }
      });
    }
  };

  const matchQuery = (node: any, keyword: string) => {
    return (
      node.text.toLowerCase().includes(keyword?.toLowerCase()) ||
      node.data?.value?.toLowerCase()?.includes(keyword?.toLowerCase())
    );
  };
</script>

<style lang="scss">
  .u-cascader-input {
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
  }
  .u-cascader-input-popper {
    .cascader-node-label-wrapper {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      gap: 8px;
      .main-node-label {
        max-width: 20ch;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }
      .children-count {
        display: block;
        color: var(--color-neutral-500);
        font-weight: normal;
      }
    }
  }
</style>
