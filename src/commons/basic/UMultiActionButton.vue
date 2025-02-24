<template>
  <div ref="button" class="u-multi-action-button">
    <u-button type="secondary" :disabled="disabled" @click="displayMenu">
      <icon-base
        class="multi-icon"
        icon="icon-contextual-menu"
        :size="40"
        color="var(--color-neutral-800)"
      />
    </u-button>
    <u-multi-action-popper
      ref="menu"
      :items="items"
      placement="top"
      @hide="onHidePopper"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import UButton from '@/commons/basic/UButton.vue';
  import UMultiActionPopper from '@/commons/basic/UMultiActionPopper.vue';
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
    disabled?: boolean;
  }>();

  const emit = defineEmits(['toggle']);

  const button = ref<HTMLElement | null>(null);
  const menu = ref<InstanceType<typeof UMultiActionPopper> | null>(null);
  const active = ref(false);

  const displayMenu = () => {
    if (!active.value) {
      active.value = true;
      menu.value?.showMenu();
    }
  };

  const onHidePopper = () => {
    active.value = false;
    emit('toggle', active.value);
  };
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
</style>
