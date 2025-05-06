<template>
  <el-popover :title="title" :placement="placement" :width="width" :trigger="trigger">
    <template #reference>
      <slot name="reference">
        <span></span>
      </slot>
    </template>
    <div class="popper-content">
      <slot />
    </div>
  </el-popover>
</template>

<script setup lang="ts">
  import { ElPopover, Placement, TooltipTriggerType } from 'element-plus';

  defineProps({
    title: {
      type: String,
      default: '',
    },
    placement: {
      type: String as () => Placement,
      default: 'right',
    },
    width: {
      type: [String, Number],
      default: 'auto',
    },
    trigger: {
      type: String as () => TooltipTriggerType,
      default: 'click',
    },
  });
</script>

<style lang="scss">
  .el-popover.el-popper {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-items: center;
    border: 1px solid var(--color-input-border);
    border-radius: 4px;
    box-shadow: var(--box-shadow-xl);
    background-color: var(--color-background-white);
  }

  .el-popover.el-popper .el-popper__arrow::before {
    border-color: var(--color-input-border);
    background: var(--color-background-white);
  }

  .popper-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    word-wrap: break-word;
    width: 100%;
    cursor: initial;
    p,
    b,
    i,
    a,
    span,
    strong,
    ul,
    li {
      font-size: var(--paragraph-03);
    }
  }
</style>
