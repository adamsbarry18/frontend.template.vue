<template>
  <el-collapse-item
    class="u-accordion-item"
    :title="title"
    :name="name"
    :disabled="disabled"
    :class="{ '-disabled': disabled }"
  >
    <template #title>
      <slot name="title" />
    </template>
    <slot />
  </el-collapse-item>
</template>

<script lang="ts" setup>
  import { ElCollapseItem } from 'element-plus';

  interface Props {
    name: string;
    title?: string;
    disabled?: boolean;
  }

  defineProps<Props>();
</script>

<style lang="scss">
  .u-accordion-item {
    display: flex;
    flex-direction: column;
    flex-shrink: 1;
    min-height: 48px;
    overflow: hidden;

    svg {
      margin-right: 4px;
    }

    .el-collapse-item__header {
      padding: 16px;
      height: 48px;
      font-size: var(--paragraph-03);

      .el-collapse-item__arrow {
        transform: rotate(-90deg);
        font-size: var(--paragraph-02);
        font-weight: 800;
      }
    }

    &.is-active {
      .el-collapse-item__header {
        .el-collapse-item__arrow {
          transform: rotate(90deg);
        }
      }
    }

    &.-disabled {
      .el-collapse-item__header {
        background: var(--color-input-disabled-background);
        color: var(--color-input-disabled-content);

        span {
          color: var(--color-input-disabled-content);
        }

        .el-collapse-item__arrow {
          color: var(--color-input-disabled-content);
        }
      }
    }

    .el-collapse-item__wrap {
      overflow: auto;
      scrollbar-width: thin;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        border-radius: 5px;
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
      }
    }

    .el-collapse-item__content {
      background: var(--color-neutral-100);
      padding: 8px 0;
    }
  }
</style>
