<template>
  <div class="u-pulser" />
</template>
<script setup lang="ts"></script>

<style lang="scss" scoped>
  .u-pulser {
    /** Using a css var instead of a prop for the color as prop binding glitches with animation */
    --color-pulser: var(--color-red-500);
    display: block;
    position: relative;
    border-radius: 50%;
    background-color: var(--color-pulser);
    width: 12px;
    height: 12px;
    &::before {
      display: block;
      position: absolute;
      border-radius: 50%;
      background-color: var(--color-pulser);
      width: 12px;
      height: 12px;
      animation: 1s infinite ease-out pulse;
      content: '';
      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 0.5;
        }
        80% {
          transform: scale(1.85);
          opacity: 0.35;
        }
        100% {
          transform: scale(2.1);
          opacity: 0.1;
        }
      }
    }
  }
</style>
