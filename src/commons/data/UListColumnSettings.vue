<template>
  <div v-if="show" ref="popper" class="u-list-column-settings u-popper">
    <u-shortcut-subscriber @shortcut-trigger="onShortcutEscape" />
    <div x-arrow />
    <div class="column-list -custom-scrollbar">
      <u-tooltip
        v-for="column in columns"
        :key="column.key"
        placement="left"
        tooltip-class="column-settings-info"
      >
        <div
          class="column-item"
          @click="onChecked(!values[column.key], column.key)"
        >
          <el-checkbox
            :model-value="values[column.key]"
            :disabled="isLocked(column.key)"
            class="column-checkbox"
            @update:model-value="onChecked(($event = true), column.key)"
          >
            {{ column.label }}
          </el-checkbox>
        </div>
        <template #content v-if="isLocked(column.key)">
          {{ $t('commons.column-settings.column-locked') }}
        </template>
      </u-tooltip>
    </div>
    <u-button
      type="primary"
      :disabled="!hasUnsavedChanges"
      class="-button-like"
      @click="submit"
    >
      {{ $t('commons.form.save') }}
    </u-button>
    <u-button class="reset -button-like" @click="reset">
      {{ $t('commons.form.reset-defaults') }}
    </u-button>
  </div>
</template>

<script setup lang="ts">
  import { ref, inject, onMounted, computed } from 'vue';
  import UButton from '@/commons/basic/UButton.vue';
  import UTooltip from '@/commons/others/UTooltip.vue';
  import UShortcutSubscriber from '@/commons/others/UShortcutSubscriber.vue';
  import { ElCheckbox } from 'element-plus';
  import {
    isColumnVisible,
    hasSavedVisibility,
    LIST_COLUMN_VISIBILITY,
  } from '../../libs/utils/List';

  // Définir les types
  interface Column {
    key: string;
    label: string;
  }

  // Injection de dépendances
  const listKey = inject<string>('listKey', '');
  const columnVisibility = inject<Record<string, boolean>>(
    'columnVisibility',
    {}
  );

  // Props
  const props = defineProps<{
    columns: Column[];
    defaults: Record<string, string>;
  }>();

  // Événements émis
  const emit = defineEmits<{
    (e: 'column-visibility-change', columnId: string, value: boolean): void;
    (e: 'hide'): void;
  }>();

  // Références et état réactif
  const popper = ref<HTMLElement | null>(null);
  const show = ref(false);
  const values = ref<Record<string, boolean>>({});
  const initValues = ref<boolean[]>([]);

  // Méthodes
  function showSettings(reference: HTMLElement) {
    values.value = {};
    for (const column of props.columns) {
      if (getDefaultVisibility(column.key) === LIST_COLUMN_VISIBILITY.ALWAYS) {
        values.value[column.key] = true;
      } else {
        values.value[column.key] = hasSavedVisibility(getColumnId(column.key))
          ? isColumnVisible(getColumnId(column.key))
          : getDefaultVisibility(column.key) !==
            LIST_COLUMN_VISIBILITY.INVISIBLE;
      }
    }
    initValues.value = Object.values(values.value);
    show.value = true;
  }

  const hasUnsavedChanges = computed(() => {
    const activeValues = Object.values(values.value);
    return activeValues.some((val, i) => val !== initValues.value[i]);
  });

  function getColumnId(columnKey: string) {
    return `${listKey}@${columnKey}`;
  }

  function submit() {
    for (const columnKey of Object.keys(values.value)) {
      emit(
        'column-visibility-change',
        getColumnId(columnKey),
        values.value[columnKey]
      );
    }
    show.value = false;
    emit('hide');
  }

  function onShortcutEscape() {
    show.value = false;
    emit('hide');
  }

  function reset() {
    for (const column of props.columns) {
      values.value[column.key] =
        getDefaultVisibility(column.key) !== LIST_COLUMN_VISIBILITY.INVISIBLE;
    }
  }

  function onChecked(value: boolean, columnKey: string) {
    if (!isLocked(columnKey)) {
      values.value[columnKey] = value;
    }
  }

  function isLocked(columnKey: string) {
    return props.defaults[columnKey] === LIST_COLUMN_VISIBILITY.ALWAYS;
  }

  function getDefaultVisibility(columnKey: string) {
    return props.defaults[columnKey] || LIST_COLUMN_VISIBILITY.VISIBLE;
  }

  // Lifecycle hook
  onMounted(() => {
    // Si nécessaire, initialisation supplémentaire ici
  });

  // Exposé pour usage externe (optionnel)
  defineExpose({
    showSettings,
  });
</script>

<style lang="scss">
  .u-list-column-settings {
    display: flex;
    flex-direction: column;
    justify-items: center;
    margin-top: 13px;
    border: 1px solid var(--color-input-border);
    border-radius: 4px;
    box-shadow: var(--box-shadow-xl);
    background-color: var(--color-background-white);
    width: 230px;
    max-height: 75%;
    user-select: none;

    .column-list {
      flex-grow: 1;
      box-shadow: inset 0px -11px 20px -10px rgba(47, 50, 76, 0.14);
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
