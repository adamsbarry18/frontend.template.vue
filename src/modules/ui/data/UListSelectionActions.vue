<template>
  <div class="u-list-selection-actions">
    <div
      class="select-checkbox"
      :class="checkboxState"
      @click="onCheckBoxClick"
    />
    <div class="actions-wrapper">
      <u-tooltip
        v-for="(action, index) in availableActions"
        :key="action.label"
        class="list-action -button-like"
        :class="{
          '-before-separator':
            !action.separator && availableActions[index + 1]?.separator,
          '-after-separator':
            action.separator &&
            availableActions[index - 1] &&
            !availableActions[index - 1].separator,
        }"
        placement="top"
        @click="onActionClick(action, $event)"
      >
        <div>
          <icon-base
            :icon="action.icon"
            :size="28"
            color="var(--color-neutral-800)"
          />
        </div>
        <template #content>
          {{ action.label }}
        </template>
      </u-tooltip>
    </div>
    <div class="element-count">
      <span
        v-if="selection.length === data.length"
        v-html="$t('commons.element-count-all-selected', selection.length)"
      />
      <span v-else v-html="$t('commons.element-count', selection.length)" />
    </div>
    <div
      v-if="
        displaySelectAllButton &&
        selection.length === paginatedData.length &&
        paginatedData.length !== data.length
      "
      class="select-all -button-like"
      @click="onSelectAllAcrossPages"
    >
      <b>{{ $t('commons.element-count-all', data.length) }}</b>
    </div>
    <div class="cancel-button -button-like" @click="onCancel">
      {{ $t('commons.form.cancel') }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, PropType } from 'vue';
  import { UTooltip, IconBase } from '@/modules/ui';

  // Types
  interface Action {
    id: string;
    label: string;
    icon: string;
    separator?: boolean;
    multiTarget?: boolean;
    filterFunc?: (item: any) => boolean;
    onClick: (selection: any | any[], event: MouseEvent) => void;
  }

  // Props
  const props = defineProps({
    paginatedData: {
      type: Array as PropType<any[]>,
      required: true,
    },
    selection: {
      type: Array as PropType<any[]>,
    },
    actions: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    selectAllAcrossPages: {
      type: Boolean,
      default: false,
    },
  });

  // Événements
  const emit = defineEmits<{
    (e: 'clear-all'): void;
    (e: 'check-all'): void;
    (e: 'select-all-across-pages'): void;
  }>();

  // État réactif
  const displaySelectAllButton = ref(props.selectAllAcrossPages);

  // Propriétés calculées
  const checkboxState = computed(() => {
    if (props.selection.length === 0) return '-empty';
    if (props.selection.length === props.data.length) return '-full';
    return props.selection.length === props.paginatedData.length
      ? '-full'
      : '-partial';
  });

  const availableActions = computed(() => {
    return props.actions.filter((action) => {
      if (!action.multiTarget) {
        if (props.selection.length !== 1) return false;
        if (action.filterFunc && !action.filterFunc(props.selection[0]))
          return false;
      } else if (action.multiTarget && action.filterFunc) {
        if (!props.selection.every((item) => action.filterFunc!(item)))
          return false;
      }
      return true;
    });
  });

  // Méthodes
  function onCheckBoxClick() {
    if (checkboxState.value === '-full') {
      emit('clear-all');
    } else {
      emit('check-all');
    }
  }

  function onActionClick(action: Action, event: MouseEvent) {
    const viewportOffset = (
      event.target as HTMLElement
    ).getBoundingClientRect();
    const adjustedEvent = {
      ...event,
      clientX: viewportOffset.left + viewportOffset.width / 2,
      clientY: viewportOffset.top + viewportOffset.height / 2,
    };
    if (action.multiTarget) {
      action.onClick(props.selection, adjustedEvent);
    } else if (props.selection.length === 1) {
      action.onClick(props.selection[0], adjustedEvent);
    }
  }

  function onSelectAllAcrossPages() {
    displaySelectAllButton.value = false;
    emit('select-all-across-pages');
  }

  function onCancel() {
    emit('clear-all');
  }
</script>

<style lang="scss">
  .u-list-selection-actions {
    display: flex;
    position: absolute;
    flex-direction: row;
    align-items: center;
    z-index: 5;
    background-color: var(--color-primary-100);
    padding: 0 20px 0 20px;
    width: 100%;
    height: 53px;
    .select-checkbox {
      position: relative;
      margin-right: 25px;
      border-radius: 2px;
      background-color: var(--color-primary-500);
      cursor: pointer;
      width: 14px;
      height: 14px;
      &::before {
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translate(-50%, 0);
        border-right: 10px solid transparent;
        border-bottom: 10px solid var(--color-white);
        border-left: 10px solid transparent;
        width: 0;
        height: 0;
        content: '';
      }
      &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--color-white);
        content: '~';
      }

      &.-full {
        &::after {
          box-sizing: content-box;
          position: absolute;
          top: 2px;
          left: 5px;
          transform: rotate(45deg);
          border-right: solid 1px var(--color-white);
          border-bottom: solid 1px var(--color-white);
          width: 3px;
          height: 7px;
          content: '';
        }
      }
    }

    .actions-wrapper {
      display: flex;
      flex-grow: 1;
      justify-content: flex-start;
      text-align: right;

      .list-action {
        position: relative;
        margin: 2px;
        border-radius: 50%;
        padding: 5px;
        width: 38px;
        height: 38px;
        &.-before-separator {
          margin-right: 12px;
          &::after {
            position: absolute;
            top: 6px;
            right: 12px;
            border-right: 1px solid var(--color-neutral-500);
            height: 25px;
            content: '';
          }
        }

        &.-after-separator {
          margin-left: 11px;
        }

        &:hover {
          background-color: var(--color-neutral-100);
        }
      }
    }
    .element-count {
      padding-right: 15px;
    }
    .select-all {
      padding-right: 15px;
      border-left: 1px solid var(--color-neutral-700);
      padding-left: 15px;
      &:hover {
        text-decoration: underline;
      }
    }
    .cancel-button {
      border-left: 1px solid var(--color-neutral-700);
      padding-left: 15px;
    }
  }
</style>
