<template>
  <div class="u-help-button">
    <u-popper :title="title" :placement="placement" :width="width" :trigger="trigger">
      <template #reference>
        <div class="help-trigger">
          <span v-if="hasLabel" class="u-help-label">
            {{ $t('commons.help') ?? 'Help' }}
          </span>
          <icon-base
            v-if="withIcon"
            class="-button-like"
            :color="active ? 'var(--color-primary-500)' : 'var(--color-neutral-700)'"
            :icon="active ? 'icon-help-on' : 'icon-help-off'"
            :size="size"
          />
        </div>
      </template>
      <slot />
    </u-popper>
  </div>
</template>

<script setup lang="ts">
  import UPopper from './UPopper.vue';
  import IconBase from '../icons/IconBase.vue';
  import { Placement, TooltipTriggerType } from 'element-plus';

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
    withIcon: {
      type: Boolean,
      default: true,
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
</style>
