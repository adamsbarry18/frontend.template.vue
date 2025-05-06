<template>
  <div
    :style="{ height: size, width: size }"
    class="u-loader"
    :class="{ '-center': center }"
  >
    <svg
      :style="{ height: size, width: size }"
      viewBox="25 25 50 50"
      class="circular-chart"
    >
      <circle
        class="circle-bg"
        cx="50"
        cy="50"
        r="20"
        fill="none"
        :stroke-width="strokeWidth"
        stroke-miterlimit="10"
      />
      <circle
        class="circle"
        cx="50"
        cy="50"
        r="20"
        fill="none"
        :stroke-width="strokeWidth"
        stroke-miterlimit="10"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  interface Props {
    center?: boolean;
    size?: string;
  }

  withDefaults(defineProps<Props>(), {
    center: false,
    size: '100px',
  });

  const strokeWidth = computed(() => 2);
</script>

<style lang="scss">
  .u-loader {
    display: inline-grid;
    position: relative;
    overflow: hidden;

    &.-center {
      margin: auto;
    }

    .circular-chart {
      position: absolute;
      top: 0;
      left: 0;
      animation: rotateloader 2s linear infinite;

      .circle-bg {
        fill: none;
        stroke: var(--color-primary-100);
      }

      .circle {
        stroke: var(--color-primary-500);
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0px;
        stroke-linecap: butt;
        animation: dashloader 1.5s ease-in-out infinite;
      }
    }
  }

  @keyframes rotateloader {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dashloader {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0px;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px;
    }
  }
</style>
