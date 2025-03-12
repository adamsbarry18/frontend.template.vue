<template>
  <div ref="button" class="u-split-button">
    <u-button
      :type="type"
      :size="size"
      :icon="icon"
      :icon-color="iconColor"
      :icon-size="iconSize"
      :disabled="disabled"
      @click="onClick"
    >
      <slot />
    </u-button>
    <button
      v-if="items.length > 0"
      class="split-arrow"
      :class="[type ? `-${type}` : '', disabled ? '-disabled' : '']"
      :disabled="disabled"
      @click="displayMenu"
    >
      <icon-base
        class="split-arrow-icon"
        :size="18"
        icon="icon-arrow"
        color="var(--split-button-text-color)"
      />
    </button>
    <u-popper
      v-model:visible="popperActive"
      placement="bottom-start"
      :width="230"
      trigger="click"
    >
      <template #default>
        <div class="u-multi-action-popper">
          <div x-arrow />
          <u-tooltip v-for="item in items" :key="item.label" placement="right">
            <template #default="{ tooltipVisible }">
              <div
                class="action-item"
                :class="{ '-disabled': item.disabled }"
                @click="onItemClick(item)"
              >
                <icon-base
                  v-if="item.icon"
                  :icon="item.icon"
                  :size="24"
                  color="var(--color-neutral-500)"
                />
                <span>{{ item.label }}</span>
              </div>
            </template>
            <template #content v-if="item.tooltip">
              {{ item.tooltip }}
            </template>
          </u-tooltip>
        </div>
      </template>
    </u-popper>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import UButton from '@/commons/basic/UButton.vue';
  import UPopper from '@/commons/others/UPopper.vue';
  import UTooltip from '@/commons/others/UTooltip.vue';
  import IconBase from '@/commons/icons/IconBase.vue';

  interface IMultiActionItem {
    label: string;
    disabled?: boolean;
    icon?: string;
    tooltip?: string;
    onClick?: () => void;
  }

  const props = defineProps({
    type: {
      type: String,
      default: 'default',
    },
    size: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: '',
    },
    iconColor: {
      type: String,
      default: '',
    },
    iconSize: {
      type: Number,
      default: 30,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array as () => IMultiActionItem[],
      required: true,
    },
  });

  const emit = defineEmits(['click', 'toggle']);

  const popperActive = ref(false);

  const displayMenu = (event: MouseEvent) => {
    popperActive.value = !popperActive.value;
    onActiveChange();
  };

  const onClick = (event: MouseEvent) => {
    emit('click', event);
  };

  const onItemClick = (item: IMultiActionItem) => {
    if (!item.disabled) {
      item.onClick?.();
      popperActive.value = false;
      onActiveChange();
    }
  };

  const onActiveChange = () => {
    emit('toggle', popperActive.value);
  };

  defineExpose({ displayMenu });
</script>

<style lang="scss">
  .u-split-button {
    display: inline-flex;

    .u-button {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    .split-arrow {
      --split-button-text-color: var(--color-neutral-800);
      display: flex;
      align-items: center;
      border: 0;
      border-left: 1px solid var(--split-button-text-color);
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      padding: 0 12px;
      transition: all 0.15s ease-in-out;
      cursor: pointer;

      &:focus {
        z-index: 1;
      }

      &.-disabled {
        cursor: not-allowed;
        pointer-events: auto;
        &.-default,
        &.-primary,
        &.-secondary,
        &.-tertiary,
        &.-dashboard,
        &.-delete {
          background-color: var(--color-button-disabled-background);
          --split-button-text-color: var(--color-button-disabled-content);
          &:hover {
            background-color: var(--color-button-disabled-background);
            color: var(--color-button-disabled-content);
          }
        }
      }

      &.-primary {
        background-color: var(--color-primary-500);
        --split-button-text-color: var(--color-white);
        &:not(.-disabled) > .label-btn {
          background-color: var(--color-primary-400);
          --split-button-text-color: var(--color-white);
        }
        &:hover {
          background-color: var(--color-primary-400);
        }
        &:focus {
          background-color: var(--color-primary-400);
          outline: 3px solid var(--color-primary-100);
        }
      }

      &.-secondary {
        border: 1px solid var(--color-secondary-button-border);
        border-left: 0;
        background-color: var(--color-white);
        --split-button-text-color: var(--color-neutral-700);
        font-weight: 500;
        &:not(.-disabled) > .label-btn {
          border: 1px solid var(--color-secondary-button-border);
          background-color: var(--color-white);
          --split-button-text-color: var(--color-neutral-500);
        }
        &:hover {
          background-color: var(--color-neutral-100);
          border-color: var(--color-secondary-button-border-hover);
        }
        &:focus {
          background-color: var(--color-white);
          outline: 3px solid var(--color-secondary-button-border-hover);
        }
      }

      &.-tertiary {
        background-color: var(--color-neutral-800);
        --split-button-text-color: var(--color-white);
        &:hover {
          background-color: var(--color-neutral-700);
        }
        &:focus {
          background-color: var(--color-neutral-700);
          outline: 3px solid var(--color-neutral-300);
        }
      }

      &.-warning {
        background-color: var(--color-status-error);
        --split-button-text-color: var(--color-white);
      }

      &.-text {
        --split-button-text-color: var(--color-neutral-500);
      }

      .split-arrow-icon {
        transform: rotate(90deg);
      }
    }

    /* Pour s'assurer que le contenu du popper se comporte comme dans le composant multi-action */
    .u-multi-action-popper {
      [x-arrow] {
        display: none;
      }
    }
  }
</style>
