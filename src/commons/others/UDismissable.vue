<template>
  <transition>
    <div
      v-show="visible"
      class="u-dismissable"
      :class="{ '-error': type === 'error' }"
    >
      <span
        v-if="closeable"
        class="u-dismissable-close material-icons icon-clear"
        @click.stop="onClose"
        >{{ label }}</span
      >
      <div class="icon-wrapper">
        <icon-base
          :icon="icon"
          :size="22"
          :color="
            type === 'error'
              ? 'var(--color-status-error)'
              : 'var(--color-neutral-700)'
          "
        />
      </div>
      <slot />
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import IconBase from '../icons/IconBase.vue';
  defineProps({
    closeable: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: 'Clear',
    },
  });

  const emit = defineEmits<{
    (e: 'close'): void;
  }>();

  const visible = ref(true);

  const onClose = () => {
    emit('close');
    visible.value = false;
  };
</script>

<style lang="scss" scoped>
  .u-dismissable {
    display: flex;
    position: relative;
    align-items: center;
    transition: all 0.5s ease-in-out;
    border-top: 1px solid var(--color-neutral-100);
    border-bottom: 1px solid var(--color-neutral-100);
    background-color: var(--color-white);
    padding: 16px;
    padding-right: 24px;
    min-height: 120px;
    font-size: var(--paragraph-03);

    &.v-leave-to {
      transform: scale(0);
      opacity: 0;
    }

    &.-error {
      border-left: 5px solid var(--color-status-error);
      padding-left: 11px;
      .icon-wrapper {
        border-color: var(--color-status-error);
      }
    }

    .icon-wrapper {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      border: 1px solid var(--color-neutral-300);
      border-radius: 50%;
      width: 30px;
      height: 30px;
    }

    .u-dismissable-close {
      position: absolute;
      top: 8px;
      right: 8px;
      transform-origin: center center;
      transition: all 0.2s ease-in-out;

      cursor: pointer;
      width: 16px;
      height: 16px;
      text-align: center;
      color: var(--color-neutral-500);
      font-size: var(--subheading);
      user-select: none;
    }
  }
</style>
