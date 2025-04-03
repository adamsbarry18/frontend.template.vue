<template>
  <u-tooltip
    class="u-icon-count"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <div>
      <icon-base :icon="icon" :size="size" :color="color" />
      <span
        class="count"
        :style="{
          width: `${size - 8}px`,
          height: `${size - 8}px`,
          color,
          'font-size': `${size / 2.2}px`,
        }"
      >
        {{ count }}
      </span>
    </div>
    <template #content>
      <slot />
    </template>
  </u-tooltip>
</template>
<script setup lang="ts">
  import { UTooltip, IconBase } from '@/modules/common';

  defineProps({
    icon: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 24,
    },
    count: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      default: 'var(--color-neutral-500)',
    },
  });
</script>

<style lang="scss">
  .u-icon-count {
    position: relative;
    .count {
      display: flex;
      position: absolute;
      top: 40%;
      left: 60%;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: var(--color-neutral-100);
    }
  }
</style>
