<template>
  <UPopper v-model:visible="visible" placement="bottom-start">
    <!-- Le slot "reference" est laissé vide (la référence sera gérée par le parent) -->
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
  </UPopper>
</template>

<script setup lang="ts">
  import { ref, computed, defineExpose } from 'vue';
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
    margin-top: 5px;
    border: solid 1px var(--color-neutral-100);
    box-shadow: 0 0px 10px 1px rgba(47, 50, 76, 0.15);
    background-color: var(--color-background-white);
    cursor: pointer;
    padding: 5px 0;
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
