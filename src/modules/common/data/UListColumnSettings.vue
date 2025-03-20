<template>
  <u-popper
    v-model:visible="show"
    placement="bottom-start"
    :width="230"
    trigger="click"
  >
    <div class="u-list-column-settings">
      <u-shortcut-subscriber v-if="show" @shortcut-trigger="onShortcutEscape" />
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
            <span v-if="isLocked(column.key)">{{
              $t('commons.column-settings.column-locked')
            }}</span>
          </template>
        </u-tooltip>
      </div>
      <u-button
        type="primary"
        :disabled="!hasUnsavedChanges()"
        class="-button-like"
        @click="submit"
      >
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
  import UButton from '@/modules/common/basic/UButton.vue';
  import UTooltip from '@/modules/common/others/UTooltip.vue';
  import UShortcutSubscriber from '@/modules/common/others/UShortcutSubscriber.vue';
  import UPopper from '../others/UPopper.vue';
  import { ElCheckbox } from 'element-plus';
  import {
    isColumnVisible,
    hasSavedVisibility,
    LIST_COLUMN_VISIBILITY,
  } from '@/libs/utils/List';

  const props = defineProps({
    listKey: {
      type: String,
      required: true,
    },
    columns: {
      type: Array as PropType<any[]>,
      required: true,
    },
    defaults: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['column-visibility-change', 'hide']);

  const show = ref(false);
  const values = reactive({});
  const initValues = ref<any[]>([]);

  const showSettings = () => {
    if (show.value) {
      show.value = false;
      emit('hide');
      return;
    }
    for (const column of props.columns) {
      const columnId = getColumnId(column.key);
      if (getDefaultVisibility(column.key) === LIST_COLUMN_VISIBILITY.ALWAYS) {
        values[column.key] = true;
      } else {
        values[column.key] = hasSavedVisibility(columnId)
          ? isColumnVisible(columnId)
          : getDefaultVisibility(column.key) !==
            LIST_COLUMN_VISIBILITY.INVISIBLE;
      }
    }
    initValues.value = Object.values(values);
    show.value = true;
  };

  const hasUnsavedChanges = () => {
    const activeValues = Object.values(values);
    for (let i = 0; i < activeValues.length; i++) {
      if (activeValues[i] !== initValues.value[i]) return true;
    }
    return false;
  };

  const getColumnId = (columnKey: string) => {
    return `${props.listKey}@${columnKey}`;
  };

  const submit = () => {
    for (const column of Object.keys(values)) {
      const columnId = getColumnId(column);
      emit('column-visibility-change', columnId, values[column]);
    }
    show.value = false;
  };

  function onShortcutEscape() {
    show.value = false;
    emit('hide');
  }

  const reset = () => {
    for (const column of props.columns) {
      values[column.key] =
        getDefaultVisibility(column.key) !== LIST_COLUMN_VISIBILITY.INVISIBLE;
    }
  };

  const onChecked = (value: boolean, columnKey: string) => {
    if (!isLocked(columnKey)) {
      values[columnKey] = !!value;
    }
  };

  const isLocked = (columnKey: string) => {
    return props.defaults[columnKey] === LIST_COLUMN_VISIBILITY.ALWAYS;
  };

  const getDefaultVisibility = (columnKey: string) => {
    return props.defaults[columnKey]
      ? props.defaults[columnKey]
      : LIST_COLUMN_VISIBILITY.VISIBLE;
  };

  defineExpose({
    showSettings,
  });
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
