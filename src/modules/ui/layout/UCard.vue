<template>
  <div class="u-card">
    <div class="card-title-wrapper">
      <div class="card-title">
        <template v-if="title !== ''">
          <span>{{ title }}</span>
        </template>
        <template v-else>
          <slot name="title" />
        </template>
      </div>
      <div v-if="slots.actions || slots.help" class="actions">
        <template v-if="slots.actions">
          <slot name="actions" />
        </template>
        <template v-if="slots.help">
          <u-help-button class="u-card-help">
            <slot name="help" />
          </u-help-button>
        </template>
      </div>
    </div>
    <div class="card-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useSlots } from 'vue';
  import { UHelpButton } from '@/modules/ui';

  defineProps({
    title: {
      type: String,
      default: '',
    },
  });

  const slots = useSlots();
</script>

<style lang="scss" scoped>
  .u-card {
    display: flex;
    flex-direction: column;
    border-radius: 3px;
    box-shadow: var(--box-shadow-l);
    background-color: var(--color-background-white);
    width: 100%;

    .card-title-wrapper {
      display: flex;
      position: relative;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      border-radius: 4px 4px 0 0;
      background-color: var(--color-neutral-800);
      padding: 8px 12px;

      .card-title {
        display: flex;
        align-items: center;
        color: var(--color-white);

        svg {
          flex-shrink: 0;
          margin-right: 6px;
        }
      }

      .actions {
        display: flex;
        align-items: center;
      }
    }

    .card-content {
      flex-grow: 1;
      padding: 20px;
    }
  }
</style>
