<template>
  <div class="u-tab-title" :class="modeClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    mode: 'classic' | 'new' | 'compagny';
  }>();

  const modeClass = computed(() => props.mode);
</script>

<style lang="scss" scoped>
  .u-tab-title {
    align-items: center;
    cursor: pointer;
    display: flex;
    justify-content: center;

    &.classic {
      border-right: 1px solid var(--color-neutral-100);
      font-weight: 500;
      height: 54px;
      line-height: 32px;
      min-width: 65px;
      overflow: hidden;
      padding: 0 30px;
      text-transform: uppercase;
      white-space: nowrap;

      &:first-child {
        border-left: 1px solid var(--color-neutral-100);
      }

      &.-active {
        background: var(--color-background-light);
        letter-spacing: 0.1px;
        font-weight: 700;
      }
    }

    &.new,
    &.compagny {
      position: relative;
      margin-right: 20px;
      padding: 12px 0;

      &:last-child {
        margin-right: 0;
      }

      &.-active {
        color: var(--color-primary-600);
        font-weight: 600;

        span {
          color: var(--color-primary-600);
        }

        &:after {
          position: absolute;
          border-bottom: 4px solid var(--color-primary-600);
          width: 100%;
          content: '';
          bottom: 0;
        }
      }
    }

    &.-disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }

    &.-error {
      color: var(--color-status-error);

      span {
        color: var(--color-status-error);
      }
    }

    & > span {
      min-width: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    & > .u-icon {
      margin-right: 4px;
    }
  }
</style>
