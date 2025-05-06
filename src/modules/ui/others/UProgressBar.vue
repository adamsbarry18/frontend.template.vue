<template>
  <div
    class="u-progress-bar"
    :title="displayTitle ? `${percent}%` : ''"
    :style="{
      height: `${height}px`,
    }"
  >
    <div
      class="filled-bar"
      :style="{
        width: `${percent}%`,
        backgroundColor: percent > 100 ? overloadColor : color,
      }"
    />

    <div
      v-if="incrementPercent > 0"
      class="increment-bar"
      :class="{ '-is-full': incrementPercent >= percent }"
      :style="{
        left: `${incrementBarOffset}%`,
        width: `${Math.min(percent, incrementPercent)}%`,
        backgroundColor: incrementColor,
      }"
    />

    <div v-if="displayPercent" class="bar-text">{{ percent }}%</div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  // Define props with type annotations
  const props = defineProps({
    percent: {
      type: Number,
      required: true,
    },
    incrementPercent: {
      type: Number,
      default: 0,
    },
    displayPercent: {
      type: Boolean,
      default: true,
    },
    displayTitle: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: 'var(--color-green-600)',
    },
    incrementColor: {
      type: String,
      default: 'var(--color-green-500)',
    },
    overloadColor: {
      type: String,
      default: 'var(--color-orange-600)',
    },
    height: {
      type: Number,
      default: 24,
    },
  });

  // Calculate the increment bar offset
  const incrementBarOffset = computed(() => {
    return Math.min(Math.max(0, props.percent - props.incrementPercent), 100 - props.incrementPercent);
  });
</script>

<style lang="scss" scoped>
  .u-progress-bar {
    position: relative;
    border-radius: 4px;
    background-color: var(--color-background-light);
    width: 220px;
    overflow: hidden;

    .filled-bar {
      display: flex;
      align-items: center;
      max-width: 100%;
      height: 100%;
      text-align: center;
      border-radius: 4px;
      color: var(--color-white);
      font-weight: 500;
      transition: width 0.3s ease;
    }

    .increment-bar {
      position: absolute;
      top: 0;
      max-width: 100%;
      height: 100%;
      border-radius: 0 4px 4px 0;
      color: var(--color-white);
      font-weight: 500;
      transition:
        left 0.3s ease,
        width 0.3s ease;

      &.-is-full {
        border-radius: 4px;
      }
    }

    .bar-text {
      position: absolute;
      text-align: center;
      left: 50%;
      top: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
      font-weight: 600;
      color: var(--color-neutral-800);
      pointer-events: none;
    }
  }
</style>
