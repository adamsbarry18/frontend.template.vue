<template>
  <u-popper v-model:visible="visible" placement="bottom-start">
    <div class="u-filter-item-popper">
      <slot />
    </div>
  </u-popper>
</template>

<script setup lang="ts">
  import { ref, defineExpose } from 'vue';
  import UPopper from '../others/UPopper.vue';

  const visible = ref(false);

  function showFilterPopper(reference: HTMLElement) {
    visible.value = true;
  }

  defineExpose({ showFilterPopper });
</script>

<style lang="scss" scoped>
  .u-filter-item-popper {
    &.-numberrange {
      width: 450px;
    }
    &.-daterange {
      width: 500px;
    }
    &.-enum {
      padding: 0;
      max-height: 400px;
      overflow-y: auto;
    }
  }
</style>
