<template>
  <div v-if="show" ref="popper" class="u-multi-action-popper u-popper">
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
      <template v-slot:content v-if="item.tooltip">
        {{ item.tooltip }}
      </template>
    </u-tooltip>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import UTooltip from '@/commons/others/UTooltip.vue';
  import IconBase from '@/commons/icons/IconBase.vue';

  interface IMultiActionItem {
    label: string;
    disabled?: boolean;
    icon?: string;
    tooltip?: string;
    onClick?: () => void;
  }

  defineProps<{
    items: IMultiActionItem[];
  }>();

  const emit = defineEmits(['hide']);

  const popper = ref<HTMLElement | null>(null);
  const show = ref(false);

  const onClick = (item: IMultiActionItem) => {
    if (!item.disabled) {
      item.onClick?.();
      show.value = false;
      emit('hide');
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popper.value && !popper.value.contains(event.target as Node)) {
      hideMenu();
    }
  };

  const showMenu = () => {
    document.addEventListener('click', handleClickOutside);
    show.value = true;
  };

  const hideMenu = () => {
    show.value = false;
    emit('hide');
  };

  defineExpose({ showMenu, hideMenu });
</script>

<style lang="scss">
  .u-multi-action-popper {
    display: flex;
    flex-direction: column;
    justify-items: center;
    margin-top: 5px;
    border: solid 1px var(--color-neutral-100);
    border-radius: 5px;
    box-shadow: var(--box-shadow-m);
    background-color: var(--color-white);
    min-width: 210px;

    & > [x-arrow] {
      margin-left: 17px;
    }

    .action-item {
      display: flex;
      align-items: center;
      cursor: pointer;
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
