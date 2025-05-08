<template>
  <u-popper v-model:visible="show" placement="bottom-start" :width="230" trigger="click">
    <div class="u-list-column-settings">
      <div class="column-list -custom-scrollbar">
        <u-tooltip
          v-for="column in columns"
          :key="column.key"
          placement="left"
          tooltip-class="column-settings-info"
        >
          <div class="column-item">
            <el-checkbox
              v-model="values[column.key]"
              :disabled="isLocked(column.key)"
              class="column-checkbox"
              @change="onChecked(!!$event, column.key)"
            >
              {{ column.label }}
            </el-checkbox>
          </div>
          <template #content>
            <span v-if="isLocked(column.key)">{{ $t('commons.column-settings.column-locked') }}</span>
          </template>
        </u-tooltip>
      </div>
      <u-button type="primary" :disabled="!hasUnsavedChanges()" class="-button-like" @click="submit">
        {{ $t('commons.form.save') }}
      </u-button>
      <u-button class="reset -button-like" @click="reset">
        {{ $t('commons.form.reset-defaults') }}
      </u-button>
    </div>
  </u-popper>
</template>

<script setup lang="ts">
  import { ref, reactive, PropType } from 'vue';
  import { UButton, UTooltip, UPopper } from '@/modules/ui';
  import { ElCheckbox } from 'element-plus';
  import { isColumnVisible, hasSavedVisibility, LIST_COLUMN_VISIBILITY } from '@/libs/utils/List';
  import { inject } from 'vue';

  // Define Column interface locally
  interface Column {
    key: string;
    label: string;
  }

  const props = defineProps({
    columns: { type: Array as PropType<Column[]> }, // Use Column[] type
    defaults: {
      type: Object as PropType<Record<string, string>>,
    },
  });

  const listKey = inject('listKey', '');

  const emit = defineEmits(['column-visibility-change']);

  const show = ref(false);
  const values = reactive<Record<string, boolean>>({}); // Correctly type the reactive object

  function showSettings(): void {
    if (!props.columns || !props.defaults) return; // Add guard clause
    for (const column of props.columns) {
      const columnId = getColumnId(column.key);
      if (props.defaults[column.key] === LIST_COLUMN_VISIBILITY.ALWAYS) {
        values[column.key] = true;
      } else if (hasSavedVisibility(columnId)) {
        values[column.key] = isColumnVisible(columnId);
      } else {
        const isVisible = props.defaults[column.key] !== LIST_COLUMN_VISIBILITY.INVISIBLE;
        values[column.key] = isVisible;
      }
    }
    show.value = true;
  }

  const hasUnsavedChanges = (): boolean => {
    if (!props.columns || !props.defaults) return false; // Add guard clause
    for (const column of props.columns) {
      const columnId = getColumnId(column.key);

      const savedVisibility = hasSavedVisibility(columnId)
        ? isColumnVisible(columnId)
        : props.defaults[column.key] !== LIST_COLUMN_VISIBILITY.INVISIBLE;
      if (values[column.key] !== savedVisibility) return true;
    }
    return false;
  };

  const getColumnId = (columnKey: string) => {
    return `${listKey}@${columnKey}`;
  };

  const submit = () => {
    for (const column of Object.keys(values)) {
      emit('column-visibility-change', getColumnId(column), values[column]);
    }
    show.value = false;
  };

  const reset = (): void => {
    if (!props.columns || !props.defaults) return; // Add guard clause
    for (const column of props.columns) {
      if (!isLocked(column.key)) {
        values[column.key] = props.defaults[column.key] !== LIST_COLUMN_VISIBILITY.INVISIBLE;
      }
    }
  };

  const onChecked = (value: boolean, columnKey: string) => {
    if (!isLocked(columnKey)) {
      values[columnKey] = value;
    }
  };

  const isLocked = (columnKey: string): boolean => {
    return props.defaults?.[columnKey] === LIST_COLUMN_VISIBILITY.ALWAYS; // Use optional chaining
  };

  defineExpose({ showSettings });
</script>

<style lang="scss">
  .u-list-column-settings {
    max-height: 75%;
    user-select: none;
    .column-list {
      flex-grow: 1;
      padding: 14px 20px;
      height: 270px;
      overflow-y: auto;
      .column-item {
        margin-bottom: 8px;
        cursor: pointer;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:last-child {
          margin-bottom: 15px;
        }
        .el-checkbox {
          margin-right: 10px;
          margin-bottom: 0;
          .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
            background-color: var(--color-input-disabled-background);
            &:after {
              border-color: var(--color-input-disabled-content);
            }
          }
          .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: var(--color-primary-500);
          }
        }
        .el-checkbox.is-disabled.is-checked .el-checkbox__label {
          color: var(--color-input-disabled-content);
        }
        .el-checkbox__label {
          font-size: var(--paragraph-02);
          color: var(--color-neutral-900);
        }
      }
    }
    & > .u-button {
      margin: 24px 20px 0px 20px;
      width: 75%;
      &.reset {
        margin-top: 4px;
        margin-bottom: 12px;
        box-shadow: none;
        background-color: transparent;
        text-decoration: underline;
        color: var(--color-neutral-500);
        font-weight: 500;
        &:hover {
          box-shadow: none;
        }
        & > div {
          font-size: var(--caption);
        }
      }
    }
  }
  .u-tooltip.el-tooltip__popper.column-settings-info {
    padding: 10px;
  }
</style>
