<template>
  <u-popper v-model:visible="visible" placement="bottom-start">
    <div class="u-add-filter-popper u-popper">
      <div
        v-for="key in filterKeys"
        :key="key"
        class="filter-button"
        @click="addFilter(key)"
      >
        {{ config[key].label }}
      </div>
    </div>
  </u-popper>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import UPopper from '../others/UPopper.vue';

  const props = defineProps({
    config: {
      type: Object,
    },
  });

  const emit = defineEmits<{
    (e: 'add-filter', key: string): void;
    (e: 'hide'): void;
  }>();

  // Contrôle de la visibilité du popper via v-model:visible
  const visible = ref(false);

  const filterKeys = computed(() => Object.keys(props.config || {}));

  function addFilter(key: string) {
    emit('add-filter', key);
    visible.value = false;
  }

  function showFilterPopper(reference: HTMLElement) {
    // Ici, la référence peut être utilisée si besoin pour positionner le popper
    visible.value = true;
  }

  defineExpose({ showFilterPopper });
</script>

<style lang="scss" scoped>
  .u-add-filter-popper {
    display: flex;
    flex-direction: column;
    justify-items: center;
    cursor: pointer;
    width: 225px;
    .filter-button {
      background-color: transparent;
      padding: 12px 40px;
      color: var(--color-neutral-800);
      font-size: var(--paragraph-03);
      user-select: none;
      &:hover {
        background-color: var(--color-neutral-100);
      }
    }
  }
</style>
