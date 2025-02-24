<template>
  <div class="u-alert-card" :class="['-' + type]">
    <icon-base
      class="icon"
      :color="classColor[type]"
      :height="32"
      :icon="typeIcon[type]"
      :width="32"
    />
    <div class="alert-content-wrapper">
      <div class="alert-heading">
        <slot name="title" />
      </div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import IconBase from '../icons/IconBase.vue';

  interface Props {
    type: 'info' | 'success' | 'warning' | 'danger';
  }

  withDefaults(defineProps<Props>(), {
    type: 'info',
  });

  const classColor = computed(() => ({
    info: 'var(--color-blue-600)',
    success: 'var(--color-green-600)',
    warning: 'var(--color-orange-600)',
    danger: 'var(--color-red-600)',
  }));

  const typeIcon = computed(() => ({
    info: 'icon-info',
    success: 'icon-success',
    warning: 'icon-warning',
    danger: 'icon-danger',
  }));
</script>

<style lang="scss">
  .u-alert-card {
    display: flex;
    align-items: center;
    border-radius: 4px;
    padding: 8px 12px 8px 8px;
    font-size: var(--paragraph-03);

    .icon {
      margin-right: 14px;
    }

    &.-info {
      background-color: var(--color-blue-50);
      * {
        color: var(--color-blue-700);
      }
    }

    &.-success {
      background-color: var(--color-green-50);
      * {
        color: var(--color-green-600);
      }
    }

    &.-warning {
      background-color: var(--color-orange-50);
      * {
        color: var(--color-orange-700);
      }
    }

    &.-danger {
      background-color: var(--color-red-50);
      * {
        color: var(--color-red-700);
      }
    }

    p,
    strong,
    b,
    ul,
    li,
    a,
    span,
    div {
      font-size: var(--caption);
    }

    .alert-heading {
      p,
      span,
      div {
        font-weight: 600;
        font-size: var(--paragraph-02);
      }
    }
  }
</style>
