<template>
  <el-tooltip
    effect="light"
    :placement="validatedPlacement"
    :open-delay="50"
    class="u-tooltip-wrapper"
  >
    <slot />
    <template #content>
      <div class="tooltip-content">
        <slot name="content" />
      </div>
    </template>
  </el-tooltip>
</template>

<script setup lang="ts">
  import { ElTooltip } from 'element-plus';
  import { computed } from 'vue';
  import type { Placement } from 'element-plus';

  const props = defineProps({
    placement: {
      type: String as () => Placement,
      default: 'right',
      validator: (value: Placement) => {
        return [
          'top',
          'top-start',
          'top-end',
          'bottom',
          'bottom-start',
          'bottom-end',
          'left',
          'left-start',
          'left-end',
          'right',
          'right-start',
          'right-end',
        ].includes(value);
      },
    },
  });

  const validatedPlacement = computed(() => {
    if (props.placement) {
      return props.placement;
    }
    return 'right';
  });
</script>

<style lang="scss" scoped>
  .u-tooltip-wrapper {
    display: inline-block;
  }

  .tooltip-content {
    display: flex;
    flex-direction: column;
    justify-items: center;
    word-wrap: break-word;

    p,
    i,
    a,
    span,
    b,
    strong,
    div,
    ul,
    li {
      font-size: var(--paragraph-03);
    }

    ul {
      margin: 0;
      padding: 0;
      max-height: 300px;
      overflow: auto;
      list-style: disc;
      display: list-item;
      padding: 8px;

      &::-webkit-scrollbar {
        width: 5px;
      }

      li {
        padding: 4px 0;
        margin-left: 1em;

        span.align-numbers {
          float: right;
          padding-left: 15px;
          font-weight: 500;
        }
      }
    }
  }
</style>
