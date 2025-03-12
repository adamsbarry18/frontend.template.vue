<template>
  <div class="u-multi-action-button">
    <u-button type="secondary" :disabled="disabled" @click="displayMenu">
      <icon-base
        class="multi-icon"
        icon="icon-contextual-menu"
        :size="40"
        color="var(--color-neutral-800)"
      />
    </u-button>
    <u-popper
      v-model:visible="active"
      placement="top"
      :width="230"
      trigger="click"
    >
      <template #default>
        <div class="u-multi-action-popper">
          <div x-arrow />
          <u-tooltip v-for="item in items" :key="item.label" placement="right">
            <div
              class="action-item"
              :class="{ '-disabled': item.disabled }"
              @click="onClick(item)"
            >
              <icon-base
                v-if="item.icon"
                :icon="item.icon"
                :size="24"
                color="var(--color-neutral-500)"
              />
              <span>{{ item.label }}</span>
            </div>
            <template #content v-if="item.tooltip">
              {{ item.tooltip }}
            </template>
          </u-tooltip>
        </div>
      </template>
    </u-popper>
  </div>
</template>

<script setup lang="ts">
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

  const props = defineProps<{
    items: IMultiActionItem[];
    disabled?: boolean;
  }>();

  const emit = defineEmits(['toggle']);

  const active = ref(false);

  /**
   * Inverse l'état d'affichage du menu et émet l'événement de toggle
   */
  const displayMenu = () => {
    active.value = !active.value;
    emit('toggle', active.value);
  };

  /**
   * Exécute l'action associée à l'item et referme le menu
   */
  const onClick = (item: IMultiActionItem) => {
    if (!item.disabled) {
      item.onClick?.();
      active.value = false;
      emit('toggle', active.value);
    }
  };

  defineExpose({ displayMenu });
</script>

<style lang="scss">
  .u-multi-action-button {
    display: flex;

    .u-button {
      flex-grow: 1;

      .multi-icon {
        transform: rotate(90deg);
      }
    }
  }

  .u-multi-action-popper {
    display: flex;
    flex-direction: column;
    justify-items: center;
    margin-top: 5px;
    min-width: 210px;

    & > [x-arrow] {
      margin-left: 17px;
    }

    .action-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      border-bottom: 1px solid var(--color-neutral-200);
      padding: 8px 16px;

      &:hover:not(.-disabled) {
        border-radius: 4px;
        background-color: var(--color-neutral-100);
      }

      &.-disabled {
        background-color: var(--color-button-disabled-background);
        color: var(--color-button-disabled-content);
        cursor: not-allowed;
      }

      & > span {
        margin-left: 8px;
        font-size: var(--paragraph-03);
      }
    }
  }
</style>
