<template>
  <div
    class="u-figure"
    :class="[!!icon ? '-icon' : '', size ? '-' + size : '']"
  >
    <div class="u-figure-row">
      <icon-base
        v-if="icon"
        class="u-figure-icon"
        :icon="icon"
        :size="iconSize"
        :color="iconColor"
        :rich-color="iconRichColor"
        :rich="true"
      />
      <span class="u-figure-figure"> {{ modelValue }}</span>
    </div>
    <slot name="between" />
    <div class="u-figure-label">
      <span v-if="label">{{ label }}</span>
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { IconBase } from '@/modules/common';

  defineProps({
    modelValue: {
      type: null,
    },
    label: {
      type: String,
    },
    icon: {
      type: String,
    },
    iconSize: {
      type: Number,
      default: 55,
    },
    iconColor: {
      type: String,
      default: 'var(--color-neutral-800)',
    },
    iconRichColor: {
      type: String,
    },
    size: {
      type: String,
    },
  });
</script>

<style lang="scss">
  .u-figure {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &.-reverse {
      flex-direction: column-reverse;
    }
    &.-align-left {
      align-items: flex-start;
      .u-figure-label {
        text-align: left;
      }
    }

    &.-small {
      .u-figure-row .u-figure-figure {
        font-size: var(--subheading);
      }
    }

    &.-medium {
      .u-figure-row .u-figure-figure {
        font-size: 24px;
      }
    }

    .u-figure-row {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      .u-figure-figure {
        font-size: var(--heading-01);
        font-weight: 800;
        white-space: nowrap;
      }
      .u-figure-icon {
        margin-right: 4px;
      }
    }

    .u-figure-label {
      display: flex;
      align-items: center;
      text-align: center;
      span {
        font-size: var(--paragraph-03);
      }
    }
  }
</style>
