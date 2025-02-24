<template>
  <div class="u-indexed-section" ref="sectionRef">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useIntersectionObserver } from '@/composabes/layout/useIntersectionObserver';

  defineProps<{
    menuTitle: string;
  }>();

  const emit = defineEmits(['intersection-ratio']);

  const sectionRef = ref<HTMLElement | null>(null);
  const { intersectionRatio } = useIntersectionObserver(sectionRef);

  watch(intersectionRatio, (newRatio) => {
    emit('intersection-ratio', newRatio);
  });
</script>

<style lang="scss">
  .u-indexed-section {
    margin: 20px 0;
    border-radius: 4px;
    box-shadow: 0 0 5px 0 rgba(205, 210, 223, 0.5);
    background-color: var(--color-background-white);
    padding: 24px 30px;
    width: 664px;
  }
</style>
