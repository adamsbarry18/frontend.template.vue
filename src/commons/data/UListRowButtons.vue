<template>
  <div
    class="u-list-row-buttons"
    :style="{
      top: `${pos.top}px`,
      right: `${xPos}px`,
      height: `${pos.height}px`,
    }"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
  defineProps({
    pos: {
      type: [Object, DOMRect],
      required: true,
    },
    xPos: {
      type: Number,
      required: true,
    },
  });
</script>
<style lang="scss">
  .u-list-row-buttons {
    position: fixed;
    z-index: 1;
  }
</style>
