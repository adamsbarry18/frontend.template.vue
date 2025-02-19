<template>
  <div class="u-help-button">
    <el-popover :placement="placement" :width="width" :trigger="trigger">
      <template #reference>
        <div class="help-trigger">
          <span v-if="hasLabel" class="u-help-label">
            {{ $t('commons.help') }}</span
          >
          <icon-base
            class="-button-like"
            :color="
              active ? 'var(--color-primary-500)' : 'var(--color-neutral-700)'
            "
            :icon="active ? 'icon-help-on' : 'icon-help-off'"
            :size="size"
          />
        </div>
      </template>
      <div class="popper-content">
        <slot />
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
  import { ElPopover, Placement, TooltipTriggerType } from 'element-plus';
  import IconBase from '@/commons/icones/IconBase.vue';

  defineProps({
    placement: {
      type: String as () => Placement,
      default: 'right',
    },
    title: {
      type: String,
      default: '',
    },
    width: {
      type: [String, Number],
      default: 360,
    },
    trigger: {
      type: String as () => TooltipTriggerType,
      default: 'click',
    },
    size: {
      type: [String, Number],
      default: 32,
    },
    hasLabel: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style lang="scss" scoped>
  .help-trigger {
    display: inline-flex;
    align-items: center;
    cursor: pointer;

    .u-help-label {
      margin-right: 8px;
      font-size: var(--paragraph-03);
    }
  }
  .popper-content {
    display: flex;
    flex-direction: column;
    justify-items: center;
    word-wrap: break-word;
    margin-top: 5px;
    width: v-bind(width);
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
