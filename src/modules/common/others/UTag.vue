<template>
  <div class="u-tag" :style="{ backgroundColor, color }">
    <icon-base v-if="icon" :icon="icon" :size="iconSize" :color="color" />
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { IconBase } from '@/modules/common';

  interface Props {
    icon?: string | null;
    iconSize?: number;
    color?: string;
    backgroundColor?: string;
  }

  const props = defineProps<Props>();

  // Valeurs par défaut
  const defaultProps: Required<Props> = {
    icon: 'icon-tag',
    iconSize: 24,
    color: 'var(--color-neutral-800)',
    backgroundColor: 'var(--color-neutral-100)',
  };

  // Fusion des valeurs par défaut
  const icon = props.icon ?? defaultProps.icon;
  const iconSize = props.iconSize ?? defaultProps.iconSize;
  const color = props.color ?? defaultProps.color;
  const backgroundColor = props.backgroundColor ?? defaultProps.backgroundColor;
</script>

<style lang="scss">
  .u-tag {
    display: inline-flex;
    align-items: center;
    border-radius: 16px;
    padding: 4px 8px;

    &.-round {
      border-radius: 50%;
      padding: 4px;

      .u-icon {
        margin: 0;
      }
    }

    &.-list-tag {
      font-weight: 600;
      font-size: var(--caption) !important;
      text-transform: capitalize;
    }

    .u-icon {
      margin-right: 4px;
    }

    span {
      font-size: var(--paragraph-03);
    }
  }
</style>
