<template>
  <div class="action-button-bar" :class="placement">
    <div class="wrapper-buttons">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    placement: {
      type: String,
      default: 'high',
    },
  });
</script>

<style lang="scss">
  .action-button-bar {
    position: fixed;
    right: 0;
    z-index: 2;
    margin-right: 40px;

    &.high {
      margin-top: 0px;
    }
    &.mid {
      margin-top: 40px;
    }
    &.low {
      margin-top: 52px;
    }

    .wrapper-buttons {
      display: flex;
      flex-direction: column;
      & > button {
        margin-bottom: 15px;
      }
    }
  }
</style>
