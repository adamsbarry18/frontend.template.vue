<template>
  <div
    :style="{
      'background-color': color,
      width: size + 'px',
      height: size + 'px',
      'line-height': size + 'px',
      'font-size': fontSize + 'px',
    }"
    class="u-color-initials"
    :class="['-' + colorBrightness]"
  >
    {{ initial }}
  </div>
</template>

<script lang="ts" setup>
  import { getColorContrast } from '@/libs/utils/Color.js';
  import { computed } from 'vue';

  const props = defineProps({
    size: {
      type: [Number, String],
      default: 35,
    },
    fontSize: {
      type: [Number, String],
      default: 25,
    },
    color: {
      type: String,
      default: 'var(--color-blue-300)',
    },
    initial: {
      type: String,
      required: true,
    },
  });

  const colorBrightness = computed(() => {
    return getColorContrast(props.color);
  });
</script>

<style lang="scss">
  .u-color-initials {
    display: inline-block;
    border-radius: 50%;
    cursor: pointer;
    text-align: center;
    color: var(--color-white);
    font-weight: 700;
    &.-dark {
      color: var(--color-neutral-800);
    }
  }
</style>
