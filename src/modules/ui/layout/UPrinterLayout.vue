<template>
  <div class="u-printer-layout">
    <div v-if="$slots.left" class="left-printer">
      <slot name="left" />
    </div>
    <div class="center-panel" :class="{ '-has-left': !!$slots.left, '-has-right': !!$slots.right }">
      <slot />
    </div>
    <div v-if="$slots.right" class="right-printer">
      <slot name="right" />
    </div>
  </div>
</template>
<script setup lang="ts"></script>

<style lang="scss">
  .u-printer-layout {
    display: flex;
    flex-wrap: nowrap;
    align-items: stretch;
    height: 100%;

    & > .center-panel {
      flex-grow: 1;
      margin: 20px 0;
      border-radius: 8px;
      background-color: var(--color-white);
      padding: 32px;
      overflow-x: auto;
      &.-has-right {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      &.-has-left {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    & > .right-printer,
    & > .left-printer {
      flex-basis: 320px;
      flex-grow: 0;
      flex-shrink: 0;
      z-index: 2;
      border-radius: 4px;
      background-color: var(--color-white);
      padding: 32px 28px;
    }
  }
</style>
