// useIntersectionObserver.ts
import { ref, onMounted, onBeforeUnmount, Ref } from 'vue';

export function useIntersectionObserver(
  target: Ref<Element | null>,
  options?: IntersectionObserverInit
) {
  const intersectionRatio = ref(0);
  let observer: IntersectionObserver | null = null;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: [0.0, 0.1, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0],
    ...options,
  };

  const callback: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.target === target.value) {
        intersectionRatio.value = entry.intersectionRatio;
      }
    });
  };

  onMounted(() => {
    if (target.value) {
      observer = new IntersectionObserver(callback, observerOptions);
      observer.observe(target.value);
    }
  });

  onBeforeUnmount(() => {
    if (observer && target.value) {
      observer.unobserve(target.value);
      observer.disconnect();
    }
  });

  return {
    intersectionRatio,
  };
}
