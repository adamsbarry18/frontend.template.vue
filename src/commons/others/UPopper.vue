<template>
  <el-popover
    :title="title"
    :placement="placement"
    :width="width"
    :trigger="trigger"
  >
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

  // type TooltipTriggerType = "hover" | "focus" | "click" | "contextmenu"

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
      default: 360,
    },
    trigger: {
      type: String as () => TooltipTriggerType,
      default: 'click',
    },
  });
</script>

<style lang="scss" scoped>
  .popper-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    word-wrap: break-word;
    margin-top: 5px;
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
