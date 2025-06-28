<template>
  <lottie-player
    :src="props.src"
    :background="props.background"
    :speed="props.speed"
    :loop="props.loop"
    :autoplay="props.autoplay"
  ></lottie-player>
</template>

<script setup lang="ts">
  const props = defineProps({
    src: {
      type: String,
      required: true,
    },
    background: {
      type: String,
      default: 'transparent',
    },
    speed: {
      type: [String, Number], // Allow string for speed
      default: 1,
    },
    loop: {
      type: [Boolean, String], // Allow string for loop
      default: true,
    },
    autoplay: {
      type: [Boolean, String], // Allow string for autoplay
      default: true,
    },
  });
</script>
