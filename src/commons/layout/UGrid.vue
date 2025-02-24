<template>
  <div class="u-grid-container">
    <div v-if="showContent" class="grid-content">
      <slot />
    </div>

    <div v-else class="grid-empty">
      <img slot="empty-image" src="@/assets/images/svg/empty_notif.svg" />
      <span>{{ emptyLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    showContent: {
      type: Boolean,
      default: true,
    },
    emptyLabel: {
      type: String,
    },
  });
</script>

<style lang="scss" scoped>
  .u-grid-container {
    .grid-content {
      display: grid;
      grid-gap: 20px;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      margin-bottom: 32px;
      transition: opacity 0.2s linear;
    }

    .grid-empty {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 100px;
      max-height: 250px;

      span {
        color: var(--color-neutral-500);
        padding-top: 12px;
      }
    }
  }
</style>
