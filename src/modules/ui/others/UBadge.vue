<template>
  <div :class="['u-badge', { 'is-hidden': hidden }]">
    <el-badge :value="count" :hidden="count === 0">
      <div class="icon-container">
        <icon-base :icon="icon" :size="size" :color="color" />
      </div>
    </el-badge>
    <span v-if="$slots.default" class="icon-label">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
  import IconBase from '../icons/IconBase.vue';
  import { ElBadge } from 'element-plus';

  defineProps({
    icon: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 24,
    },
    count: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      default: 'var(--color-neutral-500)',
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style lang="scss">
  .u-badge {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    color: var(--el-text-color-regular);
    transition:
      color 0.2s ease-in-out,
      background-color 0.2s ease-in-out;
    padding: 4px 8px;
    border-radius: 4px;

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-color-info-light-9);
    }

    .icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-label {
      margin-left: 4px;
      font-size: var(--el-font-size-base);
    }

    .el-badge {
      .el-badge__content {
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
      }
    }

    &.is-hidden {
      display: none;
    }
  }
</style>
